import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Plus, Trash, RefreshCw, Check, X, Settings, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type EmailProvider = "gmail" | "outlook" | "smtp" | "sendgrid" | "mailchimp";

interface EmailAccount {
  id: string;
  name: string;
  email: string;
  provider: EmailProvider;
  connected: boolean;
  default?: boolean;
  lastSync?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: "task" | "comment" | "mention" | "deadline" | "status" | "custom";
  active: boolean;
}

interface NotificationSetting {
  id: string;
  type: string;
  description: string;
  email: boolean;
  inApp: boolean;
  frequency: "instant" | "daily" | "weekly" | "never";
}

const EmailIntegration = () => {
  const [accounts, setAccounts] = useState<EmailAccount[]>([
    {
      id: "1",
      name: "Work Gmail",
      email: "work@example.com",
      provider: "gmail",
      connected: true,
      default: true,
      lastSync: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Outlook Account",
      email: "outlook@example.com",
      provider: "outlook",
      connected: true,
      lastSync: new Date().toISOString(),
    },
  ]);

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: "1",
      name: "Task Assignment",
      subject: "[ProjectPals] New task assigned to you: {{taskName}}",
      body: "Hello {{userName}},\n\nYou have been assigned a new task: {{taskName}} in project {{projectName}}.\n\nDue date: {{dueDate}}\nPriority: {{priority}}\n\nView task: {{taskUrl}}\n\nRegards,\nThe ProjectPals Team",
      type: "task",
      active: true,
    },
    {
      id: "2",
      name: "Comment Notification",
      subject: "[ProjectPals] New comment on: {{taskName}}",
      body: "Hello {{userName}},\n\n{{commenterName}} commented on task {{taskName}}:\n\n\"{{commentText}}\"\n\nView comment: {{commentUrl}}\n\nRegards,\nThe ProjectPals Team",
      type: "comment",
      active: true,
    },
    {
      id: "3",
      name: "Mention Alert",
      subject: "[ProjectPals] You were mentioned in a comment",
      body: "Hello {{userName}},\n\n{{mentionerName}} mentioned you in a comment on task {{taskName}}:\n\n\"{{commentText}}\"\n\nView comment: {{commentUrl}}\n\nRegards,\nThe ProjectPals Team",
      type: "mention",
      active: true,
    },
    {
      id: "4",
      name: "Deadline Reminder",
      subject: "[ProjectPals] Task deadline approaching: {{taskName}}",
      body: "Hello {{userName}},\n\nThis is a reminder that the following task is due soon:\n\nTask: {{taskName}}\nDue date: {{dueDate}} (in {{daysLeft}} days)\nProject: {{projectName}}\n\nView task: {{taskUrl}}\n\nRegards,\nThe ProjectPals Team",
      type: "deadline",
      active: true,
    },
  ]);

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
  ]);

  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState(false);
  const [syncingAccounts, setSyncingAccounts] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    provider: "gmail" as EmailProvider,
  });
  const [showNewAccount, setShowNewAccount] = useState(false);

  const handleConnectAccount = () => {
    if (!newAccount.name || !newAccount.email) {
      toast({
        title: "Missing information",
        description: "Please provide both name and email for the account.",
        variant: "destructive",
      });
      return;
    }

    // Simulate connection process
    toast({
      title: "Connecting account",
      description: `Connecting to ${newAccount.provider}...`,
    });

    // Simulate successful connection after a delay
    setTimeout(() => {
      const newEmailAccount: EmailAccount = {
        id: `${accounts.length + 1}`,
        name: newAccount.name,
        email: newAccount.email,
        provider: newAccount.provider,
        connected: true,
        lastSync: new Date().toISOString(),
      };

      setAccounts([...accounts, newEmailAccount]);
      setNewAccount({
        name: "",
        email: "",
        provider: "gmail",
      });
      setShowNewAccount(false);

      toast({
        title: "Account connected",
        description: `Successfully connected ${newEmailAccount.name} (${newEmailAccount.email})`,
      });
    }, 1500);
  };

  const handleDisconnectAccount = (id: string) => {
    setAccounts(
      accounts.map((account) =>
        account.id === id ? { ...account, connected: false } : account
      )
    );

    toast({
      title: "Account disconnected",
      description: "Email account has been disconnected.",
    });
  };

  const handleSetDefaultAccount = (id: string) => {
    setAccounts(
      accounts.map((account) => ({
        ...account,
        default: account.id === id,
      }))
    );

    toast({
      title: "Default account updated",
      description: "Your default email account has been updated.",
    });
  };

  const handleSyncAccounts = () => {
    setSyncingAccounts(true);

    // Simulate sync process
    setTimeout(() => {
      setAccounts(
        accounts.map((account) => ({
          ...account,
          lastSync: account.connected ? new Date().toISOString() : account.lastSync,
        }))
      );
      setSyncingAccounts(false);

      toast({
        title: "Sync complete",
        description: "All email accounts have been synchronized.",
      });
    }, 2000);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setActiveTemplate(template);
    setEditingTemplate(true);
  };

  const handleSaveTemplate = () => {
    if (!activeTemplate) return;

    setTemplates(
      templates.map((template) =>
        template.id === activeTemplate.id ? activeTemplate : template
      )
    );
    setEditingTemplate(false);

    toast({
      title: "Template saved",
      description: "Email template has been updated successfully.",
    });
  };

  const handleToggleTemplate = (id: string, active: boolean) => {
    setTemplates(
      templates.map((template) =>
        template.id === id ? { ...template, active } : template
      )
    );

    toast({
      title: active ? "Template activated" : "Template deactivated",
      description: `Email template has been ${active ? "activated" : "deactivated"}.`,
    });
  };

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
      description: "Your email notification preferences have been saved.",
    });
  };

  const getProviderLabel = (provider: EmailProvider) => {
    switch (provider) {
      case "gmail":
        return "Gmail";
      case "outlook":
        return "Outlook";
      case "smtp":
        return "SMTP Server";
      case "sendgrid":
        return "SendGrid";
      case "mailchimp":
        return "Mailchimp";
      default:
        return provider;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Integration
        </CardTitle>
        <CardDescription>
          Connect your email accounts and manage notification settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="accounts">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="settings">Notification Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Connected Accounts</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncAccounts}
                  disabled={syncingAccounts}
                >
                  {syncingAccounts ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Accounts
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowNewAccount(!showNewAccount)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Account
                </Button>
              </div>
            </div>

            {showNewAccount && (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input
                          id="account-name"
                          placeholder="Work Email"
                          value={newAccount.name}
                          onChange={(e) =>
                            setNewAccount({ ...newAccount, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-email">Email Address</Label>
                        <Input
                          id="account-email"
                          type="email"
                          placeholder="you@example.com"
                          value={newAccount.email}
                          onChange={(e) =>
                            setNewAccount({ ...newAccount, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-provider">Email Provider</Label>
                      <Select
                        value={newAccount.provider}
                        onValueChange={(value) =>
                          setNewAccount({
                            ...newAccount,
                            provider: value as EmailProvider,
                          })
                        }
                      >
                        <SelectTrigger id="account-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gmail">Gmail</SelectItem>
                          <SelectItem value="outlook">Outlook</SelectItem>
                          <SelectItem value="smtp">SMTP Server</SelectItem>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailchimp">Mailchimp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowNewAccount(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleConnectAccount}>
                        Connect Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {accounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Email Accounts</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Connect your email accounts to enable notifications and updates.
                </p>
                <Button onClick={() => setShowNewAccount(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Email Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => (
                  <Card key={account.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${account.connected ? "bg-primary/10" : "bg-muted"}`}
                          >
                            <Mail
                              className={`h-5 w-5 ${account.connected ? "text-primary" : "text-muted-foreground"}`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{account.name}</h4>
                              {account.default && (
                                <Badge variant="outline" className="text-xs">
                                  Default
                                </Badge>
                              )}
                              {!account.connected && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-muted text-muted-foreground"
                                >
                                  Disconnected
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {account.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {account.connected && account.lastSync && (
                            <span className="text-xs text-muted-foreground">
                              Last synced: {new Date(account.lastSync).toLocaleString()}
                            </span>
                          )}
                          <div className="flex items-center">
                            {account.connected ? (
                              <>
                                {!account.default && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSetDefaultAccount(account.id)}
                                  >
                                    Set as Default
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDisconnectAccount(account.id)}
                                >
                                  <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setAccounts(
                                    accounts.map((a) =>
                                      a.id === account.id
                                        ? { ...a, connected: true }
                                        : a
                                    )
                                  )
                                }
                              >
                                Reconnect
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Email Configuration</AlertTitle>
              <AlertDescription>
                Connected email accounts will be used for sending notifications and
                receiving updates. Make sure to check your notification settings.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Email Templates</h3>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>

            {editingTemplate && activeTemplate ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Template: {activeTemplate.name}</CardTitle>
                  <CardDescription>
                    Customize the email template for {activeTemplate.type} notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={activeTemplate.name}
                      onChange={(e) =>
                        setActiveTemplate({
                          ...activeTemplate,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-subject">Email Subject</Label>
                    <Input
                      id="template-subject"
                      value={activeTemplate.subject}
                      onChange={(e) =>
                        setActiveTemplate({
                          ...activeTemplate,
                          subject: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-body">Email Body</Label>
                    <Textarea
                      id="template-body"
                      rows={10}
                      value={activeTemplate.body}
                      onChange={(e) =>
                        setActiveTemplate({
                          ...activeTemplate,
                          body: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Alert className="bg-muted">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Template Variables</AlertTitle>
                    <AlertDescription>
                      Use variables like "{{userName}}", "{{taskName}}", "{{projectName}}",
                      "{{dueDate}}", etc. to personalize the email content.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingTemplate(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveTemplate}>Save Template</Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${template.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                            >
                              {template.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.subject}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={template.active}
                            onCheckedChange={(checked) =>
                              handleToggleTemplate(template.id, checked)
                            }
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Advanced Settings
              </Button>
            </div>

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
              <AlertTitle>Email Delivery</AlertTitle>
              <AlertDescription>
                Email notifications will be sent from your default email account.
                Make sure you have at least one connected account set as default.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default EmailIntegration;
