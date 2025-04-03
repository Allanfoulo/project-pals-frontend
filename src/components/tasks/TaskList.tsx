import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Task } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isPast, isToday } from "date-fns";
import { Filter, SortAsc, SortDesc, Plus, Clock, AlertTriangle } from "lucide-react";
import CreateTaskModal from "./CreateTaskModal";

interface TaskListProps {
  projectId: string;
  className?: string;
}

type SortOption = "priority" | "dueDate" | "status" | "title";
type SortDirection = "asc" | "desc";

// Simplified inline TaskItem component
const SimpleTaskItem = ({ task }: { task: Task }) => {
  const { updateTask } = useProjects();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-500";
      case "inProgress":
        return "bg-blue-500";
      case "inReview":
        return "bg-purple-500";
      case "todo":
        return "bg-yellow-500";
      case "backlog":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "inProgress":
        return "In Progress";
      case "inReview":
        return "In Review";
      case "todo":
        return "To Do";
      case "backlog":
        return "Backlog";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const toggleTaskStatus = () => {
    const newStatus = task.status === "done" ? "todo" : "done";
    updateTask(task.id, { status: newStatus });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <Checkbox 
            checked={task.status === "done"} 
            onCheckedChange={toggleTaskStatus}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{task.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                {task.dueDate && (
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(task.dueDate), "MMM d")}
                  </div>
                )}
                <Badge className={`${getStatusColor(task.status)} text-white`} variant="secondary">
                  {getStatusText(task.status)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskList = ({ projectId, className }: TaskListProps) => {
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filter, setFilter] = useState<string | null>(null);

  if (!project) return null;

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "priority") {
        const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === "status") {
        const statusOrder = { backlog: 1, todo: 2, inProgress: 3, inReview: 4, done: 5 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const filterTasks = (tasks: Task[]) => {
    if (!filter) return tasks;
    
    switch (filter) {
      case "overdue":
        return tasks.filter(task => task.dueDate && isPast(new Date(task.dueDate)) && task.status !== "done");
      case "today":
        return tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate)));
      case "high":
        return tasks.filter(task => task.priority === "high" || task.priority === "urgent");
      case "inProgress":
        return tasks.filter(task => task.status === "inProgress");
      case "todo":
        return tasks.filter(task => task.status === "todo");
      case "done":
        return tasks.filter(task => task.status === "done");
      default:
        return tasks;
    }
  };

  const filteredAndSortedTasks = sortTasks(filterTasks(project.tasks));

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2">
        <CardTitle className="text-xl mb-2 sm:mb-0">Tasks</CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <div className="flex flex-wrap gap-1 sm:gap-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy("priority")}
              className={`px-2 ${sortBy === "priority" ? "bg-secondary" : ""}`}
            >
              Priority
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy("dueDate")}
              className={`px-2 ${sortBy === "dueDate" ? "bg-secondary" : ""}`}
            >
              Due Date
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy("status")}
              className={`px-2 ${sortBy === "status" ? "bg-secondary" : ""}`}
            >
              Status
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSortDirection}
              className="px-2"
            >
              {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
          <CreateTaskModal projectId={projectId} />
        </div>
      </CardHeader>
      <div className="px-6 pb-2 flex flex-wrap gap-1 task-filters">
        <Badge 
          variant={filter === null ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilter(null)}
        >
          All
        </Badge>
        <Badge 
          variant={filter === "overdue" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilter("overdue")}
        >
          Overdue
        </Badge>
        <Badge 
          variant={filter === "today" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilter("today")}
        >
          Today
        </Badge>
        <Badge 
          variant={filter === "high" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilter("high")}
        >
          High Priority
        </Badge>
        <Badge 
          variant={filter === "inProgress" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilter("inProgress")}
        >
          In Progress
        </Badge>
        <Badge 
          variant={filter === "todo" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilter("todo")}
        >
          To Do
        </Badge>
        <Badge 
          variant={filter === "done" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilter("done")}
        >
          Done
        </Badge>
      </div>
      <CardContent className="pt-0">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No tasks found. Create a new task to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedTasks.map((task) => (
              <SimpleTaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
