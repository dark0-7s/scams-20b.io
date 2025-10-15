import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// Mock analytics data
// Student personal analytics (mock)
const mySubjectSummary = [
  { subject: "Data Structures", attended: 22, total: 24 },
  { subject: "Algorithms", attended: 18, total: 22 },
  { subject: "Computer Networks", attended: 17, total: 24 },
  { subject: "Software Engineering", attended: 20, total: 22 },
];
const mySessionHistory = [
  {
    date: "2025-01-14",
    subject: "Algorithms",
    status: "present",
    mode: "Online",
    time: "11:05 AM",
  },
  {
    date: "2025-01-15",
    subject: "Data Structures",
    status: "present",
    mode: "On-Campus",
    time: "09:15 AM",
  },
  {
    date: "2025-01-15",
    subject: "Database Lab",
    status: "present",
    mode: "On-Campus",
    time: "02:30 PM",
  },
  {
    date: "2025-01-16",
    subject: "Computer Networks",
    status: "absent",
    mode: "-",
    time: "-",
  },
];
const nextSessions = [
  { when: "Tomorrow 9:00 AM", subject: "Data Structures", room: "A-101" },
  { when: "Thu 11:00 AM", subject: "Algorithms", room: "A-202" },
  { when: "Fri 2:00 PM", subject: "Computer Networks", room: "CS-201" },
];

const attendanceTrends = [
  { month: "Aug", overall: 82, cs: 84, ece: 80, mech: 83, civil: 81 },
  { month: "Sep", overall: 85, cs: 87, ece: 83, mech: 86, civil: 84 },
  { month: "Oct", overall: 89, cs: 91, ece: 87, mech: 90, civil: 88 },
  { month: "Nov", overall: 87, cs: 89, ece: 85, mech: 88, civil: 86 },
  { month: "Dec", overall: 92, cs: 94, ece: 90, mech: 93, civil: 91 },
];

const departmentStats = [
  {
    name: "Computer Science",
    students: 320,
    avgAttendance: 91,
    courses: 24,
    satisfaction: 4.8,
  },
  {
    name: "Electronics",
    students: 285,
    avgAttendance: 87,
    courses: 20,
    satisfaction: 4.6,
  },
  {
    name: "Mechanical",
    students: 298,
    avgAttendance: 89,
    courses: 22,
    satisfaction: 4.7,
  },
  {
    name: "Civil",
    students: 244,
    avgAttendance: 86,
    courses: 18,
    satisfaction: 4.5,
  },
];

const subjectPerformance = [
  {
    subject: "Data Structures",
    attendance: 92,
    engagement: 88,
    resources: 15,
    difficulty: "High",
  },
  {
    subject: "Database Systems",
    attendance: 89,
    engagement: 85,
    resources: 12,
    difficulty: "Medium",
  },
  {
    subject: "Computer Networks",
    attendance: 85,
    engagement: 82,
    resources: 18,
    difficulty: "High",
  },
  {
    subject: "Software Engineering",
    attendance: 87,
    engagement: 89,
    resources: 14,
    difficulty: "Medium",
  },
  {
    subject: "Algorithms",
    attendance: 90,
    engagement: 91,
    resources: 16,
    difficulty: "High",
  },
];

const timeBasedAnalytics = [
  { time: "8:00 AM", attendance: 78, engagement: 65 },
  { time: "9:00 AM", attendance: 89, engagement: 85 },
  { time: "10:00 AM", attendance: 92, engagement: 89 },
  { time: "11:00 AM", attendance: 94, engagement: 91 },
  { time: "2:00 PM", attendance: 88, engagement: 83 },
  { time: "3:00 PM", attendance: 85, engagement: 80 },
  { time: "4:00 PM", attendance: 82, engagement: 75 },
];

const resourceEngagement = [
  { type: "PDF Documents", downloads: 1250, avgTime: "8 min", engagement: 85 },
  { type: "Video Lectures", views: 890, avgTime: "15 min", engagement: 92 },
  { type: "Presentations", downloads: 675, avgTime: "5 min", engagement: 78 },
  { type: "Practice Tests", attempts: 445, avgTime: "25 min", engagement: 88 },
];

