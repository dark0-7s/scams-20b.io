import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Bluetooth,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Wifi,
  AlertCircle,
  AlertTriangle,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { listSessions, startSession, stopSession, openAttendanceStream, ingestAttendance, exportCsv } from "@/lib/scams";
import type { AttendanceRecord, Session, SessionMode } from "@shared/api";

// Mock attendance data (historical)
const attendanceRecords = [
  { date: "2024-01-15", subject: "Data Structures", status: "present", time: "09:15 AM", method: "biometric" },
  { date: "2024-01-15", subject: "Database Lab", status: "present", time: "02:30 PM", method: "bluetooth" },
  { date: "2024-01-14", subject: "Algorithms", status: "present", time: "11:05 AM", method: "biometric" },
  { date: "2024-01-14", subject: "Computer Networks", status: "absent", time: "-", method: "-" },
  { date: "2024-01-13", subject: "Software Engineering", status: "present", time: "10:20 AM", method: "manual" },
  { date: "2024-01-12", subject: "Data Structures", status: "present", time: "09:12 AM", method: "biometric" }
];

const subjects = ["All Subjects", "Data Structures", "Algorithms", "Database Lab", "Computer Networks", "Software Engineering"];

const timetable = [
  { id: 'tt1', subject: 'Data Structures', teacherId: '3', room: 'A-101', startTime: Date.now(), endTime: Date.now()+3600000 },
  { id: 'tt2', subject: 'Algorithms', teacherId: '3', room: 'A-202', startTime: Date.now()+7200000, endTime: Date.now()+10800000 },
];

