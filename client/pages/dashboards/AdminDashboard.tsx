import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  Database,
  Settings,
  UserPlus,
  PlusCircle,
  Activity
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// Mock data for admin dashboard
const systemStats = {
  totalStudents: 1247,
  totalLecturers: 89,
  totalDepartments: 8,
  activeCourses: 156,
  systemUptime: 99.7,
  dailyActiveUsers: 987
};

const departmentData = [
  { name: 'Computer Science', students: 320, lecturers: 18, courses: 24 },
  { name: 'Electronics', students: 285, lecturers: 15, courses: 20 },
  { name: 'Mechanical', students: 298, lecturers: 16, courses: 22 },
  { name: 'Civil', students: 244, lecturers: 14, courses: 18 },
  { name: 'Chemical', students: 100, lecturers: 26, courses: 72 }
];

const attendanceData = [
  { month: 'Sep', overall: 87, cs: 89, ece: 85, mech: 88 },
  { month: 'Oct', overall: 89, cs: 91, ece: 87, mech: 90 },
  { month: 'Nov', overall: 85, cs: 88, ece: 82, mech: 86 },
  { month: 'Dec', overall: 92, cs: 94, ece: 90, mech: 93 }
];

const systemAlerts = [
  { id: 1, type: 'warning', message: 'High server load detected in Database cluster', time: '2 hours ago' },
  { id: 2, type: 'info', message: 'Scheduled maintenance completed successfully', time: '5 hours ago' },
  { id: 3, type: 'error', message: 'Failed login attempts from IP: 192.168.1.100', time: '1 day ago' }
];

const recentActivities = [
  { action: 'New lecturer onboarded', user: 'Dr. Smith', department: 'Computer Science', time: '10 minutes ago' },
  { action: 'Course allocation updated', user: 'Prof. Johnson', department: 'Electronics', time: '1 hour ago' },
  { action: 'Department settings modified', user: 'Admin', department: 'Mechanical', time: '3 hours ago' }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Admin Office Dashboard 👩‍💼
            </h1>
            <p className="text-muted-foreground">
              Complete system oversight and institutional management
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            <Shield className="w-3 h-3 mr-1" />
            Full Access
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lecturers</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalLecturers}</div>
            <p className="text-xs text-muted-foreground">
              Across {systemStats.totalDepartments} departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.systemUptime}%</div>
            <Progress value={systemStats.systemUptime} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.dailyActiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              Peak usage: 11:00 AM - 1:00 PM
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Attendance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Institution-wide Attendance</CardTitle>
                <CardDescription>Monthly attendance trends across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 95]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="overall" stroke="hsl(var(--primary))" strokeWidth={3} />
                    <Line type="monotone" dataKey="cs" stroke="hsl(var(--success))" strokeWidth={2} />
                    <Line type="monotone" dataKey="ece" stroke="hsl(var(--destructive))" strokeWidth={2} />
                    <Line type="monotone" dataKey="mech" stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent System Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activities</CardTitle>
                <CardDescription>Latest administrative actions and system events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.department} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Department Management</h3>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </div>
          
          <div className="grid gap-4">
            {departmentData.map((dept, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {dept.students} students • {dept.lecturers} lecturers • {dept.courses} courses
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Manage</Button>
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Comparison</CardTitle>
                <CardDescription>Student distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database Performance</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Response Time</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>User Satisfaction</span>
                    <span>96%</span>
                  </div>
                  <Progress value={96} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Active system notifications and warnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                      alert.type === 'error' ? 'text-destructive' : 
                      alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Overview</CardTitle>
                <CardDescription>System security status and recent events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <p className="text-xs text-muted-foreground">Security Breaches</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <p className="text-xs text-muted-foreground">Failed Logins</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Firewall Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SSL Certificate</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Valid</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Backup Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Current</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <UserPlus className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Lecturer Onboarding</h3>
                <p className="text-sm text-muted-foreground mb-4">Add and manage lecturer accounts</p>
                <Button className="w-full">Manage Lecturers</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Course Allocation</h3>
                <p className="text-sm text-muted-foreground mb-4">Assign courses to departments and lecturers</p>
                <Button className="w-full">Manage Courses</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Timetable Management</h3>
                <p className="text-sm text-muted-foreground mb-4">Global timetable adjustments and scheduling</p>
                <Button className="w-full">Manage Timetables</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Database className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">System Configuration</h3>
                <p className="text-sm text-muted-foreground mb-4">Configure system settings and preferences</p>
                <Button className="w-full">System Settings</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground mb-4">Comprehensive system analytics and reports</p>
                <Button className="w-full">View Analytics</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Security Management</h3>
                <p className="text-sm text-muted-foreground mb-4">Monitor and manage system security</p>
                <Button className="w-full">Security Center</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
