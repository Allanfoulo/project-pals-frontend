
import { Moon, Sun, Palette, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

export function ThemeToggle() {
  const { theme, setTheme, customTheme, setCustomTheme, availableThemes } = useTheme();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {theme === "custom" ? (
            <Palette className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>System Themes</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          System
        </DropdownMenuItem>
        
        {availableThemes.filter(t => t.name !== "Default Light" && t.name !== "Default Dark").length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Custom Themes</DropdownMenuLabel>
            {availableThemes
              .filter(t => t.name !== "Default Light" && t.name !== "Default Dark")
              .map(customTheme => (
                <DropdownMenuItem 
                  key={customTheme.name} 
                  onClick={() => {
                    setTheme("custom");
                    // This will trigger the useEffect in ThemeContext to apply the theme
                    setCustomTheme(customTheme);
                  }}
                >
                  <div 
                    className="mr-2 h-4 w-4 rounded-full" 
                    style={{ backgroundColor: customTheme.colors.primary }}
                  />
                  {customTheme.name}
                </DropdownMenuItem>
              ))
            }
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings/theme")}>
          <Settings className="mr-2 h-4 w-4" />
          Theme Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
