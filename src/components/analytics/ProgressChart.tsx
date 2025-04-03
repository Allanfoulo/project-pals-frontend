import { useState, useEffect } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays, eachDayOfInterval } from "date-fns";

// Import recharts components for data visualization
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

interface ProgressChartProps {
  projectId: string;
  className?: string;
}

const ProgressChart = ({ projectId, className }: ProgressChartProps) => {
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const [activeTab, setActiveTab] = useState("burndown");
  
  if (!project) return null;
  
  // Calculate task completion statistics
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(task => task.status === "done").length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Generate status distribution data for pie chart
  const statusCounts = {
    backlog: project.tasks.filter(task => task.status === "backlog").length,
    todo: project.tasks.filter(task => task.status === "todo").length,
    inProgress: project.tasks.filter(task => task.status === "inProgress").length,
    inReview: project.tasks.filter(task => task.status === "inReview").length,
    done: completedTasks
  };
  
  const statusData = [
    { name: "Backlog", value: statusCounts.backlog, color: "#94a3b8" },
    { name: "To Do", value: statusCounts.todo, color: "#3b82f6" },
    { name: "In Progress", value: statusCounts.inProgress, color: "#f59e0b" },
    { name: "In Review", value: statusCounts.inReview, color: "#8b5cf6" },
    { name: "Done", value: statusCounts.done, color: "#22c55e" }
  ];
  
  // Generate priority distribution data
  const priorityCounts = {
    high: project.tasks.filter(task => task.priority === "high").length,
    medium: project.tasks.filter(task => task.priority === "medium").length,
    low: project.tasks.filter(task => task.priority === "low").length
  };
  
  const priorityData = [
    { name: "High", value: priorityCounts.high, color: "#ef4444" },
    { name: "Medium", value: priorityCounts.medium, color: "#f59e0b" },
    { name: "Low", value: priorityCounts.low, color: "#22c55e" }
  ];
  
  // Generate burndown chart data (simulated for now)
  // In a real app, you would track task completion over time
  const today = new Date();
  const startDate = subDays(today, 14); // Two weeks of data
  
  const dateRange = eachDayOfInterval({ start: startDate, end: today });
  const burndownData = dateRange.map((date, index) => {
    // Simulate a burndown trend
    const remaining = Math.max(0, totalTasks - Math.floor((index / dateRange.length) * completedTasks));
    return {
      date: format(date, "MMM dd"),
      remaining: remaining,
      ideal: totalTasks - Math.floor((index / dateRange.length) * totalTasks)
    };
  });
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="burndown" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="burndown">Burndown</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="priority">Priority</TabsTrigger>
          </TabsList>
          
          <TabsContent value="burndown" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burndownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="remaining" stroke="#3b82f6" name="Remaining Tasks" strokeWidth={2} />
                  <Line type="monotone" dataKey="ideal" stroke="#94a3b8" name="Ideal Burndown" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Project Completion</div>
            </div>
          </TabsContent>
          
          <TabsContent value="status" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {statusData.map((status) => (
                <div key={status.name} className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <div className="text-xs font-medium">{status.name}</div>
                  <div className="text-xs text-muted-foreground">{status.value}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="priority" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Tasks">
                    {priorityData.map((entry, index) => (
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

export default ProgressChart;
