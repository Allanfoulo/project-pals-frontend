import { useState, useEffect } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow } from "date-fns";
import { MessageSquare, Edit, Plus, CheckSquare, AlertCircle, Clock, RefreshCw } from "lucide-react";

interface ActivityFeedProps {
  projectId?: string; // Optional - if provided, shows only activities for this project
  className?: string;
}

// Define activity types
type ActivityType = "comment" | "edit" | "create" | "complete" | "assign" | "status" | "due_date";

interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userAvatar?: string;
  projectId: string;
  projectName: string;
  taskId?: string;
  taskTitle?: string;
  content?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

const ActivityFeed = ({ projectId, className }: ActivityFeedProps) => {
  const { projects } = useProjects();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<"all" | "mentions" | "comments">("all");
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate mock activities for demonstration
  useEffect(() => {
    generateMockActivities();
  }, [projectId, projects]);
  
  const generateMockActivities = () => {
    setIsLoading(true);
    
    // Get relevant projects
    const relevantProjects = projectId 
      ? projects.filter(p => p.id === projectId)
      : projects;
    
    if (relevantProjects.length === 0) {
      setActivities([]);
      setIsLoading(false);
      return;
    }
    
    // Generate mock activities
    const mockActivities: Activity[] = [];
    
    // Add activities for each project
    relevantProjects.forEach(project => {
      // Add project creation activity
      mockActivities.push({
        id: `create-project-${project.id}`,
        type: "create",
        userId: "user1",
        userName: "John Doe",
        userAvatar: "https://i.pravatar.cc/150?u=user1",
        projectId: project.id,
        projectName: project.name,
        content: `created project ${project.name}`,
        timestamp: new Date(project.createdAt).toISOString()
      });
      
      // Add activities for each task
      project.tasks.forEach(task => {
        // Task creation
        mockActivities.push({
          id: `create-task-${task.id}`,
          type: "create",
          userId: "user1",
          userName: "John Doe",
          userAvatar: "https://i.pravatar.cc/150?u=user1",
          projectId: project.id,
          projectName: project.name,
          taskId: task.id,
          taskTitle: task.title,
          content: `created task ${task.title}`,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Random time within last week
        });
        
        // Task status change
        if (task.status !== "todo") {
          mockActivities.push({
            id: `status-${task.id}`,
            type: "status",
            userId: "user2",
            userName: "Jane Smith",
            userAvatar: "https://i.pravatar.cc/150?u=user2",
            projectId: project.id,
            projectName: project.name,
            taskId: task.id,
            taskTitle: task.title,
            oldValue: "todo",
            newValue: task.status,
            content: `changed status from "To Do" to "${task.status === "inProgress" ? "In Progress" : task.status === "inReview" ? "In Review" : task.status === "done" ? "Done" : task.status}"`,
            timestamp: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString() // Random time within last 5 days
          });
        }
        
        // Task completion
        if (task.status === "done") {
          mockActivities.push({
            id: `complete-${task.id}`,
            type: "complete",
            userId: "user3",
            userName: "Alex Johnson",
            userAvatar: "https://i.pravatar.cc/150?u=user3",
            projectId: project.id,
            projectName: project.name,
            taskId: task.id,
            taskTitle: task.title,
            content: `completed task ${task.title}`,
            timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() // Random time within last 3 days
          });
        }
        
        // Task comments (random)
        if (Math.random() > 0.5) {
          mockActivities.push({
            id: `comment-${task.id}-1`,
            type: "comment",
            userId: "user4",
            userName: "Emily Davis",
            userAvatar: "https://i.pravatar.cc/150?u=user4",
            projectId: project.id,
            projectName: project.name,
            taskId: task.id,
            taskTitle: task.title,
            content: `I'll start working on this today. @John can you clarify the requirements?`,
            timestamp: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString() // Random time within last 2 days
          });
        }
        
        // Task assignment
        if (task.assigneeId) {
          mockActivities.push({
            id: `assign-${task.id}`,
            type: "assign",
            userId: "user1",
            userName: "John Doe",
            userAvatar: "https://i.pravatar.cc/150?u=user1",
            projectId: project.id,
            projectName: project.name,
            taskId: task.id,
            taskTitle: task.title,
            content: `assigned task to @${task.assigneeId === "user2" ? "Jane Smith" : task.assigneeId === "user3" ? "Alex Johnson" : task.assigneeId === "user4" ? "Emily Davis" : "User"}`,
            timestamp: new Date(Date.now() - Math.random() * 4 * 24 * 60 * 60 * 1000).toISOString() // Random time within last 4 days
          });
        }
      });
    });
    
    // Sort activities by timestamp (newest first)
    mockActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setActivities(mockActivities);
    setIsLoading(false);
  };
  
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "edit":
        return <Edit className="h-4 w-4" />;
      case "create":
        return <Plus className="h-4 w-4" />;
      case "complete":
        return <CheckSquare className="h-4 w-4" />;
      case "assign":
        return <Avatar className="h-4 w-4" />;
      case "status":
        return <RefreshCw className="h-4 w-4" />;
      case "due_date":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case "comment":
        return "text-blue-500";
      case "edit":
        return "text-yellow-500";
      case "create":
        return "text-green-500";
      case "complete":
        return "text-green-500";
      case "assign":
        return "text-purple-500";
      case "status":
        return "text-orange-500";
      case "due_date":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  
  const formatActivityContent = (content: string) => {
    // Highlight mentions
    return content.replace(/@([\w\s]+)/g, '<span class="text-blue-500 font-medium">@$1</span>');
  };
  
  const filteredActivities = activities.filter(activity => {
    if (filter === "all") return true;
    if (filter === "mentions" && activity.content && activity.content.includes("@")) return true;
    if (filter === "comments" && activity.type === "comment") return true;
    return false;
  });
  
  const refreshActivities = () => {
    generateMockActivities();
  };

  // Helper function to format relative time
  const formatRelativeTime = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Activity Feed</CardTitle>
        <Button variant="ghost" size="sm" onClick={refreshActivities}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="mentions">@Mentions</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map(activity => (
                <div key={activity.id} className="flex gap-3 py-3 border-b last:border-0">
                  <Avatar className="h-8 w-8">
                    {activity.userAvatar && <AvatarImage src={activity.userAvatar} alt={activity.userName} />}
                    <AvatarFallback>{activity.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.userName}</span>
                      <span className={`${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p 
                      className="text-sm" 
                      dangerouslySetInnerHTML={{ __html: formatActivityContent(activity.content || '') }}
                    />
                    
                    <div className="flex items-center gap-2 mt-1">
                      {activity.taskId && (
                        <Badge variant="outline" className="text-xs">
                          {activity.taskTitle}
                        </Badge>
                      )}
                      {!projectId && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.projectName}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No activities found</p>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
