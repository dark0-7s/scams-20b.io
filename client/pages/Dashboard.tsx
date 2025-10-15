import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Megaphone, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for the attendance chart
const attendanceData = [
  { month: "Jan", attendance: 85 },
  { month: "Feb", attendance: 90 },
  { month: "Mar", attendance: 78 },
  { month: "Apr", attendance: 92 },
  { month: "May", attendance: 88 },
  { month: "Jun", attendance: 95 },
];

const subjectAttendance = [
  { subject: "Mathematics", attendance: 92, total: 24, present: 22 },
  { subject: "Physics", attendance: 88, total: 20, present: 18 },
  { subject: "Chemistry", attendance: 85, total: 22, present: 19 },
  { subject: "Computer Science", attendance: 95, total: 25, present: 24 },
];

export default function Dashboard() {
  const overallAttendance = 90;
  const totalClasses = 91;
  const totalAnnouncements = 5;

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, John Doe! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's your attendance overview for this semester. Keep up the great work!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendance}%</div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={overallAttendance} className="flex-1" />
              <span className="text-xs text-muted-foreground">{overallAttendance}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes Attended</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Out of {Math.round(totalClasses / (overallAttendance / 100))} total classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnnouncements}</div>
            <p className="text-xs text-muted-foreground">
              2 unread messages
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>Your monthly attendance percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, "Attendance"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject-wise Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>Your attendance breakdown by subject</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectAttendance.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{subject.subject}</span>
                  <span className="text-sm text-muted-foreground">
                    {subject.present}/{subject.total} ({subject.attendance}%)
                  </span>
                </div>
                <Progress value={subject.attendance} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest attendance records and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-present rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Mathematics - Calculus II</p>
                <p className="text-xs text-muted-foreground">Today, 10:00 AM - Present</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-present rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Physics - Quantum Mechanics</p>
                <p className="text-xs text-muted-foreground">Yesterday, 2:00 PM - Present</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-absent rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Chemistry - Organic Chemistry</p>
                <p className="text-xs text-muted-foreground">2 days ago, 11:00 AM - Absent</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
