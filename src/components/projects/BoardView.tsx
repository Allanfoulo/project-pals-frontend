
import { useState } from "react";
import { useProjects, Task } from "@/contexts/ProjectContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  AlarmClock,
  CheckCircle2,
  Flag,
  MoreHorizontal,
  Plus,
} from "lucide-react";

const statusColumns = [
  { id: "backlog", name: "Backlog" },
  { id: "todo", name: "To Do" },
  { id: "inProgress", name: "In Progress" },
  { id: "inReview", name: "In Review" },
  { id: "done", name: "Done" },
];

const priorityColors = {
  low: "bg-blue-500",
  medium: "bg-amber-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

interface BoardViewProps {
  projectId: string;
}

const BoardView = ({ projectId }: BoardViewProps) => {
  const { projects, updateTask } = useProjects();
  const { toast } = useToast();
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    setDraggingTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    if (taskId) {
      const task = project.tasks.find((t) => t.id === taskId);
      if (task && task.status !== status) {
        updateTask(taskId, { status: status as Task["status"] });
        toast({
          title: "Task updated",
          description: `Task moved to ${status.replace(/([A-Z])/g, " $1").trim()}`,
        });
      }
    }
    
    setDraggingTaskId(null);
  };

  return (
    <div className="flex h-full overflow-x-auto pb-4 space-x-4">
      {statusColumns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-72"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{column.name}</h3>
                <Badge variant="secondary">
                  {
                    project.tasks.filter((task) => task.status === column.id)
                      .length
                  }
                </Badge>
              </div>
            </div>
            <div className="p-2 space-y-2 min-h-[200px]">
              {project.tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`transition-all duration-200 ${
                      draggingTaskId === task.id
                        ? "opacity-50"
                        : "opacity-100 hover:translate-y-[-2px]"
                    }`}
                  >
                    <Card className="p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                priorityColors[task.priority]
                              }`}
                            ></div>
                            <span className="text-xs text-muted-foreground">
                              {task.priority.charAt(0).toUpperCase() +
                                task.priority.slice(1)}
                            </span>
                          </div>
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <button className="text-muted-foreground hover:text-foreground ml-2">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          {task.assigneeId && (
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`https://i.pravatar.cc/150?u=${task.assigneeId}`}
                                alt="Assignee"
                              />
                              <AvatarFallback>
                                {task.assigneeId.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {task.subtasks.length > 0 && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <CheckCircle2 size={14} className="mr-1" />
                              {
                                task.subtasks.filter((st) => st.completed).length
                              }
                              /{task.subtasks.length}
                            </div>
                          )}

                          {task.dueDate && (
                            <div
                              className={`flex items-center text-xs ${
                                new Date(task.dueDate) < new Date()
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <AlarmClock size={14} className="mr-1" />
                              {format(new Date(task.dueDate), "MMM d")}
                            </div>
                          )}
                        </div>
                      </div>

                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs px-1.5 py-0 text-muted-foreground"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 2 && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-1.5 py-0 text-muted-foreground"
                            >
                              +{task.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </Card>
                  </div>
                ))}
              <button className="w-full mt-2 p-2 text-sm text-muted-foreground flex items-center justify-center rounded-md hover:bg-secondary/50 transition-colors">
                <Plus size={16} className="mr-1" />
                Add task
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardView;
