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
import { useToast } from "@/components/ui/use-toast";
import { Cloud, Database, ExternalLink, FileText, FolderOpen, HardDrive, Link, RefreshCw, Upload, X } from "lucide-react";

interface FileStorageIntegrationProps {
  className?: string;
}

type StorageProvider = "dropbox" | "google" | "onedrive" | "local";

interface ConnectedStorage {
  id: string;
  name: string;
  provider: StorageProvider;
  email?: string;
  connected: boolean;
  lastSync?: string;
  usedSpace?: string;
  totalSpace?: string;
}

const FileStorageIntegration = ({ className }: FileStorageIntegrationProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"connected" | "settings">("connected");
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [storageProviders, setStorageProviders] = useState<ConnectedStorage[]>([
    {
      id: "1",
      name: "Dropbox",
      provider: "dropbox",
      email: "john.doe@example.com",
      connected: true,
      lastSync: "2025-04-03T06:30:00Z",
      usedSpace: "2.4 GB",
      totalSpace: "5 GB",
    },
    {
      id: "2",
      name: "Google Drive",
      provider: "google",
      email: "john.doe@gmail.com",
      connected: true,
      lastSync: "2025-04-03T05:45:00Z",
      usedSpace: "8.2 GB",
      totalSpace: "15 GB",
    },
  ]);

  const [settings, setSettings] = useState({
    defaultProvider: "1",
    autoSync: true,
    syncFrequency: "daily",
    compressFiles: false,
    backupEnabled: true,
    backupFrequency: "weekly",
    localBackupPath: "C:\\Backups\\ProjectPals",
  });

  const handleConnect = (provider: StorageProvider) => {
    toast({
      title: "Connecting to storage",
      description: `Opening authentication for ${provider}...`,
    });

    // Simulate successful connection after a delay
    setTimeout(() => {
      const newStorage: ConnectedStorage = {
        id: `${storageProviders.length + 1}`,
        name: provider === "dropbox" ? "Dropbox" : 
              provider === "google" ? "Google Drive" : 
              provider === "onedrive" ? "OneDrive" : "Local Storage",
        provider,
        email: provider !== "local" ? `user@${provider}.com` : undefined,
        connected: true,
        lastSync: new Date().toISOString(),
        usedSpace: "0 GB",
        totalSpace: provider === "google" ? "15 GB" : 
                   provider === "dropbox" ? "2 GB" : 
                   provider === "onedrive" ? "5 GB" : "Unlimited",
      };

      setStorageProviders([...storageProviders, newStorage]);

      toast({
        title: "Storage connected",
        description: `Successfully connected to ${newStorage.name}`,
      });
    }, 1500);
  };

  const handleDisconnect = (id: string) => {
    setStorageProviders(
      storageProviders.map((storage) =>
        storage.id === id ? { ...storage, connected: false } : storage
      )
    );

    toast({
      title: "Storage disconnected",
      description: "Storage has been disconnected",
    });
  };

  const handleReconnect = (id: string) => {
    setStorageProviders(
      storageProviders.map((storage) =>
        storage.id === id ? { ...storage, connected: true, lastSync: new Date().toISOString() } : storage
      )
    );

    toast({
      title: "Storage reconnected",
      description: "Storage has been reconnected",
    });
  };

  const handleRemove = (id: string) => {
    setStorageProviders(storageProviders.filter((storage) => storage.id !== id));

    toast({
      title: "Storage removed",
      description: "Storage has been removed",
    });
  };

  const handleSyncNow = () => {
    setSyncInProgress(true);

    // Simulate sync process
    setTimeout(() => {
      setStorageProviders(
        storageProviders.map((storage) => ({
          ...storage,
          lastSync: storage.connected ? new Date().toISOString() : storage.lastSync,
        }))
      );

      setSyncInProgress(false);

      toast({
        title: "Sync complete",
        description: "All storage providers have been synchronized",
      });
    }, 2000);
  };

  const handleUpdateSettings = () => {
    toast({
      title: "Settings updated",
      description: "File storage settings have been updated",
    });
  };

  const getProviderIcon = (provider: StorageProvider) => {
    switch (provider) {
      case "dropbox":
        return (
          <svg className="h-4 w-4 text-[#0061FF]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2L0 6.75l6 4.5 6-4.5L6 2zm12 0l-6 4.75 6 4.5 6-4.5-6-4.75zm-6 10.5L6 7.75l-6 4.5L6 17l6-4.75zm12 0l-6-4.75-6 4.5L12 17l6-4.75zM6 17.75l6 4.5 6-4.5-6-4.5-6 4.5z" />
          </svg>
        );
      case "google":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path d="M4.43056 10.1111L0 14.5417L4.43056 18.9722L8.86111 14.5417L4.43056 10.1111Z" fill="#0066DA" />
            <path d="M14.5417 10.1111L10.1111 14.5417L14.5417 18.9722L18.9722 14.5417L14.5417 10.1111Z" fill="#00AC47" />
            <path d="M9.48611 15.1667L5.05556 19.5972L9.48611 24.0278L13.9167 19.5972L9.48611 15.1667Z" fill="#00832D" />
            <path d="M19.5972 15.1667L15.1667 19.5972L19.5972 24.0278L24.0278 19.5972L19.5972 15.1667Z" fill="#2684FC" />
            <path d="M19.5972 5.05556L15.1667 9.48611L19.5972 13.9167L24.0278 9.48611L19.5972 5.05556Z" fill="#EA4335" />
            <path d="M9.48611 5.05556L5.05556 9.48611L9.48611 13.9167L13.9167 9.48611L9.48611 5.05556Z" fill="#00AC47" />
            <path d="M4.43056 0L0 4.43056L4.43056 8.86111L8.86111 4.43056L4.43056 0Z" fill="#0066DA" />
            <path d="M14.5417 0L10.1111 4.43056L14.5417 8.86111L18.9722 4.43056L14.5417 0Z" fill="#2684FC" />
          </svg>
        );
      case "onedrive":
        return (
          <svg className="h-4 w-4 text-[#0078D4]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.5 18.5h7.8c2.7 0 4.8-2.2 4.8-4.8 0-2.3-1.7-4.3-3.9-4.7 0-0.1 0-0.2 0-0.3 0-3.3-2.7-6-6-6-2.8 0-5.2 2-5.8 4.6-0.6-0.2-1.4-0.4-2.1-0.4-3 0-5.5 2.5-5.5 5.5 0 3 2.5 5.5 5.5 5.5h5.2v0.6z" />
          </svg>
        );
      default:
        return <HardDrive className="h-4 w-4" />;
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
          <Cloud className="h-5 w-5" />
          File Storage Integration
        </CardTitle>
        <CardDescription>
          Connect cloud storage providers to store and access your project files.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connected">Connected Storage</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="connected" className="space-y-6 pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Your Storage Providers</h3>
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
              {storageProviders.length > 0 ? (
                storageProviders.map((storage) => (
                  <div
                    key={storage.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
                        {getProviderIcon(storage.provider)}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {storage.name}
                          {storage.connected ? (
                            <Badge variant="outline" className="text-xs bg-green-50">
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-red-50">
                              Disconnected
                            </Badge>
                          )}
                        </div>
                        {storage.email && (
                          <div className="text-sm text-muted-foreground">
                            {storage.email}
                          </div>
                        )}
                        {storage.connected && (
                          <div className="flex text-xs text-muted-foreground gap-2">
                            <span>Last sync: {formatLastSync(storage.lastSync)}</span>
                            {storage.usedSpace && storage.totalSpace && (
                              <span>
                                {storage.usedSpace} of {storage.totalSpace} used
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {storage.connected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(storage.id)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReconnect(storage.id)}
                        >
                          Reconnect
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(storage.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Cloud className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No storage providers connected</p>
                  <p className="text-sm">Connect a storage provider to get started</p>
                </div>
              )}
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">Connect a new storage provider</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleConnect("dropbox")}
                >
                  <svg className="h-8 w-8 text-[#0061FF]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 2L0 6.75l6 4.5 6-4.5L6 2zm12 0l-6 4.75 6 4.5 6-4.5-6-4.75zm-6 10.5L6 7.75l-6 4.5L6 17l6-4.75zm12 0l-6-4.75-6 4.5L12 17l6-4.75zM6 17.75l6 4.5 6-4.5-6-4.5-6 4.5z" />
                  </svg>
                  <span>Dropbox</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleConnect("google")}
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24">
                    <path d="M4.43056 10.1111L0 14.5417L4.43056 18.9722L8.86111 14.5417L4.43056 10.1111Z" fill="#0066DA" />
                    <path d="M14.5417 10.1111L10.1111 14.5417L14.5417 18.9722L18.9722 14.5417L14.5417 10.1111Z" fill="#00AC47" />
                    <path d="M9.48611 15.1667L5.05556 19.5972L9.48611 24.0278L13.9167 19.5972L9.48611 15.1667Z" fill="#00832D" />
                    <path d="M19.5972 15.1667L15.1667 19.5972L19.5972 24.0278L24.0278 19.5972L19.5972 15.1667Z" fill="#2684FC" />
                    <path d="M19.5972 5.05556L15.1667 9.48611L19.5972 13.9167L24.0278 9.48611L19.5972 5.05556Z" fill="#EA4335" />
                    <path d="M9.48611 5.05556L5.05556 9.48611L9.48611 13.9167L13.9167 9.48611L9.48611 5.05556Z" fill="#00AC47" />
                    <path d="M4.43056 0L0 4.43056L4.43056 8.86111L8.86111 4.43056L4.43056 0Z" fill="#0066DA" />
                    <path d="M14.5417 0L10.1111 4.43056L14.5417 8.86111L18.9722 4.43056L14.5417 0Z" fill="#2684FC" />
                  </svg>
                  <span>Google Drive</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleConnect("onedrive")}
                >
                  <svg className="h-8 w-8 text-[#0078D4]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10.5 18.5h7.8c2.7 0 4.8-2.2 4.8-4.8 0-2.3-1.7-4.3-3.9-4.7 0-0.1 0-0.2 0-0.3 0-3.3-2.7-6-6-6-2.8 0-5.2 2-5.8 4.6-0.6-0.2-1.4-0.4-2.1-0.4-3 0-5.5 2.5-5.5 5.5 0 3 2.5 5.5 5.5 5.5h5.2v0.6z" />
                  </svg>
                  <span>OneDrive</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleConnect("local")}
                >
                  <HardDrive className="h-8 w-8" />
                  <span>Local Storage</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultProvider">Default Storage Provider</Label>
                <Select
                  value={settings.defaultProvider}
                  onValueChange={(value) =>
                    setSettings({ ...settings, defaultProvider: value })
                  }
                >
                  <SelectTrigger id="defaultProvider">
                    <SelectValue placeholder="Select default provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {storageProviders
                      .filter((provider) => provider.connected)
                      .map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Sync Files</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync files with storage providers
                  </p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoSync: checked })
                  }
                />
              </div>

              {settings.autoSync && (
                <div className="space-y-2 pl-6 border-l-2 border-muted ml-2">
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
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Compress Files</Label>
                  <p className="text-sm text-muted-foreground">
                    Compress files before uploading to save storage space
                  </p>
                </div>
                <Switch
                  checked={settings.compressFiles}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, compressFiles: checked })
                  }
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Create regular backups of your project files
                    </p>
                  </div>
                  <Switch
                    checked={settings.backupEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, backupEnabled: checked })
                    }
                  />
                </div>

                {settings.backupEnabled && (
                  <div className="space-y-4 pl-6 border-l-2 border-muted ml-2">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <Select
                        value={settings.backupFrequency}
                        onValueChange={(value) =>
                          setSettings({ ...settings, backupFrequency: value })
                        }
                      >
                        <SelectTrigger id="backupFrequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="localBackupPath">Local Backup Path</Label>
                      <div className="flex gap-2">
                        <Input
                          id="localBackupPath"
                          value={settings.localBackupPath}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              localBackupPath: e.target.value,
                            })
                          }
                        />
                        <Button variant="outline" size="icon">
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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
              <p>Need help with file storage integration?</p>
              <a
                href="#"
                className="text-primary inline-flex items-center hover:underline"
              >
                View documentation
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
            <Button variant="outline" size="sm">
              Manage File Types
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileStorageIntegration;
