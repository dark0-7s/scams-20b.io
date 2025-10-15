import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Shield,
  Settings,
  UserCheck,
  ClipboardList,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Building
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// Mock data for department moderator dashboard
const departmentStats = {
  totalStudents: 320,
  totalLecturers: 18,
  activeCourses: 24,
  avgAttendance: 89,
  lowAttendanceCount: 12
};

const yearWiseData = [
  { year: '2nd Year', students: 108, avgAttendance: 87, courses: 8 },
  { year: '3rd Year', students: 102, avgAttendance: 91, courses: 8 },
  { year: '4th Year', students: 110, avgAttendance: 89, courses: 8 }
];

const lecturerPerformance = [
  { name: 'Dr. Emily Rodriguez', subjects: ['Data Structures', 'Algorithms'], avgAttendance: 92, students: 83, rating: 4.8 },
  { name: 'Prof. Michael Chen', subjects: ['Computer Networks', 'OS'], avgAttendance: 89, students: 76, rating: 4.6 },
  { name: 'Dr. Sarah Wilson', subjects: ['Software Engineering'], avgAttendance: 87, students: 45, rating: 4.7 },
  { name: 'Prof. James Kumar', subjects: ['Database Systems'], avgAttendance: 91, students: 41, rating: 4.9 }
];

const attendanceTrends = [
  { month: 'Sep', overall: 87, target: 85 },
  { month: 'Oct', overall: 89, target: 85 },
  { month: 'Nov', overall: 85, target: 85 },
  { month: 'Dec', overall: 92, target: 85 }
];

const pendingApprovals = [
  { type: 'Schedule Change', lecturer: 'Dr. Rodriguez', details: 'Lab session reschedule request', priority: 'medium' },
  { type: 'Resource Upload', lecturer: 'Prof. Chen', details: 'New video lecture series', priority: 'low' },
  { type: 'Timetable Conflict', lecturer: 'Dr. Wilson', details: 'Room booking overlap', priority: 'high' }
];

const recentActivities = [
  { action: 'Approved schedule change', lecturer: 'Dr. Rodriguez', time: '2 hours ago' },
  { action: 'Resolved attendance discrepancy', student: 'Student ID: CS21045', time: '4 hours ago' },
  { action: 'Updated course allocation', course: 'Advanced Algorithms', time: '1 day ago' }
];

export default function DepartmentModeratorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Department Control Center 🏢
            </h1>
            <p className="text-muted-foreground">
              {user?.department?.name} Department Management • {departmentStats.totalLecturers} Lecturers • {departmentStats.totalStudents} Students
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            <Shield className="w-3 h-3 mr-1" />
            Department Access
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lecturers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentStats.totalLecturers}</div>
            <p className="text-xs text-muted-foreground">
              Teaching {departmentStats.activeCourses} courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentStats.avgAttendance}%</div>
            <Progress value={departmentStats.avgAttendance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingApprovals.filter(p => p.priority === 'high').length} high priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Department Attendance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Department Attendance Trends</CardTitle>
                <CardDescription>Monthly attendance performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 95]} />
                    <Tooltip formatter={(value, name) => [`${value}%`, name === 'overall' ? 'Department Avg' : 'Target']} />
                    <Line type="monotone" dataKey="overall" stroke="hsl(var(--primary))" strokeWidth={3} />
                    <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest department management actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.lecturer || activity.student || activity.course} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Year-wise Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Year-wise Overview</CardTitle>
              <CardDescription>Student distribution and performance by academic year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {yearWiseData.map((year, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{year.year}</h4>
                      <Badge variant="outline">{year.courses} courses</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Students</span>
                        <span className="font-medium">{year.students}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg Attendance</span>
                        <span className="font-medium">{year.avgAttendance}%</span>
                      </div>
                      <Progress value={year.avgAttendance} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lecturers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Lecturer Management</h3>
            <Button>
              <UserCheck className="w-4 h-4 mr-2" />
              Add Lecturer
            </Button>
          </div>

          <div className="grid gap-4">
            {lecturerPerformance.map((lecturer, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <UserCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{lecturer.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {lecturer.subjects.join(', ')}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {lecturer.students} students
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {lecturer.avgAttendance}% avg attendance
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ⭐ {lecturer.rating} rating
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Distribution</CardTitle>
                <CardDescription>Students by academic year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={yearWiseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Issues</CardTitle>
                <CardDescription>Students requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <p className="text-xs text-muted-foreground">Above 85%</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{departmentStats.lowAttendanceCount}</div>
                    <p className="text-xs text-muted-foreground">Below 75%</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CS21045 - John Smith</span>
                      <Badge variant="destructive">68%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">3rd Year • Critical attendance</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CS21078 - Sarah Jones</span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">74%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">2nd Year • Warning level</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View All At-Risk Students
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pending Approvals</h3>
            <Badge variant="outline">{pendingApprovals.length} items</Badge>
          </div>

          <div className="grid gap-4">
            {pendingApprovals.map((approval, index) => (
              <Card key={index} className={
                approval.priority === 'high' ? 'border-red-200 bg-red-50' :
                approval.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                'border-gray-200'
              }>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        approval.priority === 'high' ? 'bg-red-100 text-red-700' :
                        approval.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{approval.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          From: {approval.lecturer}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {approval.details}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={
                        approval.priority === 'high' ? 'destructive' :
                        approval.priority === 'medium' ? 'default' :
                        'secondary'
                      }>
                        {approval.priority} priority
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Attendance Reports</h3>
                <p className="text-sm text-muted-foreground mb-4">Detailed attendance analytics</p>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Performance Trends</h3>
                <p className="text-sm text-muted-foreground mb-4">Monitor department performance</p>
                <Button className="w-full">View Trends</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Resource Usage</h3>
                <p className="text-sm text-muted-foreground mb-4">Track resource engagement</p>
                <Button className="w-full">View Usage</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Schedule Analytics</h3>
                <p className="text-sm text-muted-foreground mb-4">Optimize class scheduling</p>
                <Button className="w-full">Analyze Schedule</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Course Effectiveness</h3>
                <p className="text-sm text-muted-foreground mb-4">Evaluate course performance</p>
                <Button className="w-full">View Analysis</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Building className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Department Health</h3>
                <p className="text-sm text-muted-foreground mb-4">Overall department metrics</p>
                <Button className="w-full">Health Check</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
