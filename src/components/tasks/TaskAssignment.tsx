import { useState, useEffect } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Task } from "@/contexts/ProjectContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, UserPlus } from "lucide-react";

interface TaskAssignmentProps {
  task: Task;
  projectId: string;
}

// Mock user data - in a real app this would come from a user context or API
const mockUsers = [
  { id: "user-1", name: "Alex Johnson", avatar: "/avatars/alex.png", initials: "AJ" },
  { id: "user-2", name: "Sam Taylor", avatar: "/avatars/sam.png", initials: "ST" },
  { id: "user-3", name: "Jordan Lee", avatar: "/avatars/jordan.png", initials: "JL" },
  { id: "user-4", name: "Casey Morgan", avatar: "/avatars/casey.png", initials: "CM" },
  { id: "user-5", name: "Riley Smith", avatar: "/avatars/riley.png", initials: "RS" },
];

const TaskAssignment = ({ task, projectId }: TaskAssignmentProps) => {
  const { projects, updateTask } = useProjects();
  const [open, setOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<string[]>([]);
  
  // Get the current project's members
  useEffect(() => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setProjectMembers(project.members);
    }
  }, [projectId, projects]);
  
  const assignedUser = mockUsers.find(user => user.id === task.assigneeId);
  
  const handleAssign = (userId: string) => {
    updateTask(task.id, { assigneeId: userId });
    setOpen(false);
  };
  
  const handleUnassign = () => {
    updateTask(task.id, { assigneeId: undefined });
    setOpen(false);
  };
  
  // Filter users that are members of the project
  const availableUsers = mockUsers.filter(user => projectMembers.includes(user.id));
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          {assignedUser ? (
            <>
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignedUser.avatar} alt={assignedUser.name} />
                <AvatarFallback>{assignedUser.initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{assignedUser.name}</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Assign</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search team members..." />
          <CommandEmpty>No team members found.</CommandEmpty>
          <CommandGroup>
            {availableUsers.map((user) => (
              <CommandItem
                key={user.id}
                onSelect={() => handleAssign(user.id)}
                className="flex items-center gap-2 p-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
                {user.id === task.assigneeId && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </CommandItem>
            ))}
            {task.assigneeId && (
              <CommandItem
                onSelect={handleUnassign}
                className="text-destructive p-2"
              >
                Unassign
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TaskAssignment;