export default function Analytics() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  const isLecturer = user?.role === "lecturer";
  const isCoordinator =
    user?.role === "department_moderator" || user?.role === "admin";

  const getInsightColor = (level: string) => {
    switch (level) {
      case "excellent":
        return "text-green-600 bg-green-50";
      case "good":
        return "text-blue-600 bg-blue-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (isStudent) {
    const perSubject = mySubjectSummary.map((s) => ({
      subject: s.subject,
      attendance: Math.round((s.attended / s.total) * 100),
    }));
    const overallPct = Math.round(
      (mySubjectSummary.reduce((acc, s) => acc + s.attended / s.total, 0) /
        Math.max(1, mySubjectSummary.length)) *
        100,
    );
    const defaulters = perSubject.filter((s) => s.attendance < 75);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Analytics</h1>
            <p className="text-muted-foreground">
              Your attendance progress and upcoming sessions
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Attendance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallPct}%</div>
              <Progress value={overallPct} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subjects Tracked
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mySubjectSummary.length}
              </div>
              <p className="text-xs text-muted-foreground">Active this term</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                At-Risk Subjects
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{defaulters.length}</div>
              <p className="text-xs text-muted-foreground">
                Below 75% attendance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Next Sessions
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {nextSessions.map((s, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{s.subject}</span>
                    <span className="text-muted-foreground">{s.when}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {defaulters.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle>Defaulter Warning</CardTitle>
              <CardDescription>
                Improve attendance in these subjects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {defaulters.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-medium">{d.subject}</span>
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-700"
                  >
                    {d.attendance}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>
              Your attendance percentage by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={perSubject}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="subject"
                  angle={-30}
                  textAnchor="end"
                  height={70}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="attendance" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
            <CardDescription>Finalized sessions only</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Subject</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Mode</th>
                    <th className="text-left p-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mySessionHistory.map((r, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-medium">{r.subject}</td>
                      <td className="p-3 capitalize">{r.status}</td>
                      <td className="p-3">{r.mode}</td>
                      <td className="p-3">{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            {user?.role === "admin"
              ? "Comprehensive system analytics and performance insights"
              : user?.role === "department_moderator"
                ? "Department-specific analytics and trends"
                : user?.role === "lecturer"
                  ? "Subject and student performance analytics"
                  : "Your learning analytics and progress insights"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          {user?.role !== "student" && (
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.4%</span> from last month
            </p>
            <Progress value={89.2} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Student Engagement
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.7%</div>
            <p className="text-xs text-muted-foreground">
              Resource interaction rate
            </p>
            <Progress value={85.7} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Efficiency
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.1%</div>
            <p className="text-xs text-muted-foreground">
              Automated attendance success
            </p>
            <Progress value={94.1} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Satisfaction Score
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">
              User feedback average
            </p>
            <div className="flex space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-3 h-3 rounded-full ${star <= 4 ? "bg-yellow-400" : "bg-gray-200"}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList
          className={`grid w-full ${isLecturer ? "grid-cols-3" : "grid-cols-5"}`}
        >
          <TabsTrigger value="trends">Trends</TabsTrigger>
          {!isLecturer && (
            <TabsTrigger value="departments">Departments</TabsTrigger>
          )}
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          {!isLecturer && (
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          )}
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends by Department</CardTitle>
                <CardDescription>
                  Monthly attendance patterns across departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[75, 100]} />
                    <Tooltip
                      formatter={(value, name) => [
                        `${value}%`,
                        name.toUpperCase(),
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="overall"
                      stroke="#3b82f6"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="cs"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="ece"
                      stroke="#f59e0b"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="mech"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="civil"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time-based Performance</CardTitle>
                <CardDescription>
                  Attendance and engagement by class time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeBasedAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Comparison</CardTitle>
              <CardDescription>
                Key metrics across all departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="avgAttendance"
                    fill="#3b82f6"
                    name="Avg Attendance %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {departmentStats.map((dept, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{dept.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {dept.students} students • {dept.courses} courses
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {dept.avgAttendance}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Attendance
                        </p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {dept.satisfaction}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Satisfaction
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={dept.avgAttendance} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown by subject and course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Subject</th>
                      <th className="text-left p-3">Attendance</th>
                      <th className="text-left p-3">Engagement</th>
                      <th className="text-left p-3">Resources</th>
                      <th className="text-left p-3">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectPerformance.map((subject, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{subject.subject}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span>{subject.attendance}%</span>
                            <Progress
                              value={subject.attendance}
                              className="w-16 h-2"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span>{subject.engagement}%</span>
                            <Progress
                              value={subject.engagement}
                              className="w-16 h-2"
                            />
                          </div>
                        </td>
                        <td className="p-3">{subject.resources} files</td>
                        <td className="p-3">
                          <Badge
                            variant={
                              subject.difficulty === "High"
                                ? "destructive"
                                : subject.difficulty === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {subject.difficulty}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Engagement Analytics</CardTitle>
              <CardDescription>
                How students interact with learning materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {resourceEngagement.map((resource, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{resource.type}</h4>
                      <Badge variant="outline">
                        {resource.engagement}% engaged
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usage</span>
                        <span className="font-medium">
                          {resource.downloads ||
                            resource.views ||
                            resource.attempts}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg. Time</span>
                        <span className="font-medium">{resource.avgTime}</span>
                      </div>
                      <Progress value={resource.engagement} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>
                  AI-powered recommendations and observations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">
                      Positive Trend
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Overall attendance has improved by 5.2% this semester
                    compared to last semester.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">
                      Attention Needed
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Afternoon classes (3-5 PM) show 12% lower attendance rates
                    than morning classes.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Target className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">
                      Opportunity
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Video resources have 92% engagement rate - consider creating
                    more video content.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Data-driven suggestions for improvement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-primary">
                        1
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Optimize Class Scheduling
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Consider moving high-priority subjects to morning slots
                        for better attendance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-primary">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Focus on Video Content
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Create more video tutorials for subjects with lower
                        engagement rates.
                      </p>
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
