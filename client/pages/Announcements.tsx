import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Megaphone,
  Send,
  Filter,
  Search,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageSquare,
  Pin,
  Calendar,
  BookOpen,
  Building
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock announcements data
const announcements = [
  {
    id: 1,
    title: "Mid-term Examination Schedule Released",
    content: "The mid-term examination schedule for all departments has been released. Please check your respective department portals for detailed timetables. Exams will begin from December 20th, 2024.",
    author: "Admin Office",
    authorRole: "admin",
    authorAvatar: "/placeholder.svg",
    timestamp: "2 hours ago",
    category: "general",
    target: "all",
    urgent: true,
    pinned: true,
    readBy: 245,
    totalRecipients: 320,
    subjects: []
  },
  {
    id: 2,
    title: "Database Lab Session Rescheduled",
    content: "Tomorrow's Database Lab session (Group A) has been moved from 2:00 PM to 4:00 PM due to server maintenance. Please note the timing change.",
    author: "Dr. Emily Rodriguez",
    authorRole: "lecturer",
    authorAvatar: "/placeholder.svg",
    timestamp: "4 hours ago",
    category: "subject-specific",
    target: "subject",
    urgent: false,
    pinned: false,
    readBy: 22,
    totalRecipients: 24,
    subjects: ["Database Lab"]
  },
  {
    id: 3,
    title: "New Learning Resources Available",
    content: "I've uploaded additional practice problems for sorting algorithms. These will help you prepare for the upcoming quiz. Check the Resources section.",
    author: "Prof. Michael Chen",
    authorRole: "lecturer",
    authorAvatar: "/placeholder.svg",
    timestamp: "1 day ago",
    category: "subject-specific",
    target: "subject",
    urgent: false,
    pinned: false,
    readBy: 35,
    totalRecipients: 38,
    subjects: ["Algorithms"]
  },
  {
    id: 4,
    title: "Computer Science Department Meeting",
    content: "All CS department faculty and final year students are invited to attend the annual department meeting on Friday, December 15th at 3:00 PM in the main auditorium.",
    author: "Prof. Michael Chen",
    authorRole: "department_moderator",
    authorAvatar: "/placeholder.svg",
    timestamp: "2 days ago",
    category: "department",
    target: "department",
    urgent: false,
    pinned: false,
    readBy: 89,
    totalRecipients: 156,
    subjects: []
  },
  {
    id: 5,
    title: "Holiday Notice",
    content: "The university will remain closed from December 25th to January 2nd for winter holidays. Regular classes will resume on January 3rd, 2025.",
    author: "Admin Office",
    authorRole: "admin",
    authorAvatar: "/placeholder.svg",
    timestamp: "3 days ago",
    category: "general",
    target: "all",
    urgent: false,
    pinned: true,
    readBy: 298,
    totalRecipients: 320,
    subjects: []
  }
];

export default function Announcements() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    category: "general",
    target: "all",
    urgent: false,
    subjects: []
  });

  const canCreateAnnouncements = user?.role !== 'student';

  const filteredAnnouncements = announcements.filter(announcement => {
    // Filter by category
    if (selectedCategory !== "all" && announcement.category !== selectedCategory) {
      return false;
    }

    // Filter by search query
    if (searchQuery && !announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !announcement.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Role-based filtering
    if (user?.role === 'student') {
      // Students see announcements targeted to them
      return announcement.target === 'all' ||
             (announcement.target === 'department' && announcement.authorRole === 'department_moderator') ||
             (announcement.target === 'subject' && user.subjects?.some(s => announcement.subjects.includes(s)));
    }

    return true;
  });

  const handleCreateAnnouncement = () => {
    // Handle announcement creation
    console.log("Creating announcement:", newAnnouncement);
    setIsCreating(false);
    setNewAnnouncement({
      title: "",
      content: "",
      category: "general",
      target: "all",
      urgent: false,
      subjects: []
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <Megaphone className="h-4 w-4" />;
      case 'subject-specific': return <BookOpen className="h-4 w-4" />;
      case 'department': return <Building className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-700';
      case 'subject-specific': return 'bg-green-100 text-green-700';
      case 'department': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Communication Hub</h1>
          <p className="text-muted-foreground">
            {user?.role === 'student'
              ? 'Stay updated with announcements from your instructors and administration'
              : 'Manage and send announcements to students and faculty'
            }
          </p>
        </div>
        {canCreateAnnouncements && (
          <Button onClick={() => setIsCreating(true)}>
            <Megaphone className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search" className="sr-only">Search announcements</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="min-w-48">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="subject-specific">Subject-Specific</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className={`${
            announcement.urgent ? 'border-orange-200 bg-orange-50' : ''
          }`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {announcement.pinned && (
                      <Pin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                        {announcement.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={announcement.authorAvatar} />
                            <AvatarFallback className="text-xs">
                              {announcement.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{announcement.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{announcement.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getCategoryColor(announcement.category)}>
                      {getCategoryIcon(announcement.category)}
                      <span className="ml-1 capitalize">{announcement.category.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed">
                  {announcement.content}
                </p>

                {/* Subjects (if applicable) */}
                {announcement.subjects.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {announcement.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{announcement.readBy}/{announcement.totalRecipients} viewed</span>
                    </div>
                    {canCreateAnnouncements && announcement.authorRole === user?.role && (
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{Math.round((announcement.readBy / announcement.totalRecipients) * 100)}% read rate</span>
                      </div>
                    )}
                  </div>

                  {user?.role === 'student' && (
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAnnouncements.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No announcements found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms or filters."
                  : "There are no announcements matching your current filters."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Announcement Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Create New Announcement</CardTitle>
              <CardDescription>
                Share important information with your audience
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newAnnouncement.category}
                    onValueChange={(value) => setNewAnnouncement({...newAnnouncement, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="subject-specific">Subject-Specific</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your announcement message"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="urgent"
                  checked={newAnnouncement.urgent}
                  onCheckedChange={(checked) => setNewAnnouncement({...newAnnouncement, urgent: checked})}
                />
                <Label htmlFor="urgent">Mark as urgent</Label>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreateAnnouncement}
                  disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
