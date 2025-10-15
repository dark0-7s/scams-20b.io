import { Request, Response } from 'express';
import { AttendanceEvent, AttendanceRecord, IngestAttendanceRequest, IngestAttendanceResponse, ListSessionsResponse, LiveUpdate, Session, StartSessionRequest, StartSessionResponse, StopSessionResponse } from '@shared/api';
import { truncatedHmacHex, constantTimeEqual } from '../utils/crypto';

// Firestore integration
import { getFirestore } from 'firebase-admin/firestore';
const db = getFirestore();
// No in-memory Maps; all data is in Firestore

// Configurable secret (set SESSION_HMAC_SECRET in env for production)
const HMAC_SECRET = process.env.SESSION_HMAC_SECRET || 'change-this-secret';

function now() { return Date.now(); }
function genId(prefix: string) { return `${prefix}_${Math.random().toString(36).slice(2, 10)}`; }

export async function listSessions(_req: Request, res: Response<ListSessionsResponse>) {
  const snap = await db.collection('sessions').get();
  const sessions = snap.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      timetableId: data.timetableId ?? '',
      mode: data.mode ?? '',
      startedAt: data.startedAt ?? 0,
      active: data.active ?? false,
      ...data
    };
  });
  res.json({ sessions });
}

export async function startSession(req: Request<{}, StartSessionResponse, StartSessionRequest>, res: Response<StartSessionResponse>) {
  const { timetableId, mode } = req.body;
  if (!timetableId || !mode) return res.status(400).json({} as any);
  // Prevent overlapping active session for the same timetable
  const snap = await db.collection('sessions')
    .where('timetableId', '==', timetableId)
    .where('active', '==', true)
    .get();
  if (!snap.empty) return res.status(409).json({} as any);
  const session = { timetableId, mode, startedAt: now(), active: true };
  const docRef = await db.collection('sessions').add(session);
  const sessionWithId = { id: docRef.id, ...session };
  res.status(201).json({ session: sessionWithId });
}

export async function stopSession(req: Request<{ id: string }>, res: Response<StopSessionResponse>) {
  const { id } = req.params;
  const sessionRef = db.collection('sessions').doc(id);
  const sessionSnap = await sessionRef.get();
  if (!sessionSnap.exists) return res.status(404).json({} as any);
  const session = sessionSnap.data();
  const sessionObj = {
    id,
    timetableId: session.timetableId ?? '',
    mode: session.mode ?? '',
    startedAt: session.startedAt ?? 0,
    active: session.active ?? false,
    ...session
  };
  if (!sessionObj.active) return res.json({ session: sessionObj });
  await sessionRef.update({ active: false, stoppedAt: now() });
  res.json({ session: { ...sessionObj, active: false, stoppedAt: now() } });
}

// SSE streaming would need a different approach with Firestore; omitted for brevity

// broadcast: omitted (use Firestore listeners on client)

function verifyBleHmac(event: AttendanceEvent): boolean {
  // Expect metadata to carry BLE fields when method is ble
  if (event.method !== 'ble') return true;
  // For demo, expect metadata to include concatenated data and provided mac
  // data format: `${sessionId}|${userId}|${Math.floor(timestamp/1000)}|${nonce}`
  const meta: any = event.metadata || {};
  const mac = meta.mac as string | undefined;
  const nonce = meta.nonce as string | undefined;
  const tsSec = Math.floor(event.timestamp / 1000);
  if (!mac || !nonce) return false;
  const data = `${event.sessionId}|${event.userId}|${tsSec}|${nonce}`;
  const expected = truncatedHmacHex(HMAC_SECRET, data, 8);
  return constantTimeEqual(expected, mac);
}

export async function ingestAttendance(req: Request<{}, IngestAttendanceResponse, IngestAttendanceRequest>, res: Response<IngestAttendanceResponse>) {
  const { event } = req.body;
  const sessionRef = db.collection('sessions').doc(event.sessionId);
  const sessionSnap = await sessionRef.get();
  if (!sessionSnap.exists) return res.status(400).json({} as any);
  const session = sessionSnap.data();
  if (!session.active) return res.status(400).json({} as any);

  // basic freshness: 2 minutes window
  if (Math.abs(now() - event.timestamp) > 2 * 60 * 1000) return res.status(400).json({} as any);

  if (session.mode === 'ble' && !verifyBleHmac(event)) return res.status(401).json({} as any);

  // prevent duplicates by userId
  const attRef = sessionRef.collection('attendance').doc(event.userId);
  const attSnap = await attRef.get();
  if (attSnap.exists) {
    const data = attSnap.data();
    const record = {
      id: data.id ?? '',
      sessionId: data.sessionId ?? '',
      userId: data.userId ?? '',
      method: data.method ?? '',
      timestamp: data.timestamp ?? 0,
      ...data
    };
    return res.json({ ok: true as const, record });
  }
  const record = { ...event, id: genId('att') };
  await attRef.set(record);
  res.json({ ok: true, record });
}

// No internal store; all data is in Firestore
