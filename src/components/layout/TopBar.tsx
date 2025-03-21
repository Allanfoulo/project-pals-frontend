
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  X,
  Plus,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";

interface TopBarProps {
  onToggleSidebar: () => void;
}

const TopBar = ({ onToggleSidebar }: TopBarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="h-16 border-b border-border bg-background flex items-center justify-between px-4 z-10">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-secondary/50 transition-colors"
        >
          <Menu size={20} />
        </button>

        {searchOpen ? (
          <div className="relative animate-fade-in">
            <Input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md hover:bg-secondary/50 transition-colors text-muted-foreground"
          >
            <Search size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Create</span>
              <ChevronDown size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors">
                New Project
              </button>
              <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors">
                New Task
              </button>
              <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors">
                New Workspace
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <button className="p-2 rounded-md hover:bg-secondary/50 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full border border-border"
                  src={user.avatarUrl}
                  alt={user.name}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => navigate("/profile")}
                className="cursor-pointer"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => navigate("/settings")}
                className="cursor-pointer"
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleLogout}
                className="text-red-500 cursor-pointer"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default TopBar;
