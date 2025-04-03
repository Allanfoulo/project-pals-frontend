import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  Cell,
  PieChart,
  Pie
} from "recharts";

interface WorkloadVisualizationProps {
  projectId: string;
  className?: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  taskCount: number;
  highPriorityCount: number;
  dueSoonCount: number;
  color: string;
}

const WorkloadVisualization = ({ projectId, className }: WorkloadVisualizationProps) => {
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const [activeTab, setActiveTab] = useState("taskCount");
  
  if (!project) return null;
  
  // For demo purposes, let's generate some sample team members
  // In a real app, these would come from the database
  const teamMembers: TeamMember[] = [
    { id: "1", name: "Alice Smith", taskCount: 0, highPriorityCount: 0, dueSoonCount: 0, color: "#3b82f6" },
    { id: "2", name: "Bob Johnson", taskCount: 0, highPriorityCount: 0, dueSoonCount: 0, color: "#8b5cf6" },
    { id: "3", name: "Carol Williams", taskCount: 0, highPriorityCount: 0, dueSoonCount: 0, color: "#f59e0b" },
    { id: "4", name: "David Brown", taskCount: 0, highPriorityCount: 0, dueSoonCount: 0, color: "#ef4444" },
    { id: "5", name: "Eva Davis", taskCount: 0, highPriorityCount: 0, dueSoonCount: 0, color: "#22c55e" }
  ];
  
  // Distribute tasks among team members for visualization
  project.tasks.forEach((task, index) => {
    // Assign each task to a team member (round-robin for demo)
    const memberIndex = index % teamMembers.length;
    teamMembers[memberIndex].taskCount++;
    
    // Count high priority tasks
    if (task.priority === "high") {
      teamMembers[memberIndex].highPriorityCount++;
    }
    
    // Count tasks due within the next 3 days
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      
      if (dueDate <= threeDaysFromNow && dueDate >= today) {
        teamMembers[memberIndex].dueSoonCount++;
      }
    }
  });
  
  // Sort team members by task count for better visualization
  const sortedTeamMembers = [...teamMembers].sort((a, b) => b.taskCount - a.taskCount);
  
  // Calculate workload distribution percentages
  const totalTasks = project.tasks.length;
  const workloadDistribution = sortedTeamMembers.map(member => ({
    name: member.name,
    value: member.taskCount,
    percentage: totalTasks > 0 ? Math.round((member.taskCount / totalTasks) * 100) : 0,
    color: member.color
  }));
  
  // Calculate high priority task distribution
  const highPriorityDistribution = sortedTeamMembers.map(member => ({
    name: member.name,
    value: member.highPriorityCount,
    color: member.color
  }));
  
  // Calculate due soon task distribution
  const dueSoonDistribution = sortedTeamMembers.map(member => ({
    name: member.name,
    value: member.dueSoonCount,
    color: member.color
  }));
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Team Workload</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="taskCount" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="taskCount">Task Count</TabsTrigger>
            <TabsTrigger value="highPriority">High Priority</TabsTrigger>
            <TabsTrigger value="dueSoon">Due Soon</TabsTrigger>
          </TabsList>
          
          <TabsContent value="taskCount" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} tasks`, "Task Count"]} />
                  <Legend />
                  <Bar dataKey="value" name="Task Count">
                    {workloadDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Team Members</h3>
              <div className="space-y-2">
                {sortedTeamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                        <AvatarFallback style={{ backgroundColor: member.color }}>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.taskCount} tasks</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {totalTasks > 0 ? Math.round((member.taskCount / totalTasks) * 100) : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="highPriority" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={highPriorityDistribution.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {highPriorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} tasks`, "High Priority Tasks"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {sortedTeamMembers.reduce((sum, member) => sum + member.highPriorityCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total High Priority Tasks</div>
            </div>
          </TabsContent>
          
          <TabsContent value="dueSoon" className="space-y-4">
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dueSoonDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} tasks`, "Tasks Due Soon"]} />
                  <Legend />
                  <Bar dataKey="value" name="Tasks Due Soon">
                    {dueSoonDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {sortedTeamMembers.reduce((sum, member) => sum + member.dueSoonCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tasks Due in Next 3 Days</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WorkloadVisualization;
