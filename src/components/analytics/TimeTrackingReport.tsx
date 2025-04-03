import { useState, useEffect } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, differenceInMinutes, addMinutes } from "date-fns";

// Import recharts components for data visualization
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface TimeTrackingReportProps {
  projectId: string;
  className?: string;
}

interface TimeEntry {
  taskId: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
}

const TimeTrackingReport = ({ projectId, className }: TimeTrackingReportProps) => {
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const [activeTab, setActiveTab] = useState("byTask");
  
  if (!project) return null;
  
  // For demo purposes, let's generate some sample time entries
  // In a real app, these would come from the database
  const generateSampleTimeEntries = (): TimeEntry[] => {
    const entries: TimeEntry[] = [];
    
    project.tasks.forEach(task => {
      // Generate 1-3 time entries per task
      const entryCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < entryCount; i++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 14)); // Within last 2 weeks
        startDate.setHours(9 + Math.floor(Math.random() * 8)); // Between 9am and 5pm
        startDate.setMinutes(Math.floor(Math.random() * 60));
        
        const duration = Math.floor(Math.random() * 180) + 30; // 30 to 210 minutes
        const endDate = addMinutes(startDate, duration);
        
        entries.push({
          taskId: task.id,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          duration: duration
        });
      }
    });
    
    return entries;
  };
  
  const timeEntries = generateSampleTimeEntries();
  
  // Calculate time spent per task
  const timeByTask = project.tasks.map(task => {
    const taskEntries = timeEntries.filter(entry => entry.taskId === task.id);
    const totalMinutes = taskEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return {
      id: task.id,
      name: task.title,
      status: task.status,
      priority: task.priority,
      hours: hours,
      minutes: minutes,
      totalMinutes: totalMinutes,
      displayTime: `${hours}h ${minutes}m`,
      color: getPriorityColor(task.priority)
    };
  }).sort((a, b) => b.totalMinutes - a.totalMinutes);
  
  // Calculate time spent per status
  const timeByStatus = [
    { name: "Backlog", value: 0, color: "#94a3b8" },
    { name: "To Do", value: 0, color: "#3b82f6" },
    { name: "In Progress", value: 0, color: "#f59e0b" },
    { name: "In Review", value: 0, color: "#8b5cf6" },
    { name: "Done", value: 0, color: "#22c55e" }
  ];
  
  timeByTask.forEach(task => {
    const statusIndex = timeByStatus.findIndex(s => {
      const statusMap: Record<string, string> = {
        "backlog": "Backlog",
        "todo": "To Do",
        "inProgress": "In Progress",
        "inReview": "In Review",
        "done": "Done"
      };
      return s.name === statusMap[task.status];
    });
    
    if (statusIndex !== -1) {
      timeByStatus[statusIndex].value += task.totalMinutes;
    }
  });
  
  // Calculate time spent per priority
  const timeByPriority = [
    { name: "High", value: 0, color: "#ef4444" },
    { name: "Medium", value: 0, color: "#f59e0b" },
    { name: "Low", value: 0, color: "#22c55e" }
  ];
  
  timeByTask.forEach(task => {
    const priorityIndex = timeByPriority.findIndex(p => p.name.toLowerCase() === task.priority);
    if (priorityIndex !== -1) {
      timeByPriority[priorityIndex].value += task.totalMinutes;
    }
  });
  
  // Helper function to get color based on priority
  function getPriorityColor(priority: string): string {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#22c55e";
      default:
        return "#94a3b8";
    }
  }
  
  // Format minutes as hours and minutes
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Time Tracking Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="byTask" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="byTask">By Task</TabsTrigger>
            <TabsTrigger value="byStatus">By Status</TabsTrigger>
            <TabsTrigger value="byPriority">By Priority</TabsTrigger>
          </TabsList>
          
          <TabsContent value="byTask" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={timeByTask.slice(0, 10)} // Show top 10 tasks by time
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatMinutes(value), "Time Spent"]}
                  />
                  <Legend />
                  <Bar dataKey="totalMinutes" name="Time Spent">
                    {timeByTask.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatMinutes(timeByTask.reduce((sum, task) => sum + task.totalMinutes, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Time Tracked</div>
            </div>
          </TabsContent>
          
          <TabsContent value="byStatus" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeByStatus.filter(status => status.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {timeByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatMinutes(value), "Time Spent"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {timeByStatus.filter(status => status.value > 0).map((status) => (
                <div key={status.name} className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <div className="text-xs font-medium">{status.name}</div>
                  <div className="text-xs text-muted-foreground">{formatMinutes(status.value)}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="byPriority" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={timeByPriority.filter(priority => priority.value > 0)} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [formatMinutes(value), "Time Spent"]} />
                  <Legend />
                  <Bar dataKey="value" name="Time Spent">
                    {timeByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TimeTrackingReport;