export default function Attendance() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [attendanceMethod, setAttendanceMethod] = useState<'biometric' | 'bluetooth' | 'manual'>('biometric');
  const [scanningStatus, setScanningStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  // Live session state (teacher/coordinator)
  const [mode, setMode] = useState<SessionMode>('ble');
  const [selectedTimetable, setSelectedTimetable] = useState<string>(timetable[0]?.id ?? '');
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [liveRecords, setLiveRecords] = useState<AttendanceRecord[]>([]);
  const unsubscribeRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    if (user && user.role !== 'student') {
      listSessions().then(s => {
        const active = s.find(x => x.active);
        if (active) {
          setActiveSession(active);
          subscribe(active.id);
        }
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  function subscribe(id: string) {
    unsubscribeRef.current?.();
    const off = openAttendanceStream(id, (u) => {
      if (u.type === 'attendance') setLiveRecords(prev => [u.data, ...prev]);
    });
    unsubscribeRef.current = off;
  }

  async function handleStartSession() {
    try {
      const sess = await startSession(selectedTimetable, mode);
      setActiveSession(sess);
      setLiveRecords([]);
      subscribe(sess.id);
      toast({ title: 'Session started', description: `${sess.mode.toUpperCase()} session is live.` });
    } catch (e) {
      toast({ title: 'Unable to start session', description: 'Check schedule/overlap.', variant: 'destructive' });
    }
  }

  async function handleStopSession() {
    if (!activeSession) return;
    try {
      const sess = await stopSession(activeSession.id);
      setActiveSession(sess);
      unsubscribeRef.current?.();
      toast({ title: 'Session stopped' });
    } catch (e) {
      toast({ title: 'Failed to stop session', variant: 'destructive' });
    }
  }

  async function handleStudentMark() {
    setIsMarkingAttendance(true);
    setScanningStatus('scanning');
    try {
      const sessions = await listSessions();
      const online = sessions.find(s => s.active && s.mode === 'online');
      if (!online) throw new Error('No active online session');
      const record = await ingestAttendance({
        sessionId: online.id,
        userId: user!.id,
        method: 'online',
        timestamp: Date.now(),
        metadata: { source: 'client' }
      });
      setScanningStatus('success');
      toast({ title: 'Attendance recorded', description: `Time: ${new Date(record.timestamp).toLocaleTimeString()}` });
    } catch (e: any) {
      setScanningStatus('failed');
      toast({ title: 'Could not mark attendance', description: e?.message ?? 'Try again later', variant: 'destructive' });
    } finally {
      setTimeout(() => { setIsMarkingAttendance(false); setScanningStatus('idle'); }, 1500);
    }
  }

  function downloadCsv(rows: AttendanceRecord[]) {
    const csv = exportCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredRecords = attendanceRecords.filter(record => {
    if (selectedSubject !== "All Subjects" && record.subject !== selectedSubject) return false;
    if (dateFrom && new Date(record.date) < dateFrom) return false;
    if (dateTo && new Date(record.date) > dateTo) return false;
    return true;
  });

  const getStatusColor = (status: string) => status === 'present' ? 'text-green-600' : 'text-red-600';
  const getStatusIcon = (status: string) => status === 'present' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'biometric': return <Fingerprint className="h-4 w-4 text-blue-600" />;
      case 'bluetooth': return <Bluetooth className="h-4 w-4 text-green-600" />;
      case 'manual': return <Users className="h-4 w-4 text-gray-600" />;
      default: return null;
    }
  };

  const presentCount = liveRecords.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">
            {user?.role === 'student' ? 'View your attendance records and mark attendance' : 'Manage attendance for your classes'}
          </p>
        </div>
        {user?.role === 'student' && (
          <Button onClick={handleStudentMark} disabled={isMarkingAttendance}>
            {isMarkingAttendance ? 'Marking...' : 'Mark Attendance'}
          </Button>
        )}
      </div>

      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          {user && user.role !== 'student' && <TabsTrigger value="live">Live Session</TabsTrigger>}
          {user?.role !== 'student' && <TabsTrigger value="mark">Mark Attendance</TabsTrigger>}
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-48">
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-48">
                <label className="text-sm font-medium mb-2 block">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 min-w-48">
                <label className="text-sm font-medium mb-2 block">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={() => {
                  const rows: AttendanceRecord[] = filteredRecords.map((r, i) => ({
                    id: String(i+1),
                    sessionId: 'history',
                    userId: user?.id || 'user',
                    method: (r.method === 'biometric' ? 'ble' : r.method === 'bluetooth' ? 'ble' : 'manual') as any,
                    timestamp: new Date(r.date + ' ' + (r.time === '-' ? '00:00' : r.time)).getTime(),
                  }));
                  downloadCsv(rows);
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                {filteredRecords.length} records found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Subject</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Time</th>
                      <th className="text-left p-3">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="p-3 font-medium">{record.subject}</td>
                        <td className="p-3">
                          <div className={`flex items-center ${getStatusColor(record.status)}`}>
                            {getStatusIcon(record.status)}
                            <span className="ml-2 capitalize">{record.status}</span>
                          </div>
                        </td>
                        <td className="p-3">{record.time}</td>
                        <td className="p-3">
                          <div className="flex items-center">
                            {getMethodIcon(record.method)}
                            <span className="ml-2 capitalize text-sm">{record.method}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role !== 'student' && (
          <TabsContent value="live" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Controls</CardTitle>
                <CardDescription>Start/stop sessions and monitor live attendance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Timetable</label>
                    <Select value={selectedTimetable} onValueChange={setSelectedTimetable}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {timetable.map(tt => (
                          <SelectItem key={tt.id} value={tt.id}>{tt.subject} • {tt.room}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mode</label>
                    <Select value={mode} onValueChange={(v) => setMode(v as SessionMode)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ble">On-Campus BLE</SelectItem>
                        <SelectItem value="online">Online (WebRTC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2">
                    {!activeSession?.active && (
                      <Button className="w-full" onClick={handleStartSession}>Start Session</Button>
                    )}
                    {activeSession?.active && (
                      <Button variant="destructive" className="w-full" onClick={handleStopSession}>Stop Session</Button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-muted-foreground">Session: {activeSession ? activeSession.id : 'None'}</div>
                    <Button variant="outline" size="sm" onClick={() => downloadCsv(liveRecords)}>
                      <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                  </div>
                  <div className="overflow-x-auto border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Student</th>
                          <th className="text-left p-3">Time</th>
                          <th className="text-left p-3">Method</th>
                          <th className="text-left p-3">Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveRecords.map(r => (
                          <tr key={r.id} className="border-b">
                            <td className="p-3">{r.userId}</td>
                            <td className="p-3">{new Date(r.timestamp).toLocaleTimeString()}</td>
                            <td className="p-3 capitalize">{r.method}</td>
                            <td className="p-3 capitalize text-xs text-muted-foreground">{r.metadata?.source ?? ''}</td>
                          </tr>
                        ))}
                        {liveRecords.length === 0 && (
                          <tr><td className="p-4 text-sm text-muted-foreground" colSpan={4}>No attendance yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {user?.role !== 'student' && (
          <TabsContent value="mark" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Methods</CardTitle>
                  <CardDescription>Choose your preferred attendance marking method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      attendanceMethod === 'biometric' ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setAttendanceMethod('biometric')}
                  >
                    <div className="flex items-center space-x-3">
                      <Fingerprint className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-semibold">Biometric Verification</h4>
                        <p className="text-sm text-muted-foreground">Fingerprint scanning for students</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      attendanceMethod === 'bluetooth' ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setAttendanceMethod('bluetooth')}
                  >
                    <div className="flex items-center space-x-3">
                      <Bluetooth className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">Bluetooth Low Energy</h4>
                        <p className="text-sm text-muted-foreground">Proximity-based detection</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      attendanceMethod === 'manual' ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setAttendanceMethod('manual')}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="h-8 w-8 text-green-500" />
                      <div>
                        <h4 className="font-semibold">Manual Entry</h4>
                        <p className="text-sm text-muted-foreground">Traditional roll call method</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Attendance</CardTitle>
                  <CardDescription>Current session attendance marking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    {attendanceMethod === 'biometric' && (
                      <div>
                        <Fingerprint className="h-16 w-16 mx-auto mb-4 text-primary" />
                        <p className="font-medium">Biometric Scanner Ready</p>
                        <p className="text-sm text-muted-foreground">Students can scan fingerprints</p>
                      </div>
                    )}

                    {attendanceMethod === 'bluetooth' && (
                      <div>
                        <Wifi className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                        <p className="font-medium">Bluetooth Detection Active</p>
                        <p className="text-sm text-muted-foreground">Scanning for student devices</p>
                      </div>
                    )}

                    {attendanceMethod === 'manual' && (
                      <div>
                        <Users className="h-16 w-16 mx-auto mb-4 text-green-500" />
                        <p className="font-medium">Manual Entry Mode</p>
                        <p className="text-sm text-muted-foreground">Ready for roll call</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Present Students</span>
                      <span className="font-medium">{presentCount}</span>
                    </div>
                    <Progress value={presentCount % 100} />
                  </div>

                  <Button className="w-full" onClick={handleStopSession} disabled={!activeSession?.active}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Attendance
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Overall Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <Progress value={87} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Classes Attended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78/90</div>
                <p className="text-xs text-muted-foreground">Total this semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 days</div>
                <p className="text-xs text-muted-foreground">Perfect attendance</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Insights</CardTitle>
              <CardDescription>Patterns and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-3">Best Performing Subjects</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Database Lab</span>
                      <span className="font-medium text-green-600">96%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Structures</span>
                      <span className="font-medium text-green-600">92%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Needs Attention</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Computer Networks</span>
                      <span className="font-medium text-yellow-600">78%</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Need 3 more classes to reach 85%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attendance Marking Modal */}
      {isMarkingAttendance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Marking Attendance</CardTitle>
              <CardDescription>
                Using {attendanceMethod} verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                {scanningStatus === 'scanning' && (
                  <div className="animate-pulse">
                    <div className="relative">
                      {attendanceMethod === 'biometric' && <Fingerprint className="h-16 w-16 mx-auto mb-4 text-primary" />}
                      {attendanceMethod === 'bluetooth' && <Bluetooth className="h-16 w-16 mx-auto mb-4 text-blue-500" />}
                      {attendanceMethod === 'manual' && <Users className="h-16 w-16 mx-auto mb-4 text-green-500" />}
                      <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping"></div>
                    </div>
                    <p className="text-sm font-medium">Scanning in progress...</p>
                    <p className="text-xs text-muted-foreground">Please wait</p>
                  </div>
                )}

                {scanningStatus === 'success' && (
                  <div>
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
                    <p className="text-sm font-medium text-green-600">Attendance Marked Successfully!</p>
                    <p className="text-xs text-muted-foreground">Present at {new Date().toLocaleTimeString()}</p>
                  </div>
                )}

                {scanningStatus === 'failed' && (
                  <div>
                    <XCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
                    <p className="text-sm font-medium text-red-600">Verification Failed</p>
                    <p className="text-xs text-muted-foreground">Please try again</p>
                  </div>
                )}
              </div>

              {scanningStatus === 'scanning' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsMarkingAttendance(false);
                    setScanningStatus('idle');
                  }}
                >
                  Cancel
                </Button>
              )}

              {scanningStatus === 'failed' && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsMarkingAttendance(false);
                      setScanningStatus('idle');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setScanningStatus('scanning')}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
