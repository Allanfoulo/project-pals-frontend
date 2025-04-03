import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Settings, Bell } from "lucide-react";
import EmailNotificationSystem from "./EmailNotificationSystem";
import EmailNotifications from "./EmailNotifications";

interface CollaborationEmailSettingsProps {
  className?: string;
}

const CollaborationEmailSettings = ({ className }: CollaborationEmailSettingsProps) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Email Notification Settings</CardTitle>
          <CardDescription>
            Configure your email notification preferences for collaboration features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="system" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="system">
                <Settings className="h-4 w-4 mr-2" />
                System Notifications
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Bell className="h-4 w-4 mr-2" />
                Advanced Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="system" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure basic email notification settings for tasks, comments, and project updates.
              </p>
              <EmailNotificationSystem />
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fine-tune your notification preferences with advanced controls and digest settings.
              </p>
              <EmailNotifications />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborationEmailSettings;
