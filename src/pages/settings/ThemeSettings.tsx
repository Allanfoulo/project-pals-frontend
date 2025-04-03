import { useState, useEffect } from "react";
import { useTheme, CustomTheme, ThemeColors, BrandingOptions } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, Palette, Trash2, Plus, Image, RefreshCw, Save } from "lucide-react";
// Using a custom color input instead of react-color due to dependency conflicts
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ThemeSettings = () => {
  const { 
    theme, 
    setTheme, 
    customTheme, 
    setCustomTheme, 
    branding, 
    setBranding,
    availableThemes,
    addCustomTheme,
    deleteCustomTheme,
    resetToDefaultTheme
  } = useTheme();

  const [activeTab, setActiveTab] = useState<string>("themes");
  
  // Theme editor state
  const [isCreatingTheme, setIsCreatingTheme] = useState<boolean>(false);
  const [editingTheme, setEditingTheme] = useState<CustomTheme | null>(null);
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    primary: "#0ea5e9",
    secondary: "#f1f5f9",
    accent: "#22c55e",
    background: "#ffffff",
    foreground: "#0f172a",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    border: "#e2e8f0"
  });
  const [themeName, setThemeName] = useState<string>("");
  const [themeIsDark, setThemeIsDark] = useState<boolean>(false);
  
  // Branding state
  const [brandingOptions, setBrandingOptions] = useState<BrandingOptions>(branding);
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  // Initialize theme editor when starting to create/edit a theme
  useEffect(() => {
    if (isCreatingTheme) {
      setThemeName("New Custom Theme");
      setThemeColors({
        primary: "#0ea5e9",
        secondary: themeIsDark ? "#1e293b" : "#f1f5f9",
        accent: "#22c55e",
        background: themeIsDark ? "#0f172a" : "#ffffff",
        foreground: themeIsDark ? "#f8fafc" : "#0f172a",
        muted: themeIsDark ? "#1e293b" : "#f1f5f9",
        mutedForeground: themeIsDark ? "#94a3b8" : "#64748b",
        border: themeIsDark ? "#334155" : "#e2e8f0"
      });
    } else if (editingTheme) {
      setThemeName(editingTheme.name);
      setThemeColors(editingTheme.colors);
      setThemeIsDark(editingTheme.isDark);
    }
  }, [isCreatingTheme, editingTheme, themeIsDark]);

  // Handle saving a theme
  const handleSaveTheme = () => {
    if (!themeName.trim()) {
      toast.error("Please provide a theme name");
      return;
    }

    const newTheme: CustomTheme = {
      name: themeName,
      colors: themeColors,
      isDark: themeIsDark
    };

    addCustomTheme(newTheme);
    setCustomTheme(newTheme);
    setIsCreatingTheme(false);
    setEditingTheme(null);
    toast.success(`Theme "${themeName}" saved and applied`);
  };

  // Handle saving branding options
  const handleSaveBranding = () => {
    setBranding(brandingOptions);
    toast.success("Branding options saved");
  };

  // Handle color change in theme editor
  const handleColorChange = (color: string, property: keyof ThemeColors) => {
    setThemeColors(prev => ({
      ...prev,
      [property]: color
    }));
  };

  // Preview a theme
  const previewTheme = (selectedTheme: CustomTheme) => {
    setCustomTheme(selectedTheme);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme & Branding</h1>
          <p className="text-muted-foreground">Customize the appearance of your workspace.</p>
        </div>
      </div>

      <Tabs defaultValue="themes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="custom">Create Theme</TabsTrigger>
        </TabsList>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* System Theme */}
            <Card className={`cursor-pointer ${theme === 'system' ? 'ring-2 ring-primary' : ''}`} onClick={() => setTheme('system')}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  System Theme
                  {theme === 'system' && <Check className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>Follow your system preferences</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-800 border"></div>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-medium">Auto Light/Dark</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Light Theme */}
            <Card className={`cursor-pointer ${theme === 'light' ? 'ring-2 ring-primary' : ''}`} onClick={() => setTheme('light')}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  Light
                  {theme === 'light' && <Check className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>Light mode</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex space-x-2">
                  <div className="w-10 h-10 rounded-full bg-white border"></div>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-medium">Light Theme</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dark Theme */}
            <Card className={`cursor-pointer ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`} onClick={() => setTheme('dark')}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  Dark
                  {theme === 'dark' && <Check className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>Dark mode</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700"></div>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-medium">Dark Theme</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Themes */}
            {availableThemes.filter(t => t.name !== "Default Light" && t.name !== "Default Dark").map((customTheme) => (
              <Card 
                key={customTheme.name} 
                className={`cursor-pointer ${theme === 'custom' && customTheme.name === customTheme?.name ? 'ring-2 ring-primary' : ''}`}
                onClick={() => previewTheme(customTheme)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    {customTheme.name}
                    {theme === 'custom' && customTheme.name === customTheme?.name && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </CardTitle>
                  <CardDescription>{customTheme.isDark ? 'Dark' : 'Light'} custom theme</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex space-x-2">
                    <div 
                      className="w-10 h-10 rounded-full border" 
                      style={{ backgroundColor: customTheme.colors.background }}
                    ></div>
                    <div className="flex flex-col justify-center">
                      <div className="flex space-x-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: customTheme.colors.primary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: customTheme.colors.secondary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: customTheme.colors.accent }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTheme(customTheme);
                        setActiveTab("custom");
                      }}
                    >
                      <Palette className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomTheme(customTheme.name);
                        toast.success(`Theme "${customTheme.name}" deleted`);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}

            {/* Create New Theme Card */}
            <Card 
              className="cursor-pointer border-dashed border-2 hover:border-primary/50 transition-colors"
              onClick={() => {
                setIsCreatingTheme(true);
                setEditingTheme(null);
                setActiveTab("custom");
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle>Create New Theme</CardTitle>
                <CardDescription>Design your own custom theme</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center pb-6 pt-4">
                <Plus className="h-12 w-12 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding Options</CardTitle>
              <CardDescription>Customize your workspace branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  value={brandingOptions.companyName} 
                  onChange={(e) => setBrandingOptions({...brandingOptions, companyName: e.target.value})}
                  placeholder="Your Company Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="logoUrl" 
                    value={brandingOptions.logoUrl} 
                    onChange={(e) => setBrandingOptions({...brandingOptions, logoUrl: e.target.value})}
                    placeholder="/logo.svg"
                  />
                  {brandingOptions.logoUrl && (
                    <div className="flex-shrink-0 w-10 h-10 border rounded flex items-center justify-center overflow-hidden">
                      <img 
                        src={brandingOptions.logoUrl} 
                        alt="Logo preview" 
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => (e.target as HTMLImageElement).src = "/placeholder.svg"}
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Enter the URL of your logo image</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="favicon" 
                    value={brandingOptions.favicon} 
                    onChange={(e) => setBrandingOptions({...brandingOptions, favicon: e.target.value})}
                    placeholder="/favicon.ico"
                  />
                  {brandingOptions.favicon && (
                    <div className="flex-shrink-0 w-10 h-10 border rounded flex items-center justify-center overflow-hidden">
                      <img 
                        src={brandingOptions.favicon} 
                        alt="Favicon preview" 
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => (e.target as HTMLImageElement).src = "/placeholder.svg"}
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Enter the URL of your favicon</p>
              </div>
              
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex gap-2 items-center">
                    <div 
                      className="w-8 h-8 rounded-full border" 
                      style={{ backgroundColor: brandingOptions.accentColor }}
                    />
                    <Input 
                      type="color" 
                      value={brandingOptions.accentColor}
                      onChange={(e) => setBrandingOptions({...brandingOptions, accentColor: e.target.value})}
                      className="w-16 h-8 p-0 cursor-pointer"
                    />
                    <Input 
                      type="text" 
                      value={brandingOptions.accentColor}
                      onChange={(e) => setBrandingOptions({...brandingOptions, accentColor: e.target.value})}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveBranding}>
                <Save className="mr-2 h-4 w-4" />
                Save Branding
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Custom Theme Creator Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingTheme ? `Edit Theme: ${editingTheme.name}` : 'Create Custom Theme'}</CardTitle>
              <CardDescription>Design your own color scheme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="themeName">Theme Name</Label>
                <Input 
                  id="themeName" 
                  value={themeName} 
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="My Custom Theme"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="isDark">Dark Mode</Label>
                <Switch 
                  id="isDark" 
                  checked={themeIsDark} 
                  onCheckedChange={setThemeIsDark} 
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Colors</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary Color */}
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2 items-center">
                      <div 
                        className="w-8 h-8 rounded-full border" 
                        style={{ backgroundColor: themeColors.primary }}
                      />
                      <Input 
                        type="color" 
                        value={themeColors.primary}
                        onChange={(e) => handleColorChange(e.target.value, 'primary')}
                        className="w-16 h-8 p-0 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={themeColors.primary}
                        onChange={(e) => handleColorChange(e.target.value, 'primary')}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  {/* Secondary Color */}
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2 items-center">
                      <div 
                        className="w-8 h-8 rounded-full border" 
                        style={{ backgroundColor: themeColors.secondary }}
                      />
                      <Input 
                        type="color" 
                        value={themeColors.secondary}
                        onChange={(e) => handleColorChange(e.target.value, 'secondary')}
                        className="w-16 h-8 p-0 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={themeColors.secondary}
                        onChange={(e) => handleColorChange(e.target.value, 'secondary')}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  {/* Accent Color */}
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2 items-center">
                      <div 
                        className="w-8 h-8 rounded-full border" 
                        style={{ backgroundColor: themeColors.accent }}
                      />
                      <Input 
                        type="color" 
                        value={themeColors.accent}
                        onChange={(e) => handleColorChange(e.target.value, 'accent')}
                        className="w-16 h-8 p-0 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={themeColors.accent}
                        onChange={(e) => handleColorChange(e.target.value, 'accent')}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  {/* Background Color */}
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2 items-center">
                      <div 
                        className="w-8 h-8 rounded-full border" 
                        style={{ backgroundColor: themeColors.background }}
                      />
                      <Input 
                        type="color" 
                        value={themeColors.background}
                        onChange={(e) => handleColorChange(e.target.value, 'background')}
                        className="w-16 h-8 p-0 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={themeColors.background}
                        onChange={(e) => handleColorChange(e.target.value, 'background')}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  {/* Foreground Color */}
                  <div className="space-y-2">
                    <Label>Foreground Color</Label>
                    <div className="flex gap-2 items-center">
                      <div 
                        className="w-8 h-8 rounded-full border" 
                        style={{ backgroundColor: themeColors.foreground }}
                      />
                      <Input 
                        type="color" 
                        value={themeColors.foreground}
                        onChange={(e) => handleColorChange(e.target.value, 'foreground')}
                        className="w-16 h-8 p-0 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={themeColors.foreground}
                        onChange={(e) => handleColorChange(e.target.value, 'foreground')}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  {/* Muted Color */}
                  <div className="space-y-2">
                    <Label>Muted Color</Label>
                    <div className="flex gap-2 items-center">
                      <div 
                        className="w-8 h-8 rounded-full border" 
                        style={{ backgroundColor: themeColors.muted }}
                      />
                      <Input 
                        type="color" 
                        value={themeColors.muted}
                        onChange={(e) => handleColorChange(e.target.value, 'muted')}
                        className="w-16 h-8 p-0 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={themeColors.muted}
                        onChange={(e) => handleColorChange(e.target.value, 'muted')}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Theme Preview</h4>
                <div className="p-4 rounded-md" style={{ backgroundColor: themeColors.background, color: themeColors.foreground }}>
                  <div className="flex space-x-2 mb-4">
                    <div className="p-2 rounded-md" style={{ backgroundColor: themeColors.primary, color: '#ffffff' }}>Primary</div>
                    <div className="p-2 rounded-md" style={{ backgroundColor: themeColors.secondary, color: themeIsDark ? '#ffffff' : '#0f172a' }}>Secondary</div>
                    <div className="p-2 rounded-md" style={{ backgroundColor: themeColors.accent, color: '#ffffff' }}>Accent</div>
                  </div>
                  <div className="p-2 rounded-md mb-2" style={{ backgroundColor: themeColors.muted, color: themeColors.mutedForeground }}>Muted Text</div>
                  <div className="p-2 border rounded-md" style={{ borderColor: themeColors.border }}>Border</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setIsCreatingTheme(false);
                setEditingTheme(null);
                setActiveTab("themes");
              }}>
                Cancel
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => {
                  // Reset to defaults based on light/dark mode
                  setThemeColors({
                    primary: "#0ea5e9",
                    secondary: themeIsDark ? "#1e293b" : "#f1f5f9",
                    accent: "#22c55e",
                    background: themeIsDark ? "#0f172a" : "#ffffff",
                    foreground: themeIsDark ? "#f8fafc" : "#0f172a",
                    muted: themeIsDark ? "#1e293b" : "#f1f5f9",
                    mutedForeground: themeIsDark ? "#94a3b8" : "#64748b",
                    border: themeIsDark ? "#334155" : "#e2e8f0"
                  });
                }}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={handleSaveTheme}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Theme
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeSettings;
