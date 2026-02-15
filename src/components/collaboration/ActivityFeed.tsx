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
  const { projects, activities, isLoading: isContextLoading } = useProjects();
  const [filter, setFilter] = useState<"all" | "mentions" | "comments">("all");

  // Map activities to the local format
  const mappedActivities: Activity[] = activities
    .filter(a => !projectId || a.entityId === projectId || a.metadata?.projectId === projectId)
    .map(a => {
      const project = projects.find(p => p.id === (a.entityType === 'project' ? a.entityId : a.metadata?.projectId));
      return {
        id: a.id,
        type: (a.entityType === 'project' ? (a.action === 'created' ? 'create' : 'edit') : 'status') as ActivityType,
        userId: a.userId,
        userName: "You", // In a real app, this would be the actual user name from profiles or auth
        userAvatar: undefined,
        projectId: project?.id || "",
        projectName: project?.name || "Project",
        taskId: a.entityType === 'task' ? a.entityId : undefined,
        taskTitle: a.entityName,
        content: `${a.action} ${a.entityType === 'project' ? '' : 'task'} ${a.entityName || ''}`,
        timestamp: a.createdAt
      };
    });

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

  const filteredActivities = mappedActivities.filter(activity => {
    if (filter === "all") return true;
    if (filter === "mentions" && activity.content && activity.content.includes("@")) return true;
    if (filter === "comments" && activity.type === "comment") return true;
    return false;
  });

  const refreshActivities = () => {
    // Activities auto-refresh via ProjectContext
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
            {isContextLoading ? (
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
