/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export type Role = 'student' | 'teacher' | 'coordinator';

export interface UserProfile {
  id: string; // studentId or staffId
  name: string;
  role: Role;
}

export type SessionMode = 'ble' | 'online';

export interface TimetableEntry {
  id: string;
  subject: string;
  teacherId: string;
  room?: string;
  startTime: number; // epoch ms
  endTime: number; // epoch ms
}

export interface Session {
  id: string;
  timetableId: string;
  mode: SessionMode;
  startedAt: number; // epoch ms
  stoppedAt?: number; // epoch ms
  active: boolean;
}

// BLE advertisement payload fields kept within ~31 bytes when encoded compactly
export interface BLEPacket {
  sessionId: string; // short id
  studentId: string; // short id
  timestamp: number; // epoch seconds, compacted
  nonce: string; // unique per broadcast window
  mac: string; // truncated HMAC-SHA256 (e.g., first 8 bytes hex)
}

export interface AttendanceEvent {
  sessionId: string;
  userId: string;
  method: 'ble' | 'online' | 'manual';
  timestamp: number; // epoch ms
  metadata?: {
    rssi?: number;
    room?: string;
    source?: 'anchor' | 'client';
  };
}

export interface AttendanceRecord extends AttendanceEvent {
  id: string;
}

export interface ResourceItem {
  id: string;
  timetableId: string;
  title: string;
  url: string;
  uploadedAt: number;
}

export interface LiveUpdate {
  type: 'attendance';
  data: AttendanceRecord;
}

export interface ListSessionsResponse {
  sessions: Session[];
}

export interface StartSessionRequest {
  timetableId: string;
  mode: SessionMode;
}

export interface StartSessionResponse {
  session: Session;
}

export interface StopSessionResponse {
  session: Session;
}

export interface IngestAttendanceRequest {
  event: AttendanceEvent;
}

export interface IngestAttendanceResponse {
  ok: true;
  record: AttendanceRecord;
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
