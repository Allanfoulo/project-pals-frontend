import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, ExternalLink, RefreshCw, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CalendarIntegrationProps {
  className?: string;
}

type CalendarProvider = "google" | "outlook" | "apple" | "other";

interface ConnectedCalendar {
  id: string;
  name: string;
  provider: CalendarProvider;
  email: string;
  connected: boolean;
  lastSync?: string;
  color?: string;
}

const CalendarIntegration = ({ className }: CalendarIntegrationProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"connected" | "settings">("connected");
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [calendars, setCalendars] = useState<ConnectedCalendar[]>([
    {
      id: "1",
      name: "Work Calendar",
      provider: "google",
      email: "john.doe@example.com",
      connected: true,
      lastSync: "2025-04-03T06:30:00Z",
      color: "#4285F4",
    },
    {
      id: "2",
      name: "Personal Calendar",
      provider: "outlook",
      email: "john.personal@outlook.com",
      connected: true,
      lastSync: "2025-04-03T05:45:00Z",
      color: "#00A4EF",
    },
  ]);

  const [settings, setSettings] = useState({
    syncFrequency: "hourly",
    syncDirection: "bidirectional",
    showDeclined: true,
    includeReminders: true,
    autoCreateEvents: false,
    defaultCalendar: "1",
  });

  const handleConnect = (provider: CalendarProvider) => {
    // In a real app, this would open OAuth flow
    toast({
      title: "Connecting to calendar",
      description: `Opening authentication for ${provider} calendar...`,
    });

    // Simulate successful connection after a delay
    setTimeout(() => {
      const newCalendar: ConnectedCalendar = {
        id: `${calendars.length + 1}`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar`,
        provider,
        email: `user@${provider}.com`,
        connected: true,
        lastSync: new Date().toISOString(),
        color: provider === "google" ? "#4285F4" : 
               provider === "outlook" ? "#00A4EF" : 
               provider === "apple" ? "#A2AAAD" : "#6B7280",
      };

      setCalendars([...calendars, newCalendar]);

      toast({
        title: "Calendar connected",
        description: `Successfully connected to ${provider} calendar`,
      });
    }, 1500);
  };

  const handleDisconnect = (id: string) => {
    setCalendars(
      calendars.map((cal) =>
        cal.id === id ? { ...cal, connected: false } : cal
      )
    );

    toast({
      title: "Calendar disconnected",
      description: "Calendar has been disconnected",
    });
  };

  const handleReconnect = (id: string) => {
    setCalendars(
      calendars.map((cal) =>
        cal.id === id ? { ...cal, connected: true, lastSync: new Date().toISOString() } : cal
      )
    );

    toast({
      title: "Calendar reconnected",
      description: "Calendar has been reconnected",
    });
  };

  const handleRemove = (id: string) => {
    setCalendars(calendars.filter((cal) => cal.id !== id));

    toast({
      title: "Calendar removed",
      description: "Calendar has been removed",
    });
  };

  const handleSyncNow = () => {
    setSyncInProgress(true);

    // Simulate sync process
    setTimeout(() => {
      setCalendars(
        calendars.map((cal) => ({
          ...cal,
          lastSync: cal.connected ? new Date().toISOString() : cal.lastSync,
        }))
      );

      setSyncInProgress(false);

      toast({
        title: "Sync complete",
        description: "All calendars have been synchronized",
      });
    }, 2000);
  };

  const handleUpdateSettings = () => {
    toast({
      title: "Settings updated",
      description: "Calendar integration settings have been updated",
    });
  };

  const getProviderIcon = (provider: CalendarProvider) => {
    switch (provider) {
      case "google":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
              fill="#4285F4"
            />
            <path
              d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
              fill="#EA4335"
            />
            <path
              d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3037 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z"
              fill="#34A853"
            />
            <path
              d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
              fill="#FBBC05"
            />
          </svg>
        );
      case "outlook":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z"
              fill="#0078D4"
            />
            <path
              d="M12 10.5C13.3807 10.5 14.5 9.38071 14.5 8C14.5 6.61929 13.3807 5.5 12 5.5C10.6193 5.5 9.5 6.61929 9.5 8C9.5 9.38071 10.6193 10.5 12 10.5Z"
              fill="white"
            />
            <path
              d="M12 12.5C9.79086 12.5 8 14.2909 8 16.5C8 17.3284 8.67157 18 9.5 18H14.5C15.3284 18 16 17.3284 16 16.5C16 14.2909 14.2091 12.5 12 12.5Z"
              fill="white"
            />
          </svg>
        );
      case "apple":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M17.0366 12.5957C17.0211 10.5293 18.7458 9.4995 18.8198 9.45435C17.6583 7.76858 15.8438 7.51841 15.2051 7.50298C13.6876 7.34724 12.2239 8.41698 11.4546 8.41698C10.6699 8.41698 9.48071 7.51841 8.20168 7.54927C6.55811 7.57935 5.0249 8.51929 4.17776 9.97163C2.42484 12.9294 3.73607 17.2716 5.42183 19.6914C6.26819 20.8683 7.26676 22.1953 8.57876 22.1335C9.85779 22.0718 10.3422 21.3025 11.8751 21.3025C13.3926 21.3025 13.8462 22.1335 15.1879 22.0949C16.5771 22.0718 17.4397 20.8991 18.2553 19.7145C19.2384 18.3561 19.6457 17.0287 19.6612 16.9669C19.6303 16.9515 17.0521 15.9839 17.0366 12.5957Z"
              fill="black"
            />
            <path
              d="M15.0181 6.02148C15.7028 5.17434 16.1565 4.02676 16.0175 2.85376C15.0489 2.89926 13.8257 3.52832 13.1101 4.35983C12.4717 5.09089 11.9254 6.28932 12.0798 7.4159C13.1719 7.50298 14.3033 6.85311 15.0181 6.02148Z"
              fill="black"
            />
          </svg>
        );
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect and sync your calendars to manage tasks and events in one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connected">Connected Calendars</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="connected" className="space-y-6 pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Your Calendars</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncNow}
                disabled={syncInProgress}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${syncInProgress ? "animate-spin" : ""}`}
                />
                Sync Now
              </Button>
            </div>

            <div className="space-y-4">
              {calendars.length > 0 ? (
                calendars.map((calendar) => (
                  <div
                    key={calendar.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: calendar.color || "#e5e7eb" }}
                      >
                        {getProviderIcon(calendar.provider)}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {calendar.name}
                          {calendar.connected ? (
                            <Badge variant="outline" className="text-xs bg-green-50">
                              <Check className="h-3 w-3 mr-1 text-green-500" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-red-50">
                              <X className="h-3 w-3 mr-1 text-red-500" />
                              Disconnected
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {calendar.email}
                        </div>
                        {calendar.connected && (
                          <div className="text-xs text-muted-foreground">
                            Last sync: {formatLastSync(calendar.lastSync)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {calendar.connected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(calendar.id)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReconnect(calendar.id)}
                        >
                          Reconnect
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(calendar.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No calendars connected</p>
                  <p className="text-sm">Connect a calendar to get started</p>
                </div>
              )}
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">Connect a new calendar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleConnect("google")}
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3037 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z"
                      fill="#34A853"
                    />
                    <path
                      d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                      fill="#FBBC05"
                    />
                  </svg>
                  <span>Google Calendar</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleConnect("outlook")}
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="12" fill="#0078D4" />
                    <path
                      d="M7 7H17V17H7V7Z"
                      fill="white"
                    />
                  </svg>
                  <span>Outlook Calendar</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleConnect("apple")}
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17.0366 12.5957C17.0211 10.5293 18.7458 9.4995 18.8198 9.45435C17.6583 7.76858 15.8438 7.51841 15.2051 7.50298C13.6876 7.34724 12.2239 8.41698 11.4546 8.41698C10.6699 8.41698 9.48071 7.51841 8.20168 7.54927C6.55811 7.57935 5.0249 8.51929 4.17776 9.97163C2.42484 12.9294 3.73607 17.2716 5.42183 19.6914C6.26819 20.8683 7.26676 22.1953 8.57876 22.1335C9.85779 22.0718 10.3422 21.3025 11.8751 21.3025C13.3926 21.3025 13.8462 22.1335 15.1879 22.0949C16.5771 22.0718 17.4397 20.8991 18.2553 19.7145C19.2384 18.3561 19.6457 17.0287 19.6612 16.9669C19.6303 16.9515 17.0521 15.9839 17.0366 12.5957Z"
                      fill="black"
                    />
                    <path
                      d="M15.0181 6.02148C15.7028 5.17434 16.1565 4.02676 16.0175 2.85376C15.0489 2.89926 13.8257 3.52832 13.1101 4.35983C12.4717 5.09089 11.9254 6.28932 12.0798 7.4159C13.1719 7.50298 14.3033 6.85311 15.0181 6.02148Z"
                      fill="black"
                    />
                  </svg>
                  <span>Apple Calendar</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleConnect("other")}
                >
                  <Calendar className="h-8 w-8" />
                  <span>Other Calendar</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="syncFrequency">Sync Frequency</Label>
                <Select
                  value={settings.syncFrequency}
                  onValueChange={(value) =>
                    setSettings({ ...settings, syncFrequency: value })
                  }
                >
                  <SelectTrigger id="syncFrequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual only</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="realtime">Real-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="syncDirection">Sync Direction</Label>
                <Select
                  value={settings.syncDirection}
                  onValueChange={(value) =>
                    setSettings({ ...settings, syncDirection: value })
                  }
                >
                  <SelectTrigger id="syncDirection">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="import">Import only (Calendar → App)</SelectItem>
                    <SelectItem value="export">Export only (App → Calendar)</SelectItem>
                    <SelectItem value="bidirectional">Bidirectional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCalendar">Default Calendar</Label>
                <Select
                  value={settings.defaultCalendar}
                  onValueChange={(value) =>
                    setSettings({ ...settings, defaultCalendar: value })
                  }
                >
                  <SelectTrigger id="defaultCalendar">
                    <SelectValue placeholder="Select default calendar" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars
                      .filter((cal) => cal.connected)
                      .map((cal) => (
                        <SelectItem key={cal.id} value={cal.id}>
                          {cal.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Declined Events</Label>
                  <p className="text-sm text-muted-foreground">
                    Show events you've declined in your calendar view
                  </p>
                </div>
                <Switch
                  checked={settings.showDeclined}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showDeclined: checked })
                  }
                />
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Include Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Import reminders from your calendar as tasks
                  </p>
                </div>
                <Switch
                  checked={settings.includeReminders}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, includeReminders: checked })
                  }
                />
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-create Calendar Events</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create calendar events for tasks with due dates
                  </p>
                </div>
                <Switch
                  checked={settings.autoCreateEvents}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoCreateEvents: checked })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleUpdateSettings}>Save Settings</Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>Need help with calendar integration?</p>
              <a
                href="#"
                className="text-primary inline-flex items-center hover:underline"
              >
                View documentation
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
            <Button variant="outline" size="sm">
              Advanced Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIntegration;
