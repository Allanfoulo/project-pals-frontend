import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Code, Copy, ExternalLink, Key, Lock, RefreshCw, Settings, Share2 } from "lucide-react";

interface ApiIntegrationProps {
  className?: string;
}

const ApiIntegration = ({ className }: ApiIntegrationProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"keys" | "webhooks" | "docs">("keys");
  const [apiKey, setApiKey] = useState("pk_test_51NzQwELkj3DfDjdUGplSXM7dkjVMdkjVXYZ");
  const [webhooks, setWebhooks] = useState<{ id: string; url: string; events: string[]; active: boolean }[]>([
    {
      id: "1",
      url: "https://example.com/webhook",
      events: ["task.created", "task.updated"],
      active: true,
    },
  ]);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard",
    });
  };

  const handleRegenerateApiKey = () => {
    // In a real app, this would call an API to regenerate the key
    const newKey = "pk_test_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast({
      title: "API key regenerated",
      description: "A new API key has been generated",
    });
  };

  const handleAddWebhook = () => {
    const newWebhook = {
      id: `${webhooks.length + 1}`,
      url: "",
      events: [],
      active: false,
    };
    setWebhooks([...webhooks, newWebhook]);
  };

  const handleUpdateWebhook = (id: string, data: Partial<{ url: string; events: string[]; active: boolean }>) => {
    setWebhooks(
      webhooks.map((webhook) =>
        webhook.id === id ? { ...webhook, ...data } : webhook
      )
    );
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((webhook) => webhook.id !== id));
    toast({
      title: "Webhook deleted",
      description: "The webhook has been deleted",
    });
  };

  const handleTestWebhook = (id: string) => {
    toast({
      title: "Testing webhook",
      description: "Sending test payload to webhook endpoint",
    });

    // Simulate successful test after a delay
    setTimeout(() => {
      toast({
        title: "Webhook test successful",
        description: "The webhook endpoint responded successfully",
      });
    }, 1500);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          API Integration
        </CardTitle>
        <CardDescription>
          Integrate with our API to build custom applications and automate workflows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="keys">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Share2 className="h-4 w-4 mr-2" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="docs">
              <Code className="h-4 w-4 mr-2" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="space-y-6 pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Use these keys to authenticate requests with our API. Keep them
                secure and never share them publicly.
              </p>

              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">API Key</h4>
                    <p className="text-sm text-muted-foreground">
                      Use this key for all API requests
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Production
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Input
                      value={apiKey}
                      readOnly
                      type="password"
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={handleCopyApiKey}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateApiKey}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Security notice:</p>
                  <p>
                    Regenerating your API key will invalidate your existing key
                    and require updating all applications using it.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">API Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">
                      Limit API requests to prevent abuse (100 requests per minute)
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">CORS Settings</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow cross-origin requests from specified domains
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Request Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all API requests for debugging and auditing
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Webhooks</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive real-time notifications when events happen in your account.
                  </p>
                </div>
                <Button onClick={handleAddWebhook}>
                  Add Webhook
                </Button>
              </div>

              {webhooks.length > 0 ? (
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Webhook Endpoint</h4>
                          {webhook.active ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-500 text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTestWebhook(webhook.id)}
                          >
                            Test
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWebhook(webhook.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`webhook-url-${webhook.id}`}>URL</Label>
                        <Input
                          id={`webhook-url-${webhook.id}`}
                          value={webhook.url}
                          onChange={(e) => handleUpdateWebhook(webhook.id, { url: e.target.value })}
                          placeholder="https://example.com/webhook"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Events to send</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "task.created",
                            "task.updated",
                            "task.deleted",
                            "comment.created",
                            "project.created",
                            "project.updated",
                          ].map((event) => (
                            <div
                              key={event}
                              className="flex items-center space-x-2"
                            >
                              <Switch
                                id={`${webhook.id}-${event}`}
                                checked={webhook.events.includes(event)}
                                onCheckedChange={(checked) => {
                                  const newEvents = checked
                                    ? [...webhook.events, event]
                                    : webhook.events.filter((e) => e !== event);
                                  handleUpdateWebhook(webhook.id, { events: newEvents });
                                }}
                              />
                              <Label
                                htmlFor={`${webhook.id}-${event}`}
                                className="text-sm font-normal"
                              >
                                {event}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`webhook-active-${webhook.id}`}
                          checked={webhook.active}
                          onCheckedChange={(checked) => handleUpdateWebhook(webhook.id, { active: checked })}
                        />
                        <Label
                          htmlFor={`webhook-active-${webhook.id}`}
                          className="font-normal"
                        >
                          Webhook active
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg">
                  <Share2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No webhooks configured</p>
                  <p className="text-sm">Add a webhook to receive real-time notifications</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6 pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">API Documentation</h3>
              <p className="text-muted-foreground">
                Our RESTful API allows you to programmatically access and modify your data.
                Below are some examples to help you get started.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Authentication</h4>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        curl -X GET https://api.projectpals.com/v1/projects \
                        -H "Authorization: Bearer YOUR_API_KEY"
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Create a Task</h4>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        curl -X POST https://api.projectpals.com/v1/tasks \
                        -H "Authorization: Bearer YOUR_API_KEY" \
                        -H "Content-Type: application/json" \
                        -d '{{"title":"New Task","description":"Task description","projectId":"123","status":"todo"}}'
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Update a Task</h4>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        curl -X PATCH https://api.projectpals.com/v1/tasks/456 \
                        -H "Authorization: Bearer YOUR_API_KEY" \
                        -H "Content-Type: application/json" \
                        -d '{{"status":"inProgress"}}'
                      </code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full API Documentation
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>Need help with our API?</p>
              <a
                href="#"
                className="text-primary inline-flex items-center hover:underline"
              >
                Contact developer support
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
            <Button variant="outline" size="sm">
              API Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiIntegration;
