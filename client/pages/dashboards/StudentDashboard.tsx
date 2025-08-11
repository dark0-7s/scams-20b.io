import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Users, 
  BookOpen, 
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Award,
  FileText,
  Video,
  Presentation,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data for student dashboard
const attendanceData = [
  { month: "Sep", overall: 89, target: 85 },
  { month: "Oct", overall: 91, target: 85 },
  { month: "Nov", overall: 87, target: 85 },
  { month: "Dec", overall: 93, target: 85 },
  { month: "Jan", overall: 88, target: 85 },
];

const subjectAttendance = [
  { subject: "Data Structures", present: 22, total: 24, percentage: 92, status: "excellent" },
  { subject: "Algorithms", present: 19, total: 22, percentage: 86, status: "good" },
  { subject: "Database Systems", present: 18, total: 23, percentage: 78, status: "warning" },
  { subject: "Database Lab", present: 23, total: 24, percentage: 96, status: "excellent" },
  { subject: "Computer Networks", present: 17, total: 21, percentage: 81, status: "good" },
  { subject: "Software Engineering", present: 16, total: 20, percentage: 80, status: "good" }
];

const todaySchedule = [
  { subject: "Data Structures", time: "09:00 - 10:30", room: "CS-201", lecturer: "Dr. Emily Rodriguez", type: "Lecture" },
  { subject: "Database Lab", time: "14:00 - 17:00", room: "CS-Lab-1", lecturer: "Dr. Emily Rodriguez", type: "Lab" },
  { subject: "Computer Networks", time: "17:30 - 19:00", room: "CS-204", lecturer: "Prof. Michael Chen", type: "Lecture" }
];

const recentResources = [
  { title: "Chapter 5 - Trees and Graphs", subject: "Data Structures", type: "PDF", lecturer: "Dr. Rodriguez", uploadDate: "2 days ago", isNew: true },
  { title: "SQL Joins Tutorial", subject: "Database Lab", type: "Video", lecturer: "Dr. Rodriguez", uploadDate: "3 days ago", isNew: true },
  { title: "Network Protocols Overview", subject: "Computer Networks", type: "PPT", lecturer: "Prof. Chen", uploadDate: "1 week ago", isNew: false },
  { title: "SDLC Methodologies", subject: "Software Engineering", type: "PDF", lecturer: "Dr. Wilson", uploadDate: "1 week ago", isNew: false }
];

const announcements = [
  { title: "Lab Session Rescheduled", subject: "Database Lab", message: "Tomorrow's lab moved to Friday 2:00 PM", time: "2 hours ago", isUrgent: false },
  { title: "Assignment Deadline", subject: "Data Structures", message: "Tree traversal assignment due Friday 11:59 PM", time: "1 day ago", isUrgent: true },
  { title: "New Study Materials", subject: "Algorithms", message: "Practice problems for sorting algorithms available", time: "2 days ago", isUrgent: false }
];

const attendanceDistribution = [
  { name: "Present", value: 87, color: "hsl(var(--success))" },
  { name: "Absent", value: 13, color: "hsl(var(--destructive))" }
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const overallAttendance = 87;
  const attendanceTarget = 85;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50";
      case "good": return "text-blue-600 bg-blue-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "danger": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle className="h-4 w-4" />;
      case "good": return <CheckCircle className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "danger": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, {user?.name} 🎓
            </h1>
            <p className="text-muted-foreground">
              {user?.department?.name} Department • {user?.year}{user?.year === 2 ? 'nd' : user?.year === 3 ? 'rd' : 'th'} Year • ID: {user?.studentId}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{overallAttendance}%</div>
            <p className="text-sm text-muted-foreground">Overall Attendance</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendance}%</div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={overallAttendance} className="flex-1" />
              {overallAttendance >= attendanceTarget ? (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <Target className="w-3 h-3 mr-1" />
                  On Track
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Below Target
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySchedule.length}</div>
            <p className="text-xs text-muted-foreground">
              Next: {todaySchedule[0]?.subject} at {todaySchedule[0]?.time.split(' - ')[0]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentResources.filter(r => r.isNew).length}</div>
            <p className="text-xs text-muted-foreground">
              Available for download
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">
              {announcements.filter(a => a.isUrgent).length} urgent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Attendance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Your monthly attendance progress</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[75, 100]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value}%`, 
                        name === 'overall' ? 'Your Attendance' : 'Target'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="overall" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Attendance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Present vs Absent distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={attendanceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {attendanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                    <span className="text-sm">Present (87%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-destructive rounded-full mr-2"></div>
                    <span className="text-sm">Absent (13%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject-wise Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Attendance</CardTitle>
              <CardDescription>Detailed breakdown by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {subjectAttendance.map((subject, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{subject.subject}</h4>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subject.status)}`}>
                        {getStatusIcon(subject.status)}
                        <span className="ml-1 capitalize">{subject.status}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attendance</span>
                        <span className="font-medium">{subject.present}/{subject.total} ({subject.percentage}%)</span>
                      </div>
                      <Progress value={subject.percentage} className="h-2" />
                      {subject.percentage < 85 && (
                        <p className="text-xs text-yellow-600">
                          Need {Math.ceil((85 * subject.total) / 100) - subject.present} more classes to reach 85%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.map((classItem, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className={`p-3 rounded-lg ${
                      classItem.type === 'Lab' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {classItem.type === 'Lab' ? <Users className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{classItem.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        {classItem.time} • {classItem.room}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {classItem.lecturer} • {classItem.type}
                      </p>
                    </div>
                    <Badge variant={classItem.type === 'Lab' ? 'default' : 'secondary'}>
                      {classItem.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Learning Resources</h3>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>

          <div className="grid gap-4">
            {recentResources.map((resource, index) => (
              <Card key={index} className={resource.isNew ? 'border-primary bg-primary/5' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        {resource.type === 'PDF' ? <FileText className="h-6 w-6 text-primary" /> :
                         resource.type === 'Video' ? <Video className="h-6 w-6 text-primary" /> :
                         <Presentation className="h-6 w-6 text-primary" />}
                      </div>
                      <div>
                        <h4 className="font-semibold">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.subject} • {resource.lecturer}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {resource.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {resource.isNew && (
                        <Badge variant="default" className="bg-primary">
                          New
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Important updates from your lecturers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${
                    announcement.isUrgent ? 'border-orange-200 bg-orange-50' : ''
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <div className="flex items-center space-x-2">
                        {announcement.isUrgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {announcement.subject}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {announcement.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {announcement.time}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Academic Calendar</CardTitle>
                <CardDescription>Select a date to view schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Important dates and deadlines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Assignment Due</p>
                      <p className="text-xs text-muted-foreground">Data Structures - Friday, Dec 15</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Award className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Mid-term Exams</p>
                      <p className="text-xs text-muted-foreground">All subjects - Dec 20-25</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Lab Practical</p>
                      <p className="text-xs text-muted-foreground">Database Lab - Dec 18</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
