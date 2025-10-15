import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Megaphone,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Bluetooth,
  AlertCircle,
  TrendingUp,
  FileText,
  Video,
  Presentation
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for lecturer dashboard
const todayClasses = [
  { 
    id: 1, 
    subject: 'Data Structures', 
    time: '09:00 - 10:30', 
    room: 'CS-201', 
    year: '2nd Year',
    students: 45,
    attendance: null,
    status: 'upcoming'
  },
  { 
    id: 2, 
    subject: 'Algorithms', 
    time: '11:00 - 12:30', 
    room: 'CS-203', 
    year: '3rd Year',
    students: 38,
    attendance: 36,
    status: 'completed'
  },
  { 
    id: 3, 
    subject: 'Database Lab', 
    time: '14:00 - 17:00', 
    room: 'CS-Lab-1', 
    year: '3rd Year',
    students: 24,
    attendance: null,
    status: 'current'
  }
];

const subjectStats = [
  { subject: 'Data Structures', totalClasses: 45, avgAttendance: 89, students: 45 },
  { subject: 'Algorithms', totalClasses: 42, avgAttendance: 92, students: 38 },
  { subject: 'Database Systems', totalClasses: 38, avgAttendance: 85, students: 41 },
  { subject: 'Database Lab', totalClasses: 20, avgAttendance: 94, students: 24 }
];

const recentResources = [
  { name: 'Chapter 5 - Trees and Graphs', type: 'PDF', subject: 'Data Structures', uploadDate: '2 days ago', downloads: 42 },
  { name: 'Sorting Algorithms Demo', type: 'Video', subject: 'Algorithms', uploadDate: '1 week ago', downloads: 38 },
  { name: 'SQL Queries Practice', type: 'PDF', subject: 'Database Lab', uploadDate: '3 days ago', downloads: 24 }
];

