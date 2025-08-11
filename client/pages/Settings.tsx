import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Lock,
  Bell,
  Palette,
  Globe,
  Eye,
  Volume2,
  Shield,
  Download,
  Trash2,
  Save,
  Camera
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccessibility, languages, fontSizes } from "@/contexts/AccessibilityContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Settings() {
  const { user, switchRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const {
    language,
    setLanguage,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reduceMotion,
    setReduceMotion,
    screenReaderEnabled,
    setScreenReaderEnabled
  } = useAccessibility();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings & Preferences</h1>
        <p className="text-muted-foreground">
          Manage your account, accessibility preferences, and application settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or GIF (max. 2MB)
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>

                {user?.studentId && (
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input id="student-id" defaultValue={user.studentId} disabled />
                  </div>
                )}

                {user?.employeeId && (
                  <div className="space-y-2">
                    <Label htmlFor="employee-id">Employee ID</Label>
                    <Input id="employee-id" defaultValue={user.employeeId} disabled />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" defaultValue={user?.department?.name} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {user?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    {/* Demo role switch */}
                    <Select value={user?.role} onValueChange={(value: any) => switchRole(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="lecturer">Lecturer</SelectItem>
                        <SelectItem value="department_moderator">Dept. Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Language & Localization</CardTitle>
              <CardDescription>Choose your preferred language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Interface Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languages).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            {name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fontSizes).map(([size, value]) => (
                        <SelectItem key={size} value={size}>
                          {size.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({value})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visual Accessibility</CardTitle>
              <CardDescription>Customize visual elements for better accessibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-primary" />
                  <div>
                    <Label>High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                </div>
                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 className="h-5 w-5 text-primary" />
                  <div>
                    <Label>Reduce Motion</Label>
                    <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                  </div>
                </div>
                <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-primary" />
                  <div>
                    <Label>Screen Reader Support</Label>
                    <p className="text-sm text-muted-foreground">Optimize for screen reader software</p>
                  </div>
                </div>
                <Switch checked={screenReaderEnabled} onCheckedChange={setScreenReaderEnabled} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <Label>Attendance Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified about upcoming classes</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <Label>Assignment Deadlines</Label>
                    <p className="text-sm text-muted-foreground">Alerts for upcoming assignment due dates</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <Label>Low Attendance Warnings</Label>
                    <p className="text-sm text-muted-foreground">Alert when attendance drops below threshold</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <Label>Color Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose between light, dark, or system theme</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>

              <div className="grid gap-4">
                <Label>Preview</Label>
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Sample Dashboard Card</span>
                    <Badge>Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is how your dashboard will look with the current theme settings.
                  </p>
                  <Button size="sm">Sample Button</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <Button>
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your personal data and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Download Your Data</Label>
                  <p className="text-sm text-muted-foreground">Export all your personal data</p>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Delete Account</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
