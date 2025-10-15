// bleFirestoreIntegration.ts
// Centralized BLE attendance logic with Firestore integration for SCAMS

import { getFirestore, doc, setDoc, collection, onSnapshot, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- TypeScript Types ---
export type Session = {
  id: string;
  status: "active" | "inactive";
  startTime: number;
  endTime?: number;
};

export type Attendance = {
  studentId: string;
  timestamp: number;
  rssi: number;
  nonce: string;
  signatureValid: boolean;
  status: "present";
};

export type Student = {
  id: string;
  name: string;
  hashedId: string;
};

// --- Firestore Helpers ---
const db = getFirestore();

export async function startSession(sessionId: string) {
  await updateDoc(doc(db, `sessions/${sessionId}`), { status: "active", startTime: Date.now() });
}

export async function endSession(sessionId: string) {
  await updateDoc(doc(db, `sessions/${sessionId}`), { status: "inactive", endTime: Date.now() });
}

export async function markAttendance(
  sessionId: string,
  attendance: Attendance
) {
  await setDoc(
    doc(db, `sessions/${sessionId}/attendance/${attendance.studentId}`),
    attendance
  );
}

export function subscribeAttendance(
  sessionId: string,
  onUpdate: (attendance: Attendance) => void
) {
  return onSnapshot(
    collection(db, `sessions/${sessionId}/attendance`),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          onUpdate(change.doc.data() as Attendance);
        }
      });
    }
  );
}

// --- BLE Broadcast Example (Student App) ---
export async function broadcastBLE(packet: {
  studentIdHash: string;
  sessionId: string;
  timestamp: number;
  nonce: string;
  signature: string;
}) {
  // Platform-specific BLE broadcast logic goes here
  // This is a placeholder for the actual BLE advertisement code
}

// --- ESP32/Teacher BLE Scanning (Pseudocode) ---
// On session status = "active", ESP32 starts scanning
// On BLE packet receive:
//   1. Parse packet (studentIdHash, sessionId, timestamp, nonce, signature)
//   2. Validate HMAC signature, timestamp, RSSI
//   3. If valid, call markAttendance(sessionId, { ... }) to Firestore
//   4. If invalid, ignore or log error

// --- Error Handling ---
// Ensure to handle invalid signatures, expired timestamps, and failed proximity checks in the ESP32/Node logic before calling markAttendance.

// --- Role-based Access ---
// Students: Only call broadcastBLE after biometric auth
// Teachers: Use startSession/endSession, subscribeAttendance
// Coordinators: Use Firestore for analytics/management

// --- Usage Example (Teacher Dashboard) ---
// subscribeAttendance(sessionId, (attendance) => {
//   // Update dashboard UI in real-time
// });
