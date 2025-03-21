
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  PlusCircle, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  Filter 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/contexts/ProjectContext";
import { Task } from "@/contexts/ProjectContext";

const Tasks = () => {
  const { projects } = useProjects();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get all tasks from all projects
  const allTasks = projects.reduce((acc, project) => {
    return [...acc, ...project.tasks.map(task => ({...task, projectName: project.name}))];
  }, [] as (Task & {projectName: string})[]);

  // Filter and search tasks
  const filteredTasks = allTasks.filter(task => {
    // Filter by status
    if (filter !== "all" && task.status !== filter) {
      return false;
    }
    
    // Search functionality
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Group tasks by priority
  const urgentTasks = filteredTasks.filter(task => task.priority === "urgent");
  const highTasks = filteredTasks.filter(task => task.priority === "high");
  const mediumTasks = filteredTasks.filter(task => task.priority === "medium");
  const lowTasks = filteredTasks.filter(task => task.priority === "low");

  // Get task count by status
  const tasksByStatus = {
    backlog: allTasks.filter(t => t.status === "backlog").length,
    todo: allTasks.filter(t => t.status === "todo").length,
    inProgress: allTasks.filter(t => t.status === "inProgress").length,
    inReview: allTasks.filter(t => t.status === "inReview").length,
    done: allTasks.filter(t => t.status === "done").length,
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "urgent": return "text-red-500 bg-red-100 dark:bg-red-900/20";
      case "high": return "text-orange-500 bg-orange-100 dark:bg-orange-900/20";
      case "medium": return "text-blue-500 bg-blue-100 dark:bg-blue-900/20";
      case "low": return "text-green-500 bg-green-100 dark:bg-green-900/20";
      default: return "text-gray-500 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "backlog": return <Clock className="h-4 w-4 text-gray-500" />;
      case "todo": return <Clock className="h-4 w-4 text-blue-500" />;
      case "inProgress": return <Clock className="h-4 w-4 text-orange-500" />;
      case "inReview": return <Clock className="h-4 w-4 text-purple-500" />;
      case "done": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const TaskItem = ({ task }: { task: Task & {projectName: string} }) => (
    <div className="p-4 border rounded-lg hover:bg-secondary transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Checkbox id={`task-${task.id}`} />
          <div>
            <label
              htmlFor={`task-${task.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {task.title}
            </label>
            <p className="text-sm text-muted-foreground mt-1">
              {task.description.length > 100 
                ? `${task.description.substring(0, 100)}...` 
                : task.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {task.projectName}
              </Badge>
              <Badge 
                variant="secondary" 
                className={`text-xs ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                {getStatusIcon(task.status)} 
                <span className="ml-1">{task.status}</span>
              </div>
            </div>
          </div>
        </div>
        {task.dueDate && (
          <Badge variant="outline" className="text-xs">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{allTasks.length}</div>
            <Progress value={100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Backlog</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{tasksByStatus.backlog}</div>
            <Progress value={(tasksByStatus.backlog / allTasks.length) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{tasksByStatus.todo}</div>
            <Progress value={(tasksByStatus.todo / allTasks.length) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{tasksByStatus.inProgress}</div>
            <Progress value={(tasksByStatus.inProgress / allTasks.length) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{tasksByStatus.done}</div>
            <Progress value={(tasksByStatus.done / allTasks.length) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="inReview">In Review</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {urgentTasks.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500" /> 
                    Urgent
                  </h3>
                  <div className="space-y-2">
                    {urgentTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}
              
              {highTasks.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">High Priority</h3>
                  <div className="space-y-2">
                    {highTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}
              
              {mediumTasks.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Medium Priority</h3>
                  <div className="space-y-2">
                    {mediumTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}
              
              {lowTasks.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Low Priority</h3>
                  <div className="space-y-2">
                    {lowTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
        {["todo", "inProgress", "inReview", "done"].map(status => (
          <TabsContent key={status} value={status} className="mt-4">
            <div className="space-y-2">
              {filteredTasks.filter(task => task.status === status).length > 0 ? (
                filteredTasks
                  .filter(task => task.status === status)
                  .map(task => <TaskItem key={task.id} task={task} />)
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No {status} tasks found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Tasks;
