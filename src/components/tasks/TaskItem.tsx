import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Task } from "@/contexts/ProjectContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Clock, AlertTriangle, Tag, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskDetails from "./TaskDetails";

interface TaskItemProps {
  task: Task & { projectName?: string, projectId?: string };
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { updateTask } = useProjects();
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const calculateSubtaskProgress = () => {
    if (task.subtasks.length === 0) return 0;
    const completedCount = task.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / task.subtasks.length) * 100);
  };

  const toggleTaskStatus = () => {
    const newStatus = task.status === "done" ? "todo" : "done";
    updateTask(task.id, { status: newStatus });
  };

  const subtaskProgress = calculateSubtaskProgress();

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
                {!expanded && task.description && (
                  <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-2">
                {task.priority !== "medium" && (
                  <AlertTriangle className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
                )}
                {task.dueDate && (
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(task.dueDate), "MMM d")}
                  </div>
                )}
                <Badge className={`${getStatusColor(task.status)} text-white`} variant="secondary">
                  {getStatusText(task.status)}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {expanded && (
              <div className="mt-2">
                {task.description && (
                  <p className="text-sm mb-2">{task.description}</p>
                )}

                {task.subtasks.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Subtasks Progress</span>
                      <span>{subtaskProgress}%</span>
                    </div>
                    <Progress value={subtaskProgress} className="h-1" />
                  </div>
                )}

                {task.tags.length > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setShowDetails(true)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {showDetails && (
        <TaskDetails
          task={{ ...task, projectId: task.projectId || "default-project" }}
          open={showDetails}
          onOpenChange={setShowDetails}
        />
      )}
    </Card>
  );
};

export default TaskItem;
