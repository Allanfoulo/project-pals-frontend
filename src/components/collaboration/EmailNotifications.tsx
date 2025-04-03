import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Bell, Clock, Check, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NotificationSetting {
  id: string;
  type: string;
  description: string;
  email: boolean;
  inApp: boolean;
  frequency: "instant" | "daily" | "weekly" | "never";
}

interface DigestSetting {
  id: string;
  type: "daily" | "weekly";
  time: string;
  day?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  enabled: boolean;
}

const EmailNotifications = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: "1",
      type: "Task Assignment",
      description: "When you are assigned to a task",
      email: true,
      inApp: true,
      frequency: "instant",
    },
    {
      id: "2",
      type: "Task Comments",
      description: "When someone comments on your task",
      email: true,
      inApp: true,
      frequency: "daily",
    },
    {
      id: "3",
      type: "Mentions",
      description: "When someone mentions you in a comment",
      email: true,
      inApp: true,
      frequency: "instant",
    },
    {
      id: "4",
      type: "Due Date Reminders",
      description: "Reminders for upcoming task deadlines",
      email: true,
      inApp: true,
      frequency: "daily",
    },
    {
      id: "5",
      type: "Status Changes",
      description: "When a task status changes",
      email: false,
      inApp: true,
      frequency: "daily",
    },
    {
      id: "6",
      type: "Project Updates",
      description: "General project updates and announcements",
      email: true,
      inApp: true,
      frequency: "weekly",
    },
    {
      id: "7",
      type: "Team Activity",
      description: "Updates on team member activities",
      email: false,
      inApp: true,
      frequency: "weekly",
    },
  ]);

  const [digestSettings, setDigestSettings] = useState<DigestSetting[]>([
    {
      id: "1",
      type: "daily",
      time: "09:00",
      enabled: true,
    },
    {
      id: "2",
      type: "weekly",
      time: "10:00",
      day: "monday",
      enabled: true,
    },
  ]);

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailAddress, setEmailAddress] = useState("user@example.com");

  const handleUpdateNotificationSetting = (
    id: string,
    field: "email" | "inApp" | "frequency",
    value: any
  ) => {
    setNotificationSettings(
      notificationSettings.map((setting) =>
        setting.id === id ? { ...setting, [field]: value } : setting
      )
    );

    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleUpdateDigestSetting = (
    id: string,
    field: "time" | "day" | "enabled",
    value: any
  ) => {
    setDigestSettings(
      digestSettings.map((setting) =>
        setting.id === id ? { ...setting, [field]: value } : setting
      )
    );

    toast({
      title: "Digest settings updated",
      description: `Your ${digestSettings.find(s => s.id === id)?.type} digest settings have been updated.`,
    });
  };

  const handleToggleEmailNotifications = (enabled: boolean) => {
    setEmailEnabled(enabled);

    toast({
      title: enabled ? "Email notifications enabled" : "Email notifications disabled",
      description: enabled
        ? "You will now receive email notifications based on your preferences."
        : "You will no longer receive any email notifications.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Notifications
        </CardTitle>
        <CardDescription>
          Configure how and when you receive email notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Enable or disable all email notifications
            </p>
          </div>
          <Switch
            checked={emailEnabled}
            onCheckedChange={handleToggleEmailNotifications}
          />
        </div>

        {emailEnabled ? (
          <>
            <Separator />

            <Tabs defaultValue="notifications">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Types
                </TabsTrigger>
                <TabsTrigger value="digests">
                  <Clock className="mr-2 h-4 w-4" />
                  Digest Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {notificationSettings.map((setting) => (
                    <Card key={setting.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-medium">{setting.type}</h4>
                            <p className="text-sm text-muted-foreground">
                              {setting.description}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`email-${setting.id}`}
                                className="text-sm font-normal"
                              >
                                Email
                              </Label>
                              <Switch
                                id={`email-${setting.id}`}
                                checked={setting.email}
                                onCheckedChange={(checked) =>
                                  handleUpdateNotificationSetting(
                                    setting.id,
                                    "email",
                                    checked
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`inapp-${setting.id}`}
                                className="text-sm font-normal"
                              >
                                In-app
                              </Label>
                              <Switch
                                id={`inapp-${setting.id}`}
                                checked={setting.inApp}
                                onCheckedChange={(checked) =>
                                  handleUpdateNotificationSetting(
                                    setting.id,
                                    "inApp",
                                    checked
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`frequency-${setting.id}`}
                                className="text-sm font-normal"
                              >
                                Frequency
                              </Label>
                              <Select
                                value={setting.frequency}
                                onValueChange={(value) =>
                                  handleUpdateNotificationSetting(
                                    setting.id,
                                    "frequency",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  id={`frequency-${setting.id}`}
                                  className="w-[130px]"
                                >
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="instant">Instant</SelectItem>
                                  <SelectItem value="daily">Daily Digest</SelectItem>
                                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                                  <SelectItem value="never">Never</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Notification Frequency</AlertTitle>
                  <AlertDescription>
                    "Instant" sends emails immediately, while "Daily" and "Weekly" options
                    include notifications in digest emails.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="digests" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {digestSettings.map((digest) => (
                    <Card key={digest.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium capitalize">
                                {digest.type} Digest
                              </h4>
                              <Badge
                                variant="outline"
                                className={digest.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}
                              >
                                {digest.enabled ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {digest.type === "daily"
                                ? `Sent daily at ${digest.time}`
                                : `Sent every ${digest.day} at ${digest.time}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`time-${digest.id}`}
                                className="text-sm font-normal"
                              >
                                Time
                              </Label>
                              <Select
                                value={digest.time}
                                onValueChange={(value) =>
                                  handleUpdateDigestSetting(digest.id, "time", value)
                                }
                              >
                                <SelectTrigger
                                  id={`time-${digest.id}`}
                                  className="w-[100px]"
                                >
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="08:00">8:00 AM</SelectItem>
                                  <SelectItem value="09:00">9:00 AM</SelectItem>
                                  <SelectItem value="10:00">10:00 AM</SelectItem>
                                  <SelectItem value="12:00">12:00 PM</SelectItem>
                                  <SelectItem value="15:00">3:00 PM</SelectItem>
                                  <SelectItem value="17:00">5:00 PM</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {digest.type === "weekly" && (
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor={`day-${digest.id}`}
                                  className="text-sm font-normal"
                                >
                                  Day
                                </Label>
                                <Select
                                  value={digest.day}
                                  onValueChange={(value) =>
                                    handleUpdateDigestSetting(digest.id, "day", value)
                                  }
                                >
                                  <SelectTrigger
                                    id={`day-${digest.id}`}
                                    className="w-[120px]"
                                  >
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="monday">Monday</SelectItem>
                                    <SelectItem value="tuesday">Tuesday</SelectItem>
                                    <SelectItem value="wednesday">Wednesday</SelectItem>
                                    <SelectItem value="thursday">Thursday</SelectItem>
                                    <SelectItem value="friday">Friday</SelectItem>
                                    <SelectItem value="saturday">Saturday</SelectItem>
                                    <SelectItem value="sunday">Sunday</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`enabled-${digest.id}`}
                                className="text-sm font-normal"
                              >
                                Enabled
                              </Label>
                              <Switch
                                id={`enabled-${digest.id}`}
                                checked={digest.enabled}
                                onCheckedChange={(checked) =>
                                  handleUpdateDigestSetting(
                                    digest.id,
                                    "enabled",
                                    checked
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Digest Emails</AlertTitle>
                  <AlertDescription>
                    Digest emails include a summary of all notifications based on your
                    frequency preferences. Make sure your email address is correct.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Email notifications are disabled</AlertTitle>
            <AlertDescription>
              You will not receive any email notifications. Enable email notifications
              to stay updated on important activities.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>
          <Check className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailNotifications;
