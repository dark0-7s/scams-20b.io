import { Request, Response } from 'express';
import { AttendanceEvent, AttendanceRecord, IngestAttendanceRequest, IngestAttendanceResponse, ListSessionsResponse, LiveUpdate, Session, StartSessionRequest, StartSessionResponse, StopSessionResponse } from '@shared/api';
import { truncatedHmacHex, constantTimeEqual } from '../utils/crypto';

// Simple in-memory store for demo purposes
const sessions = new Map<string, Session>();
const attendance = new Map<string, AttendanceRecord[]>();
const streams = new Map<string, Set<Response>>();

// Configurable secret (set SESSION_HMAC_SECRET in env for production)
const HMAC_SECRET = process.env.SESSION_HMAC_SECRET || 'change-this-secret';

function now() { return Date.now(); }
function genId(prefix: string) { return `${prefix}_${Math.random().toString(36).slice(2, 10)}`; }

export function listSessions(_req: Request, res: Response<ListSessionsResponse>) {
  res.json({ sessions: Array.from(sessions.values()) });
}

export function startSession(req: Request<{}, StartSessionResponse, StartSessionRequest>, res: Response<StartSessionResponse>) {
  const { timetableId, mode } = req.body;
  if (!timetableId || !mode) return res.status(400).json({} as any);
  // Prevent overlapping active session for the same timetable
  for (const s of sessions.values()) {
    if (s.timetableId === timetableId && s.active) {
      return res.status(409).json({} as any);
    }
  }
  const id = genId('sess');
  const session: Session = { id, timetableId, mode, startedAt: now(), active: true };
  sessions.set(id, session);
  attendance.set(id, []);
  streams.set(id, new Set());
  res.status(201).json({ session });
}

export function stopSession(req: Request<{ id: string }>, res: Response<StopSessionResponse>) {
  const { id } = req.params;
  const session = sessions.get(id);
  if (!session) return res.status(404).json({} as any);
  if (!session.active) return res.json({ session });
  session.active = false;
  session.stoppedAt = now();
  sessions.set(id, session);
  // close all SSE clients
  const set = streams.get(id);
  if (set) {
    for (const r of set) try { r.end(); } catch {}
    streams.delete(id);
  }
  res.json({ session });
}

export function streamSession(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const session = sessions.get(id);
  if (!session) return res.status(404).end();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const set = streams.get(id) || new Set<Response>();
  set.add(res);
  streams.set(id, set);

  req.on('close', () => {
    set.delete(res);
  });
}

function broadcast(id: string, update: LiveUpdate) {
  const set = streams.get(id);
  if (!set) return;
  const data = `data: ${JSON.stringify(update)}\n\n`;
  for (const r of set) {
    r.write(data);
  }
}

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

export function ingestAttendance(req: Request<{}, IngestAttendanceResponse, IngestAttendanceRequest>, res: Response<IngestAttendanceResponse>) {
  const { event } = req.body;
  const session = sessions.get(event.sessionId);
  if (!session || !session.active) return res.status(400).json({} as any);

  // basic freshness: 2 minutes window
  if (Math.abs(now() - event.timestamp) > 2 * 60 * 1000) return res.status(400).json({} as any);

  if (session.mode === 'ble' && !verifyBleHmac(event)) return res.status(401).json({} as any);

  const list = attendance.get(event.sessionId)!;
  const record: AttendanceRecord = { ...event, id: genId('att') };
  // prevent duplicates by userId
  if (list.some(r => r.userId === event.userId)) {
    return res.json({ ok: true as const, record: list.find(r => r.userId === event.userId)! });
  }
  list.push(record);
  attendance.set(event.sessionId, list);
  broadcast(event.sessionId, { type: 'attendance', data: record });
  res.json({ ok: true, record });
}

export const _internalStore = { sessions, attendance };
