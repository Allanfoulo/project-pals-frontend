import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays, differenceInDays, isAfter, isBefore } from "date-fns";

// Import recharts components for data visualization
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface PerformanceMetricsProps {
  projectId: string;
  className?: string;
}

const PerformanceMetrics = ({ projectId, className }: PerformanceMetricsProps) => {
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const [activeTab, setActiveTab] = useState("velocity");
  
  if (!project) return null;
  
  // Calculate key performance metrics
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(task => task.status === "done").length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Calculate on-time completion rate
  const tasksWithDueDate = project.tasks.filter(task => task.dueDate);
  const onTimeTasks = tasksWithDueDate.filter(task => {
    if (task.status !== "done" || !task.dueDate) return false;
    // Since completedAt doesn't exist yet, we'll simulate it for demo purposes
    const simulatedCompletedAt = new Date(new Date(task.dueDate).getTime() - Math.random() * 86400000 * 5); // Random completion date up to 5 days before due date
    return !isAfter(simulatedCompletedAt, new Date(task.dueDate));
  });
  const onTimeRate = tasksWithDueDate.length > 0 ? (onTimeTasks.length / tasksWithDueDate.length) * 100 : 0;
  
  // Calculate overdue tasks
  const today = new Date();
  const overdueTasks = project.tasks.filter(task => {
    if (task.status === "done" || !task.dueDate) return false;
    return isBefore(new Date(task.dueDate), today);
  });
  const overdueRate = tasksWithDueDate.length > 0 ? (overdueTasks.length / tasksWithDueDate.length) * 100 : 0;
  
  // Generate velocity chart data (simulated)
  // In a real app, this would be calculated from actual completion dates
  const velocityData = [];
  const now = new Date();
  
  for (let i = 4; i >= 0; i--) {
    const weekStart = subDays(now, i * 7 + 7);
    const weekEnd = subDays(now, i * 7);
    const weekLabel = `Week ${5-i}`;
    
    // Simulate completed tasks per week with some randomness but trending upward
    const baseCompleted = Math.floor(Math.random() * 5) + (5 - i) * 2;
    
    velocityData.push({
      name: weekLabel,
      completed: baseCompleted,
      planned: baseCompleted + Math.floor(Math.random() * 3) + 1
    });
  }
  
  // Generate cycle time data (time from start to completion)
  const cycleTimeData = [];
  const now2 = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now2.getFullYear(), now2.getMonth() - i, 1);
    const monthLabel = format(monthStart, "MMM");
    
    // Simulate average cycle time in days with some randomness but trending downward
    const baseCycleTime = Math.max(1, 10 - i + Math.floor(Math.random() * 3));
    
    cycleTimeData.push({
      name: monthLabel,
      value: baseCycleTime
    });
  }
  
  // Generate radar chart data for project health metrics
  const healthMetrics = [
    {
      subject: "Completion",
      A: Math.round(completionRate),
      fullMark: 100,
    },
    {
      subject: "On Time",
      A: Math.round(onTimeRate),
      fullMark: 100,
    },
    {
      subject: "Estimation",
      A: Math.round(75 + Math.random() * 15), // Simulated accuracy of time estimates
      fullMark: 100,
    },
    {
      subject: "Quality",
      A: Math.round(80 + Math.random() * 15), // Simulated quality score
      fullMark: 100,
    },
    {
      subject: "Efficiency",
      A: Math.round(70 + Math.random() * 20), // Simulated efficiency score
      fullMark: 100,
    },
  ];
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="velocity" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="velocity">Velocity</TabsTrigger>
            <TabsTrigger value="cycleTime">Cycle Time</TabsTrigger>
            <TabsTrigger value="health">Project Health</TabsTrigger>
          </TabsList>
          
          <TabsContent value="velocity" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="planned" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="Planned Tasks"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stackId="2" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    name="Completed Tasks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-secondary/50 rounded-md text-center">
                <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              <div className="p-4 bg-secondary/50 rounded-md text-center">
                <div className="text-2xl font-bold">{Math.round(onTimeRate)}%</div>
                <div className="text-sm text-muted-foreground">On-Time Completion</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cycleTime" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cycleTimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} days`, "Avg. Cycle Time"]} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="Avg. Cycle Time"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <div className="text-2xl font-bold">
                {cycleTimeData.length > 0 ? cycleTimeData[cycleTimeData.length - 1].value : 0} days
              </div>
              <div className="text-sm text-muted-foreground">Current Average Cycle Time</div>
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={healthMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar 
                    name="Project Health" 
                    dataKey="A" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                  <Legend />
                  <Tooltip formatter={(value: number) => [`${value}%`, "Score"]} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-secondary/50 rounded-md">
                <div className="text-lg font-bold">{Math.round(completionRate)}%</div>
                <div className="text-xs text-muted-foreground">Completion</div>
              </div>
              <div className="p-2 bg-secondary/50 rounded-md">
                <div className="text-lg font-bold">{Math.round(onTimeRate)}%</div>
                <div className="text-xs text-muted-foreground">On Time</div>
              </div>
              <div className="p-2 bg-secondary/50 rounded-md">
                <div className="text-lg font-bold">{Math.round(overdueRate)}%</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
