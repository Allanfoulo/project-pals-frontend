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
  Filter,
  Calendar,
  LayoutGrid,
  List as ListIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/contexts/ProjectContext";
import { Task } from "@/contexts/ProjectContext";
import TaskItem from "@/components/tasks/TaskItem";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isPast, isToday } from "date-fns";

const Tasks = () => {
  const { projects, updateTask } = useProjects();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "board" | "calendar">("list");
  const [sortBy, setSortBy] = useState<"priority" | "dueDate" | "status">("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Get all tasks from all projects
  const allTasks = projects.reduce((acc, project) => {
    return [...acc, ...project.tasks.map(task => ({...task, projectName: project.name, projectId: project.id}))]; 
  }, [] as (Task & {projectName: string, projectId: string})[]);

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

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 4;
      const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 4;
      return sortDirection === "asc" ? priorityA - priorityB : priorityB - priorityA;
    } else if (sortBy === "dueDate") {
      if (!a.dueDate) return sortDirection === "asc" ? 1 : -1;
      if (!b.dueDate) return sortDirection === "asc" ? -1 : 1;
      return sortDirection === "asc" 
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    } else if (sortBy === "status") {
      const statusOrder = { backlog: 0, todo: 1, inProgress: 2, inReview: 3, done: 4 };
      const statusA = statusOrder[a.status as keyof typeof statusOrder] || 0;
      const statusB = statusOrder[b.status as keyof typeof statusOrder] || 0;
      return sortDirection === "asc" ? statusA - statusB : statusB - statusA;
    }
    return 0;
  });

  // Group tasks by priority
  const urgentTasks = sortedTasks.filter(task => task.priority === "urgent");
  const highTasks = sortedTasks.filter(task => task.priority === "high");
  const mediumTasks = sortedTasks.filter(task => task.priority === "medium");
  const lowTasks = sortedTasks.filter(task => task.priority === "low");

  // Get task count by status
  const tasksByStatus = {
    backlog: allTasks.filter(t => t.status === "backlog").length,
    todo: allTasks.filter(t => t.status === "todo").length,
    inProgress: allTasks.filter(t => t.status === "inProgress").length,
    inReview: allTasks.filter(t => t.status === "inReview").length,
    done: allTasks.filter(t => t.status === "done").length,
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleTaskStatusChange = (taskId: string, completed: boolean) => {
    updateTask(taskId, { status: completed ? "done" : "todo" });
  };

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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("priority")}>
                Sort by Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
                Sort by Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("status")}>
                Sort by Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleSortDirection}>
                {sortDirection === "asc" ? "Ascending" : "Descending"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex rounded-md border">
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="icon" 
              className="rounded-none rounded-l-md" 
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "board" ? "default" : "ghost"} 
              size="icon" 
              className="rounded-none" 
              onClick={() => setViewMode("board")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "calendar" ? "default" : "ghost"} 
              size="icon" 
              className="rounded-none rounded-r-md" 
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          
          <CreateTaskModal 
            projectId={projects.length > 0 ? projects[0].id : ""} 
            trigger={
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            }
          />
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

      <Tabs defaultValue="all" onValueChange={setFilter} className="tabs-list">
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="inReview">In Review</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {sortedTasks.length > 0 ? (
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
              {sortedTasks.filter(task => task.status === status).length > 0 ? (
                sortedTasks
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