export default function LecturerDashboard() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [attendanceMode, setAttendanceMode] = useState<'manual' | 'bluetooth'>('bluetooth');
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

  const handleMarkAttendance = (classItem: any) => {
    setSelectedClass(classItem);
    setIsMarkingAttendance(true);
  };

  const confirmAttendance = () => {
    // Simulate attendance marking
    setTimeout(() => {
      setIsMarkingAttendance(false);
      setSelectedClass(null);
      // Update the class attendance in real app
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, {user?.name} 👩‍🏫
            </h1>
            <p className="text-muted-foreground">
              {user?.department?.name} Department • {user?.subjects?.length} Active Subjects
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            <BookOpen className="w-3 h-3 mr-1" />
            Lecturer Access
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 text-center">
            <Bluetooth className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-sm">Mark Attendance</h3>
            <p className="text-xs text-muted-foreground">BLE or Manual</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-sm">Upload Resource</h3>
            <p className="text-xs text-muted-foreground">Share materials</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 text-center">
            <Megaphone className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-sm">Send Announcement</h3>
            <p className="text-xs text-muted-foreground">Notify students</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="today">Today's Classes</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Today's Schedule</h3>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            {todayClasses.map((classItem) => (
              <Card key={classItem.id} className={`${
                classItem.status === 'current' ? 'border-primary bg-primary/5' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        classItem.status === 'completed' ? 'bg-green-100 text-green-700' :
                        classItem.status === 'current' ? 'bg-primary/10 text-primary' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{classItem.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          {classItem.time} • {classItem.room} • {classItem.year}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {classItem.students} students enrolled
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {classItem.attendance !== null && (
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {classItem.attendance}/{classItem.students}
                          </div>
                          <div className="text-xs text-muted-foreground">Present</div>
                        </div>
                      )}
                      <Badge variant={
                        classItem.status === 'completed' ? 'default' :
                        classItem.status === 'current' ? 'destructive' :
                        'secondary'
                      }>
                        {classItem.status === 'completed' ? 'Completed' :
                         classItem.status === 'current' ? 'In Progress' :
                         'Upcoming'}
                      </Badge>
                      {(classItem.status === 'current' || classItem.status === 'upcoming') && (
                        <Button 
                          size="sm" 
                          onClick={() => handleMarkAttendance(classItem)}
                          disabled={isMarkingAttendance}
                        >
                          <Bluetooth className="w-4 h-4 mr-2" />
                          Mark Attendance
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Subject-wise attendance statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjectStats.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {subject.avgAttendance}% avg
                      </span>
                    </div>
                    <Progress value={subject.avgAttendance} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{subject.totalClasses} classes</span>
                      <span>{subject.students} students</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Methods</CardTitle>
                <CardDescription>Configure attendance marking preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bluetooth className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label>Bluetooth Low Energy</Label>
                        <p className="text-xs text-muted-foreground">Proximity-based detection</p>
                      </div>
                    </div>
                    <Switch checked={attendanceMode === 'bluetooth'} 
                            onCheckedChange={() => setAttendanceMode('bluetooth')} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-green-500" />
                      <div>
                        <Label>Manual Entry</Label>
                        <p className="text-xs text-muted-foreground">Traditional roll call</p>
                      </div>
                    </div>
                    <Switch checked={attendanceMode === 'manual'} 
                            onCheckedChange={() => setAttendanceMode('manual')} />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Bulk Attendance</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    For lab sessions, you can mark attendance for entire batches at once.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Enable Bulk Mode
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Resource Management</h3>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload New Resource
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Your recently shared materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded">
                        {resource.type === 'PDF' ? <FileText className="h-4 w-4 text-primary" /> :
                         resource.type === 'Video' ? <Video className="h-4 w-4 text-primary" /> :
                         <Presentation className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{resource.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {resource.subject} • {resource.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{resource.downloads}</p>
                      <p className="text-xs text-muted-foreground">downloads</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Resource</CardTitle>
                <CardDescription>Share materials with your students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resource-title">Title</Label>
                  <Input id="resource-title" placeholder="Enter resource title" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resource-subject">Subject</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Data Structures</option>
                    <option>Algorithms</option>
                    <option>Database Systems</option>
                    <option>Database Lab</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resource-description">Description</Label>
                  <Textarea id="resource-description" placeholder="Brief description of the resource" />
                </div>

                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PPT, DOC, MP4 (Max 50MB)
                  </p>
                </div>

                <Button className="w-full">Upload Resource</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">148</div>
                <p className="text-xs text-muted-foreground">Across all subjects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Average Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">90%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+3%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Resources Shared</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">This semester</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Student engagement and performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-3">Top Performing Classes</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Database Lab</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Algorithms</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Structures</span>
                      <span className="font-medium">89%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Resource Engagement</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Video Materials</span>
                      <span className="font-medium">85% viewed</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>PDF Documents</span>
                      <span className="font-medium">92% downloaded</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Presentations</span>
                      <span className="font-medium">78% accessed</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Announcement</CardTitle>
                <CardDescription>Share updates with your students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input id="announcement-title" placeholder="Enter announcement title" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="announcement-subject">Target Subject</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All Subjects</option>
                    <option>Data Structures</option>
                    <option>Algorithms</option>
                    <option>Database Systems</option>
                    <option>Database Lab</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="announcement-message">Message</Label>
                  <Textarea 
                    id="announcement-message" 
                    placeholder="Enter your announcement message"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="urgent" />
                  <Label htmlFor="urgent">Mark as urgent</Label>
                </div>

                <Button className="w-full">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
                <CardDescription>Your recent messages to students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium">Lab Session Rescheduled</h4>
                      <Badge variant="outline" className="text-xs">Database Lab</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Tomorrow's lab session has been moved to Friday 2:00 PM due to server maintenance.
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago • 24 students notified</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium">New Study Materials</h4>
                      <Badge variant="outline" className="text-xs">Algorithms</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Added new practice problems for sorting algorithms. Check the resources section.
                    </p>
                    <p className="text-xs text-muted-foreground">1 day ago • 38 students notified</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium">Assignment Deadline</h4>
                      <Badge variant="outline" className="text-xs">Data Structures</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Reminder: Tree traversal assignment due this Friday at 11:59 PM.
                    </p>
                    <p className="text-xs text-muted-foreground">3 days ago • 45 students notified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Attendance Marking Modal */}
      {isMarkingAttendance && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                {selectedClass.subject} • {selectedClass.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <Bluetooth className="h-16 w-16 mx-auto mb-4 text-primary" />
                </div>
                <p className="text-sm font-medium">Scanning for devices...</p>
                <p className="text-xs text-muted-foreground">
                  {attendanceMode === 'bluetooth' ? 'Detecting Bluetooth devices in range' :
                   'Manual attendance mode active'}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsMarkingAttendance(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={confirmAttendance}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
