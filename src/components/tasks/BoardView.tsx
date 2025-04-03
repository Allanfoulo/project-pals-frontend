import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Task } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskItem from "./TaskItem";
import CreateTaskModal from "./CreateTaskModal";

interface BoardViewProps {
  projectId: string;
  className?: string;
}

const BoardView = ({ projectId, className }: BoardViewProps) => {
  const { projects, updateTask } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  
  if (!project) return null;
  
  const columns = [
    { id: "backlog", name: "Backlog" },
    { id: "todo", name: "To Do" },
    { id: "inProgress", name: "In Progress" },
    { id: "inReview", name: "In Review" },
    { id: "done", name: "Done" },
  ];
  
  const getTasksByStatus = (status: string) => {
    return project.tasks.filter(task => task.status === status);
  };
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    updateTask(taskId, { status: status as "backlog" | "todo" | "inProgress" | "inReview" | "done" });
  };
  
  return (
    <div className={`board-view grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto ${className}`}>
      {columns.map(column => (
        <div key={column.id} className="board-column min-w-[250px]">
          <Card className="h-full">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{column.name}</CardTitle>
                <div className="flex items-center text-xs text-muted-foreground">
                  {getTasksByStatus(column.id).length}
                </div>
              </div>
            </CardHeader>
            <CardContent
              className="p-2 overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-220px)]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="space-y-2">
                {getTasksByStatus(column.id).map(task => (
                  <div 
                    key={task.id} 
                    draggable 
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskItem task={task} />
                  </div>
                ))}
                
                {column.id === "todo" && (
                  <CreateTaskModal 
                    projectId={projectId} 
                    trigger={
                      <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                        <Plus className="h-4 w-4 mr-1" /> Add Task
                      </Button>
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default BoardView;
