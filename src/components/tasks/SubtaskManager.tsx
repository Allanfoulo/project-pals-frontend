import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Task, Subtask } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface SubtaskManagerProps {
  task: Task;
}

const SubtaskManager = ({ task }: SubtaskManagerProps) => {
  const { updateTask } = useProjects();
  const [newSubtask, setNewSubtask] = useState("");
  
  const calculateProgress = () => {
    if (task.subtasks.length === 0) return 0;
    const completedCount = task.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / task.subtasks.length) * 100);
  };
  
  const addSubtask = () => {
    if (newSubtask.trim() === "") return;
    
    const updatedSubtasks = [
      ...task.subtasks,
      {
        id: uuidv4(),
        title: newSubtask.trim(),
        completed: false,
      },
    ];
    
    updateTask(task.id, { subtasks: updatedSubtasks });
    setNewSubtask("");
  };
  
  const toggleSubtask = (id: string) => {
    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === id
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    
    updateTask(task.id, { subtasks: updatedSubtasks });
  };
  
  const deleteSubtask = (id: string) => {
    const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== id);
    updateTask(task.id, { subtasks: updatedSubtasks });
  };
  
  const progress = calculateProgress();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Subtasks</h3>
        <span className="text-xs text-muted-foreground">
          {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} completed
        </span>
      </div>
      
      {task.subtasks.length > 0 && (
        <div className="space-y-1">
          <Progress value={progress} className="h-1" />
          <p className="text-xs text-right text-muted-foreground">{progress}% complete</p>
        </div>
      )}
      
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {task.subtasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No subtasks yet. Add one below.</p>
        ) : (
          task.subtasks.map(subtask => (
            <div key={subtask.id} className="flex items-center space-x-2">
              <Checkbox
                checked={subtask.completed}
                onCheckedChange={() => toggleSubtask(subtask.id)}
                id={`subtask-${subtask.id}`}
              />
              <label
                htmlFor={`subtask-${subtask.id}`}
                className={`text-sm flex-1 ${subtask.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {subtask.title}
              </label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => deleteSubtask(subtask.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>
      
      <div className="flex space-x-2">
        <Input
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="Add a new subtask"
          className="text-sm"
          onKeyDown={(e) => e.key === "Enter" && addSubtask()}
        />
        <Button size="sm" onClick={addSubtask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SubtaskManager;
