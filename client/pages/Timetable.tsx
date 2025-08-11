import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  BookOpen,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock timetable data
const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const mockTimetable = {
  student: {
    Monday: [
      { time: "09:00-10:30", subject: "Data Structures", lecturer: "Dr. Emily Rodriguez", room: "CS-201", type: "Lecture" },
      { time: "11:00-12:30", subject: "Mathematics", lecturer: "Prof. Sarah Wilson", room: "Math-101", type: "Lecture" },
      { time: "14:00-17:00", subject: "Database Lab", lecturer: "Dr. Emily Rodriguez", room: "CS-Lab-1", type: "Lab" }
    ],
    Tuesday: [
      { time: "10:00-11:30", subject: "Algorithms", lecturer: "Prof. Michael Chen", room: "CS-203", type: "Lecture" },
      { time: "14:00-15:30", subject: "Computer Networks", lecturer: "Dr. James Kumar", room: "CS-205", type: "Lecture" }
    ],
    Wednesday: [
      { time: "09:00-10:30", subject: "Software Engineering", lecturer: "Dr. Sarah Wilson", room: "CS-202", type: "Lecture" },
      { time: "11:00-12:30", subject: "Database Systems", lecturer: "Dr. Emily Rodriguez", room: "CS-201", type: "Lecture" }
    ],
    Thursday: [
      { time: "10:00-11:30", subject: "Algorithms", lecturer: "Prof. Michael Chen", room: "CS-203", type: "Lecture" },
      { time: "15:00-18:00", subject: "Networks Lab", lecturer: "Dr. James Kumar", room: "CS-Lab-2", type: "Lab" }
    ],
    Friday: [
      { time: "09:00-10:30", subject: "Data Structures", lecturer: "Dr. Emily Rodriguez", room: "CS-201", type: "Lecture" },
      { time: "11:00-12:30", subject: "Software Engineering", lecturer: "Dr. Sarah Wilson", room: "CS-202", type: "Lecture" }
    ]
  }
};

const upcomingClasses = [
  {
    subject: "Data Structures",
    time: "Tomorrow, 09:00 - 10:30",
    room: "CS-201",
    lecturer: "Dr. Emily Rodriguez",
    status: "confirmed"
  },
  {
    subject: "Database Lab",
    time: "Tomorrow, 14:00 - 17:00",
    room: "CS-Lab-1",
    lecturer: "Dr. Emily Rodriguez",
    status: "confirmed"
  },
  {
    subject: "Mathematics",
    time: "Monday, 11:00 - 12:30",
    room: "Math-101",
    lecturer: "Prof. Sarah Wilson",
    status: "rescheduled"
  }
];

const roomBookings = [
  { room: "CS-201", utilization: 85, capacity: 60, equipment: ["Projector", "AC", "Whiteboard"] },
  { room: "CS-Lab-1", utilization: 92, capacity: 30, equipment: ["Computers", "Projector", "AC"] },
  { room: "CS-203", utilization: 78, capacity: 45, equipment: ["Projector", "AC", "Smart Board"] },
  { room: "Math-101", utilization: 70, capacity: 80, equipment: ["Projector", "AC", "Whiteboard"] }
];

