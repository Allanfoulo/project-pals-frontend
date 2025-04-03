import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { NotificationSystem } from "@/components/collaboration";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes("/auth")) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Retrieve sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setSidebarCollapsed(savedState === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    // Save sidebar state to localStorage
    localStorage.setItem("sidebarCollapsed", String(newState));
    
    // Show a toast notification when sidebar state changes
    toast({
      title: newState ? "Sidebar collapsed" : "Sidebar expanded",
      description: newState 
        ? "Click the menu icon to expand it again." 
        : "You now have more space for navigation.",
      duration: 2000,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto bg-secondary/30 p-2 sm:p-4 md:p-6">
            <div className="animate-fade-in max-w-full">
              <Outlet />
            </div>
          </main>
          <footer className="border-t bg-background p-2 sm:p-4 text-center text-xs sm:text-sm text-muted-foreground">
            <p>TaskFlow &copy; {new Date().getFullYear()} - Project Management Made Simple</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
