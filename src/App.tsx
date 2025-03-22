
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Layout
import Layout from "@/components/layout/Layout";

// Auth Pages
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

// Main Pages
import Dashboard from "@/pages/Dashboard";
import ProjectsList from "@/pages/projects/ProjectsList";
import ProjectDetail from "@/pages/projects/ProjectDetail";
import NotFound from "@/pages/NotFound";

// Feature Pages
import Calendar from "@/pages/calendar/Calendar";
import Tasks from "@/pages/tasks/Tasks";
import Team from "@/pages/team/Team";

// User Pages
import Profile from "@/pages/profile/Profile";
import Settings from "@/pages/settings/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <ProjectProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                
                {/* Main App Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="projects" element={<ProjectsList />} />
                  <Route path="projects/:projectId" element={<ProjectDetail />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="team" element={<Team />} />
                  
                  {/* User Routes */}
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ProjectProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