export default function Timetable() {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [selectedView, setSelectedView] = useState("week");
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");

  const canManageTimetable = user?.role !== 'student';

  const getSubjectColor = (subject: string) => {
    const colors = {
      "Data Structures": "bg-blue-100 text-blue-800",
      "Algorithms": "bg-green-100 text-green-800",
      "Database Systems": "bg-purple-100 text-purple-800",
      "Database Lab": "bg-purple-100 text-purple-800",
      "Computer Networks": "bg-orange-100 text-orange-800",
      "Networks Lab": "bg-orange-100 text-orange-800",
      "Software Engineering": "bg-pink-100 text-pink-800",
      "Mathematics": "bg-yellow-100 text-yellow-800"
    };
    return colors[subject as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-600";
      case "rescheduled": return "text-yellow-600";
      case "cancelled": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const renderWeeklyView = () => {
    return (
      <div className="grid gap-4">
        {/* Time header */}
        <div className="grid grid-cols-6 gap-2">
          <div className="font-medium text-center p-2">Time</div>
          {weekDays.map(day => (
            <div key={day} className="font-medium text-center p-2 border-b">
              {day}
            </div>
          ))}
        </div>

        {/* Timetable grid */}
        <div className="grid grid-cols-6 gap-2 min-h-96">
          {/* Time column */}
          <div className="space-y-2">
            {timeSlots.map(time => (
              <div key={time} className="h-16 flex items-center justify-center text-sm text-muted-foreground border-r">
                {time}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {weekDays.map(day => (
            <div key={day} className="space-y-2">
              {mockTimetable.student[day as keyof typeof mockTimetable.student]?.map((classItem: any, index: number) => (
                <Card key={index} className="h-16 p-2 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <Badge className={`text-xs ${getSubjectColor(classItem.subject)}`}>
                        {classItem.subject}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {classItem.room}
                      </div>
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {classItem.lecturer.split(' ').pop()}
                      </div>
                    </div>
                  </div>
                </Card>
              )) || (
                <div className="h-16 flex items-center justify-center text-xs text-muted-foreground">
                  No classes
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayClasses = mockTimetable.student[selectedDay as keyof typeof mockTimetable.student] || [];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{selectedDay} Schedule</h3>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {weekDays.map(day => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {dayClasses.length > 0 ? dayClasses.map((classItem: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{classItem.time}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{classItem.subject}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {classItem.room}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {classItem.lecturer}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={classItem.type === 'Lab' ? 'default' : 'secondary'}>
                    {classItem.type}
                  </Badge>
                  {canManageTimetable && (
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )) : (
            <Card className="p-8 text-center">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Classes Scheduled</h3>
              <p className="text-muted-foreground">There are no classes scheduled for {selectedDay}</p>
            </Card>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Class Timetable</h1>
          <p className="text-muted-foreground">
            {user?.role === 'student' 
              ? 'View your class schedule and upcoming sessions'
              : user?.role === 'lecturer'
              ? 'Manage your teaching schedule and class timings'
              : 'Oversee and manage institutional timetables'
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {canManageTimetable && (
            <Button onClick={() => setIsAddingClass(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Label>View:</Label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="day">Day View</SelectItem>
                  <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label>Week:</Label>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous">Previous Week</SelectItem>
                  <SelectItem value="current">Current Week</SelectItem>
                  <SelectItem value="next">Next Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {user?.role !== 'student' && (
              <div className="flex items-center space-x-2">
                <Label>Department:</Label>
                <Select defaultValue="cs">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="ece">Electronics</SelectItem>
                    <SelectItem value="mech">Mechanical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
          {canManageTimetable && <TabsTrigger value="rooms">Room Management</TabsTrigger>}
          {user?.role === 'admin' && <TabsTrigger value="conflicts">Conflicts</TabsTrigger>}
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedView === 'week' ? 'Weekly Schedule' : 
                 selectedView === 'day' ? 'Daily Schedule' : 'Monthly Schedule'}
              </CardTitle>
              <CardDescription>
                Your class timetable for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedView === 'week' ? renderWeeklyView() : renderDayView()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>Your next scheduled classes and sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Clock className="w-5 h-5 mx-auto text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{classItem.time.split(',')[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{classItem.subject}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{classItem.time}</span>
                          <span>•</span>
                          <span>{classItem.room}</span>
                          <span>•</span>
                          <span>{classItem.lecturer}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(classItem.status)}>
                        {classItem.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {classItem.status === 'rescheduled' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {canManageTimetable && (
          <TabsContent value="rooms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Room Management</CardTitle>
                <CardDescription>Monitor room utilization and manage bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {roomBookings.map((room, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{room.room}</h4>
                        <Badge variant={room.utilization > 90 ? 'destructive' : room.utilization > 70 ? 'default' : 'secondary'}>
                          {room.utilization}% utilized
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Capacity:</span>
                          <span>{room.capacity} students</span>
                        </div>
                        <div className="text-sm">
                          <span>Equipment:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {room.equipment.map((item, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {user?.role === 'admin' && (
          <TabsContent value="conflicts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Conflicts</CardTitle>
                <CardDescription>Identify and resolve timetable conflicts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-red-500 bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-red-800">Room Double Booking</h4>
                        <p className="text-sm text-red-600">CS-201 scheduled for two classes at 10:00 AM on Monday</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Resolve
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-yellow-800">Lecturer Overlap</h4>
                        <p className="text-sm text-yellow-600">Dr. Rodriguez scheduled in two different rooms at 2:00 PM</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Add Class Modal */}
      {isAddingClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Class</CardTitle>
              <CardDescription>Schedule a new class session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ds">Data Structures</SelectItem>
                      <SelectItem value="algo">Algorithms</SelectItem>
                      <SelectItem value="db">Database Systems</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lecture">Lecture</SelectItem>
                      <SelectItem value="lab">Lab</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Room</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs201">CS-201</SelectItem>
                    <SelectItem value="cs202">CS-202</SelectItem>
                    <SelectItem value="lab1">CS-Lab-1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsAddingClass(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Class
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
