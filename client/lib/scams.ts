import type {
  AttendanceEvent,
  AttendanceRecord,
  IngestAttendanceResponse,
  ListSessionsResponse,
  Session,
  SessionMode,
  StartSessionRequest,
  StartSessionResponse,
  StopSessionResponse,
  LiveUpdate,
} from '@shared/api';

const API_BASE = '';

export async function listSessions(): Promise<Session[]> {
  const r = await fetch(`${API_BASE}/api/sessions`);
  if (!r.ok) throw new Error('Failed to list sessions');
  const data: ListSessionsResponse = await r.json();
  return data.sessions;
}

export async function startSession(timetableId: string, mode: SessionMode): Promise<Session> {
  const body: StartSessionRequest = { timetableId, mode };
  const r = await fetch(`${API_BASE}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error('Failed to start session');
  const data: StartSessionResponse = await r.json();
  return data.session;
}

export async function stopSession(id: string): Promise<Session> {
  const r = await fetch(`${API_BASE}/api/sessions/${id}/stop`, { method: 'POST' });
  if (!r.ok) throw new Error('Failed to stop session');
  const data: StopSessionResponse = await r.json();
  return data.session;
}

export function openAttendanceStream(sessionId: string, onUpdate: (u: LiveUpdate) => void): () => void {
  const es = new EventSource(`${API_BASE}/api/sessions/${sessionId}/stream`);
  es.onmessage = (ev) => {
    try { onUpdate(JSON.parse(ev.data) as LiveUpdate); } catch {}
  };
  es.onerror = () => { /* keep alive; EventSource will auto-reconnect */ };
  return () => es.close();
}

export async function ingestAttendance(event: AttendanceEvent): Promise<AttendanceRecord> {
  const r = await fetch(`${API_BASE}/api/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event }),
  });
  if (!r.ok) throw new Error('Failed to ingest attendance');
  const data: IngestAttendanceResponse = await r.json();
  return data.record;
}

export function exportCsv(records: AttendanceRecord[]): string {
  const headers = ['id','sessionId','userId','method','timestamp','rssi','room','source'];
  const rows = records.map(r => [
    r.id,
    r.sessionId,
    r.userId,
    r.method,
    new Date(r.timestamp).toISOString(),
    r.metadata?.rssi ?? '',
    r.metadata?.room ?? '',
    r.metadata?.source ?? '',
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
}
