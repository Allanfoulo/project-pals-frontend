
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Moon, 
  Sun, 
  Monitor,
  Globe, 
  Briefcase, 
  Shield, 
  Save,
  CreditCard
} from "lucide-react";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    mentionAlerts: true,
    taskReminders: true,
  });

  const [accountSettings, setAccountSettings] = useState({
    language: "English",
    timezone: "Pacific Time (UTC-7)",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12-hour",
  });

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success(`${setting} ${notificationSettings[setting] ? 'disabled' : 'enabled'}`);
  };

  const handleSaveAccount = () => {
    toast.success("Account settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full sm:w-auto grid-cols-3 sm:grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="language"
                      className="pl-10" 
                      value={accountSettings.language}
                      onChange={(e) => setAccountSettings({...accountSettings, language: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input 
                    id="timezone" 
                    value={accountSettings.timezone}
                    onChange={(e) => setAccountSettings({...accountSettings, timezone: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Input 
                    id="dateFormat" 
                    value={accountSettings.dateFormat}
                    onChange={(e) => setAccountSettings({...accountSettings, dateFormat: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Input 
                    id="timeFormat" 
                    value={accountSettings.timeFormat}
                    onChange={(e) => setAccountSettings({...accountSettings, timeFormat: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveAccount}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="emailNotifications" className="font-normal">
                      Email Notifications
                    </Label>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="pushNotifications" className="font-normal">
                      Push Notifications
                    </Label>
                  </div>
                  <Switch 
                    id="pushNotifications" 
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="weeklyDigest" className="font-normal">
                      Weekly Digest
                    </Label>
                  </div>
                  <Switch 
                    id="weeklyDigest" 
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={() => handleNotificationToggle('weeklyDigest')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="mentionAlerts" className="font-normal">
                      Mention Alerts
                    </Label>
                  </div>
                  <Switch 
                    id="mentionAlerts" 
                    checked={notificationSettings.mentionAlerts}
                    onCheckedChange={() => handleNotificationToggle('mentionAlerts')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="taskReminders" className="font-normal">
                      Task Reminders
                    </Label>
                  </div>
                  <Switch 
                    id="taskReminders" 
                    checked={notificationSettings.taskReminders}
                    onCheckedChange={() => handleNotificationToggle('taskReminders')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how TaskFlow looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Button 
                    variant={theme === "light" ? "default" : "outline"} 
                    className="flex flex-col items-center justify-center gap-2 h-24"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-6 w-6" />
                    <span>Light</span>
                  </Button>
                  <Button 
                    variant={theme === "dark" ? "default" : "outline"} 
                    className="flex flex-col items-center justify-center gap-2 h-24"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-6 w-6" />
                    <span>Dark</span>
                  </Button>
                  <Button 
                    variant={theme === "system" ? "default" : "outline"} 
                    className="flex flex-col items-center justify-center gap-2 h-24"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-6 w-6" />
                    <span>System</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">Free Plan</p>
                  </div>
                  <Button variant="outline">Upgrade</Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <h3 className="font-medium">Payment Methods</h3>
                      <p className="text-sm text-muted-foreground">No payment methods added</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
