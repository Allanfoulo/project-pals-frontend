import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Camera, Mail, Phone, MapPin, Briefcase, Calendar, Edit, Save, User, Shield, Bell } from "lucide-react";

export type UserRole = "admin" | "manager" | "member" | "viewer";

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  title?: string;
  department?: string;
  location?: string;
  phone?: string;
  bio?: string;
  skills: string[];
  joinDate: string;
  lastActive: string;
}

interface UserProfileProps {
  userData: UserProfileData;
  isCurrentUser: boolean;
  onSave?: (userData: UserProfileData) => void;
}

const UserProfile = ({ userData, isCurrentUser, onSave }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfileData>(userData);
  
  const handleChange = (field: keyof UserProfileData, value: any) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(user);
    }
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "manager": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "member": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "viewer": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="relative pb-0">
          {isCurrentUser && (
            <div className="absolute right-6 top-6">
              {isEditing ? (
                <Button onClick={handleSave} size="sm" className="flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute -right-1 -bottom-1 rounded-full bg-primary p-1 text-white cursor-pointer">
                  <Camera className="h-4 w-4" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.title && (
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{user.title}{user.department ? ` • ${user.department}` : ""}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={user.name} 
                        onChange={(e) => handleChange("name", e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={user.email} 
                        onChange={(e) => handleChange("email", e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input 
                        id="title" 
                        value={user.title || ""} 
                        onChange={(e) => handleChange("title", e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        value={user.department || ""} 
                        onChange={(e) => handleChange("department", e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={user.location || ""} 
                        onChange={(e) => handleChange("location", e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={user.phone || ""} 
                        onChange={(e) => handleChange("phone", e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={user.bio || ""} 
                        onChange={(e) => handleChange("bio", e.target.value)} 
                        rows={4} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    
                    {user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Last active {new Date(user.lastActive).toLocaleDateString()}</span>
                    </div>
                    
                    {user.bio && (
                      <div className="md:col-span-2 mt-2">
                        <h4 className="font-medium mb-1">Bio</h4>
                        <p className="text-muted-foreground">{user.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Skills & Expertise</h3>
                
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                  {isEditing && (
                    <Badge variant="outline" className="cursor-pointer">+ Add Skill</Badge>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Settings</h3>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">User Role</Label>
                        <Select 
                          value={user.role} 
                          onValueChange={(value) => handleChange("role", value as UserRole)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Button variant="outline">Change Password</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>Account Security</span>
                        </div>
                        <Button variant="outline" size="sm">Change Password</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Two-Factor Authentication</span>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive email notifications for important updates</div>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Task Assignments</div>
                      <div className="text-sm text-muted-foreground">Get notified when you're assigned to a task</div>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Comments & Mentions</div>
                      <div className="text-sm text-muted-foreground">Receive notifications when someone mentions you</div>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Due Date Reminders</div>
                      <div className="text-sm text-muted-foreground">Get reminders about upcoming deadlines</div>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
