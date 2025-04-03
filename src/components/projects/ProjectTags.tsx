import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X, Tag as TagIcon } from "lucide-react";

interface ProjectTagsProps {
  projectId: string;
  className?: string;
}

// We need to extend the Project type to include tags
type ProjectWithTags = {
  id: string;
  tags?: string[];
};

const ProjectTags = ({ projectId, className }: ProjectTagsProps) => {
  const { projects, updateProject } = useProjects();
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  
  const project = projects.find(p => p.id === projectId) as ProjectWithTags;
  const tags = project?.tags || [];
  
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    // Prevent duplicate tags
    if (tags.includes(newTag.trim())) {
      setNewTag("");
      return;
    }
    
    const updatedTags = [...tags, newTag.trim()];
    updateProject(projectId, { tags: updatedTags } as Partial<any>);
    setNewTag("");
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    updateProject(projectId, { tags: updatedTags } as Partial<any>);
  };
  
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge key={tag} variant="outline" className="flex items-center gap-1">
            {tag}
            <button 
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 rounded-full hover:bg-muted p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-6">
              <Plus className="h-3 w-3 mr-1" /> Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Project Tags</DialogTitle>
              <DialogDescription>
                Tags help you categorize and filter your projects.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <TagIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter tag name"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button onClick={handleAddTag}>Add</Button>
              </div>
              
              <div>
                <h4 className="mb-2 text-sm font-medium">Current Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.length > 0 ? (
                    tags.map(tag => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags added yet</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectTags;
