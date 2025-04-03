import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, AtSign, Clock, Mail, User, Settings, Save } from "lucide-react";
import EmailNotificationSystem from "./EmailNotificationSystem";

interface CollaborationSettingsProps {
  className?: string;
}

const CollaborationSettings = ({ className }: CollaborationSettingsProps) => {
  const [notificationSettings, setNotificationSettings] = useState({
    desktopNotifications: true,
    mentionNotifications: true,
    taskAssignments: true,
    statusChanges: true,
    comments: true,
    deadlineReminders: true,
    emailNotifications: true,
    soundAlerts: false,
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    allowMentions: true,
    showActivityStatus: true,
    autoShareTasks: true,
  });
  
  const handleToggleNotification = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleTogglePrivacy = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save settings to a backend
    alert("Collaboration settings saved successfully!");
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Collaboration Settings
        </CardTitle>
        <CardDescription>
          Configure how you collaborate with your team and receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <User className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your desktop for important updates.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.desktopNotifications}
                  onCheckedChange={() => handleToggleNotification("desktopNotifications")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-blue-500" />
                    Mention Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone mentions you in comments or tasks.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.mentionNotifications}
                  onCheckedChange={() => handleToggleNotification("mentionNotifications")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-500" />
                    Task Assignments
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you're assigned to a task.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.taskAssignments}
                  onCheckedChange={() => handleToggleNotification("taskAssignments")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <Badge className="h-4 px-1 py-0 bg-orange-500 text-white">Status</Badge>
                    Status Changes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a task's status changes.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.statusChanges}
                  onCheckedChange={() => handleToggleNotification("statusChanges")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    Comments
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone comments on your tasks.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.comments}
                  onCheckedChange={() => handleToggleNotification("comments")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    Deadline Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders for upcoming task deadlines.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.deadlineReminders}
                  onCheckedChange={() => handleToggleNotification("deadlineReminders")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when receiving notifications.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.soundAlerts}
                  onCheckedChange={() => handleToggleNotification("soundAlerts")}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow team members to see when you're online.
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showOnlineStatus}
                  onCheckedChange={() => handleTogglePrivacy("showOnlineStatus")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Allow @Mentions</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow team members to mention you in comments and tasks.
                  </p>
                </div>
                <Switch
                  checked={privacySettings.allowMentions}
                  onCheckedChange={() => handleTogglePrivacy("allowMentions")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Activity Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Show your recent activity in the activity feed.
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showActivityStatus}
                  onCheckedChange={() => handleTogglePrivacy("showActivityStatus")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-share Tasks</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically share tasks you create with your team.
                  </p>
                </div>
                <Switch
                  checked={privacySettings.autoShareTasks}
                  onCheckedChange={() => handleTogglePrivacy("autoShareTasks")}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="pt-6">
            <EmailNotificationSystem />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborationSettings;
