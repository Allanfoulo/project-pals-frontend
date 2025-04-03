import { useProjects } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, differenceInDays, isAfter } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  Users,
  CheckCheck,
  Hourglass,
  PieChart,
} from "lucide-react";

interface ProjectDashboardProps {
  projectId: string;
}

const ProjectDashboard = ({ projectId }: ProjectDashboardProps) => {
  const { projects, workspaces } = useProjects();
  const project = projects.find((p) => p.id === projectId);

  if (!project) return null;

  const workspace = workspaces.find((w) => w.id === project.workspace);

  // Calculate task statistics
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = project.tasks.filter((t) => 
    ["inProgress", "inReview"].includes(t.status)
  ).length;
  const pendingTasks = project.tasks.filter((t) => 
    ["backlog", "todo"].includes(t.status)
  ).length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // Calculate days remaining if due date exists
  const daysRemaining = project.dueDate 
    ? differenceInDays(parseISO(project.dueDate), new Date()) 
    : null;
  
  // Determine project status
  const isOverdue = project.dueDate && daysRemaining !== null && daysRemaining < 0;
  const isNearDeadline = project.dueDate && daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7;
  
  // Calculate priority distribution
  const priorityDistribution = {
    high: project.tasks.filter(t => t.priority === "high" || t.priority === "urgent").length,
    medium: project.tasks.filter(t => t.priority === "medium").length,
    low: project.tasks.filter(t => t.priority === "low").length,
  };
  
  // Calculate recent activity
  const recentTasks = [...project.tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <div>
                <Badge 
                  variant={project.status === "completed" ? "default" : "outline"}
                  className="ml-auto"
                >
                  {project.status === "active" ? "In Progress" : 
                   project.status === "completed" ? "Completed" : "On Hold"}
                </Badge>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-2 mt-2" />
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-muted-foreground">
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-foreground">{pendingTasks}</div>
                <div>Pending</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-foreground">{inProgressTasks}</div>
                <div>In Progress</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-foreground">{completedTasks}</div>
                <div>Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Tracking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {isOverdue ? (
                <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              ) : isNearDeadline ? (
                <Clock className="h-5 w-5 text-amber-500 mr-2" />
              ) : (
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              )}
              <div>
                {project.dueDate ? (
                  <div>
                    <div className="text-sm font-medium">
                      {isOverdue 
                        ? "Overdue" 
                        : isNearDeadline 
                          ? "Due Soon" 
                          : "Due Date"}
                    </div>
                    <div className="text-lg font-semibold">
                      {format(parseISO(project.dueDate), "MMM d, yyyy")}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No due date set</div>
                )}
              </div>
            </div>
            {daysRemaining !== null && (
              <div className="mt-2 text-sm">
                {daysRemaining < 0 ? (
                  <span className="text-destructive">
                    Overdue by {Math.abs(daysRemaining)} day{Math.abs(daysRemaining) !== 1 && "s"}
                  </span>
                ) : (
                  <span>
                    {daysRemaining} day{daysRemaining !== 1 && "s"} remaining
                  </span>
                )}
              </div>
            )}
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <div>Started</div>
                <div>{format(parseISO(project.createdAt), "MMM d, yyyy")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-lg font-semibold">
                {project.members.length} member{project.members.length !== 1 && "s"}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex -space-x-2">
                {project.members.slice(0, 5).map((memberId, index) => (
                  <div 
                    key={index} 
                    className="h-8 w-8 rounded-full bg-primary-foreground border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {memberId.slice(0, 2).toUpperCase()}
                  </div>
                ))}
                {project.members.length > 5 && (
                  <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                    +{project.members.length - 5}
                  </div>
                )}
              </div>
            </div>
            {workspace && (
              <div className="mt-4 text-xs">
                <div className="flex items-center">
                  <span
                    className="h-2 w-2 rounded-full mr-2"
                    style={{ backgroundColor: workspace.color }}
                  />
                  <span>{workspace.name} Workspace</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PieChart className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-lg font-semibold">
                {totalTasks} Task{totalTasks !== 1 && "s"}
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                  <span>High Priority</span>
                </div>
                <div className="font-medium">{priorityDistribution.high}</div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" />
                  <span>Medium Priority</span>
                </div>
                <div className="font-medium">{priorityDistribution.medium}</div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  <span>Low Priority</span>
                </div>
                <div className="font-medium">{priorityDistribution.low}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Status Tabs */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="status">Status Breakdown</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          {task.status === "done" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <div 
                              className="h-5 w-5 rounded-full" 
                              style={{ 
                                backgroundColor: 
                                  task.priority === "high" || task.priority === "urgent" 
                                    ? "#ef4444" 
                                    : task.priority === "medium" 
                                      ? "#f59e0b" 
                                      : "#22c55e"
                              }} 
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground mt-0.5">
                            {task.status === "backlog" ? "Backlog" :
                             task.status === "todo" ? "To Do" :
                             task.status === "inProgress" ? "In Progress" :
                             task.status === "inReview" ? "In Review" : "Done"}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(task.createdAt), "MMM d")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No tasks created yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="status" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Backlog */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Hourglass className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="font-medium">Backlog</span>
                    </div>
                    <Badge variant="outline">
                      {project.tasks.filter(t => t.status === "backlog").length}
                    </Badge>
                  </div>
                  <Progress 
                    value={totalTasks > 0 ? (project.tasks.filter(t => t.status === "backlog").length / totalTasks) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                
                {/* To Do */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="font-medium">To Do</span>
                    </div>
                    <Badge variant="outline">
                      {project.tasks.filter(t => t.status === "todo").length}
                    </Badge>
                  </div>
                  <Progress 
                    value={totalTasks > 0 ? (project.tasks.filter(t => t.status === "todo").length / totalTasks) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                
                {/* In Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="font-medium">In Progress</span>
                    </div>
                    <Badge variant="outline">
                      {project.tasks.filter(t => t.status === "inProgress").length}
                    </Badge>
                  </div>
                  <Progress 
                    value={totalTasks > 0 ? (project.tasks.filter(t => t.status === "inProgress").length / totalTasks) * 100 : 0} 
                    className="h-2 bg-muted" 
                    indicatorClassName="bg-blue-500"
                  />
                </div>
                
                {/* In Review */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="font-medium">In Review</span>
                    </div>
                    <Badge variant="outline">
                      {project.tasks.filter(t => t.status === "inReview").length}
                    </Badge>
                  </div>
                  <Progress 
                    value={totalTasks > 0 ? (project.tasks.filter(t => t.status === "inReview").length / totalTasks) * 100 : 0} 
                    className="h-2 bg-muted" 
                    indicatorClassName="bg-amber-500"
                  />
                </div>
                
                {/* Done */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CheckCheck className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium">Done</span>
                    </div>
                    <Badge variant="outline">
                      {project.tasks.filter(t => t.status === "done").length}
                    </Badge>
                  </div>
                  <Progress 
                    value={totalTasks > 0 ? (project.tasks.filter(t => t.status === "done").length / totalTasks) * 100 : 0} 
                    className="h-2 bg-muted" 
                    indicatorClassName="bg-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDashboard;
