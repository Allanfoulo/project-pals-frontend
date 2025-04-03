import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Task } from "@/contexts/ProjectContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag, Plus, X } from "lucide-react";

interface TaskTagsProps {
  task: Task;
  inline?: boolean;
}

// Common tag colors for visual distinction
const tagColors = [
  { name: "red", bg: "bg-red-100", text: "text-red-800" },
  { name: "orange", bg: "bg-orange-100", text: "text-orange-800" },
  { name: "yellow", bg: "bg-yellow-100", text: "text-yellow-800" },
  { name: "green", bg: "bg-green-100", text: "text-green-800" },
  { name: "blue", bg: "bg-blue-100", text: "text-blue-800" },
  { name: "purple", bg: "bg-purple-100", text: "text-purple-800" },
  { name: "pink", bg: "bg-pink-100", text: "text-pink-800" },
];

const TaskTags = ({ task, inline = false }: TaskTagsProps) => {
  const { updateTask } = useProjects();
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  
  const getTagColor = (tag: string) => {
    // Simple hash function to consistently assign colors to tags
    const hash = tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % tagColors.length;
    return tagColors[colorIndex];
  };
  
  const addTag = () => {
    if (newTag.trim() === "" || task.tags.includes(newTag.trim())) return;
    
    const updatedTags = [...task.tags, newTag.trim()];
    updateTask(task.id, { tags: updatedTags });
    setNewTag("");
  };
  
  const removeTag = (tag: string) => {
    const updatedTags = task.tags.filter(t => t !== tag);
    updateTask(task.id, { tags: updatedTags });
  };
  
  if (inline) {
    return (
      <div className="flex flex-wrap gap-1">
        {task.tags.map(tag => {
          const color = getTagColor(tag);
          return (
            <Badge 
              key={tag} 
              variant="outline" 
              className={`${color.bg} ${color.text} border-0 text-xs py-0`}
            >
              {tag}
            </Badge>
          );
        })}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-full">
              <Plus className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60" align="start">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Add Tag</h4>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag name"
                  className="h-8 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <Button size="sm" className="h-8" onClick={addTag}>
                  Add
                </Button>
              </div>
              {task.tags.length > 0 && (
                <div className="pt-2">
                  <h4 className="font-medium text-sm mb-1">Current Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map(tag => {
                      const color = getTagColor(tag);
                      return (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className={`${color.bg} ${color.text} border-0 flex items-center gap-1`}
                        >
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Tags</h4>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Add Tag</h4>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag name"
                  className="h-8 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <Button size="sm" className="h-8" onClick={addTag}>
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {task.tags.length === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>No tags</span>
          </div>
        ) : (
          task.tags.map(tag => {
            const color = getTagColor(tag);
            return (
              <Badge 
                key={tag} 
                variant="outline" 
                className={`${color.bg} ${color.text} border-0 flex items-center gap-1`}
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskTags;
