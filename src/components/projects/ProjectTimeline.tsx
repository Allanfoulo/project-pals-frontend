import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isBefore, isAfter, parseISO, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2, Flag } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface ProjectTimelineProps {
  projectId: string;
}

type Milestone = {
  id: string;
  title: string;
  date: string;
  completed: boolean;
};

// Extend the Project type to include milestones
type ProjectWithMilestones = {
  id: string;
  name: string;
  createdAt: string;
  dueDate?: string;
  milestones?: Milestone[];
};

const ProjectTimeline = ({ projectId }: ProjectTimelineProps) => {
  const { projects, updateProject } = useProjects();
  const [open, setOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    date: new Date(),
  });

  const project = projects.find(p => p.id === projectId) as ProjectWithMilestones;
  const milestones = project?.milestones || [];
  
  // Sort milestones by date
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleAddMilestone = () => {
    if (!newMilestone.title.trim()) return;
    
    const milestone: Milestone = {
      id: uuidv4(),
      title: newMilestone.title,
      date: newMilestone.date.toISOString(),
      completed: false,
    };
    
    const updatedMilestones = [...milestones, milestone];
    updateProject(projectId, { milestones: updatedMilestones } as Partial<any>);
    
    setNewMilestone({
      title: "",
      date: new Date(),
    });
    setOpen(false);
  };

  const handleToggleMilestone = (id: string) => {
    const updatedMilestones = milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, completed: !milestone.completed }
        : milestone
    );
    
    updateProject(projectId, { milestones: updatedMilestones } as Partial<any>);
  };

  const handleDeleteMilestone = (id: string) => {
    const updatedMilestones = milestones.filter(milestone => milestone.id !== id);
    updateProject(projectId, { milestones: updatedMilestones } as Partial<any>);
  };

  const calculateProgress = () => {
    if (milestones.length === 0) return 0;
    const completedCount = milestones.filter(m => m.completed).length;
    return Math.round((completedCount / milestones.length) * 100);
  };

  const getTimelineStatus = (date: string) => {
    const today = new Date();
    const milestoneDate = parseISO(date);
    
    if (isBefore(milestoneDate, today)) {
      return "past";
    } else if (differenceInDays(milestoneDate, today) <= 7) {
      return "upcoming";
    } else {
      return "future";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Project Timeline</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Project Milestone</DialogTitle>
              <DialogDescription>
                Create key milestones to track your project progress.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="milestone-title">Milestone Title</Label>
                <Input
                  id="milestone-title"
                  placeholder="Enter milestone title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({
                    ...newMilestone,
                    title: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="milestone-date">Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="milestone-date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newMilestone.date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newMilestone.date}
                      onSelect={(date) => date && setNewMilestone({
                        ...newMilestone,
                        date
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMilestone}>Add Milestone</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {project?.createdAt && project?.dueDate && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Start:</span> {format(parseISO(project.createdAt), "PPP")}
          </div>
          <div>
            <span className="font-medium">Due:</span> {format(parseISO(project.dueDate), "PPP")}
          </div>
        </div>
      )}
      
      <div className="relative">
        {/* Progress bar */}
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
        
        {/* Timeline */}
        <div className="mt-8 space-y-6">
          {sortedMilestones.length > 0 ? (
            sortedMilestones.map((milestone) => {
              const status = getTimelineStatus(milestone.date);
              return (
                <div key={milestone.id} className="relative pl-8 pb-6">
                  {/* Vertical line */}
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted" />
                  
                  {/* Milestone dot */}
                  <div 
                    className={cn(
                      "absolute left-0 top-0 h-6 w-6 rounded-full border-2 border-background flex items-center justify-center",
                      milestone.completed ? "bg-green-500" : 
                      status === "past" ? "bg-red-500" :
                      status === "upcoming" ? "bg-amber-500" :
                      "bg-blue-500"
                    )}
                  >
                    <Flag className="h-3 w-3 text-white" />
                  </div>
                  
                  {/* Milestone content */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 
                          className={cn(
                            "text-base font-medium",
                            milestone.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {milestone.title}
                        </h4>
                        <button 
                          onClick={() => handleToggleMilestone(milestone.id)}
                          className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            milestone.completed ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {milestone.completed ? "Completed" : "Mark Complete"}
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(parseISO(milestone.date), "PPP")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No milestones added yet</p>
              <p className="text-sm mt-1">Add milestones to track your project progress</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
