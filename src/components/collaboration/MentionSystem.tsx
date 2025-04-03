import { useState, useRef, useEffect } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

interface MentionSystemProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

const MentionSystem = ({ value, onChange, placeholder = "Add a comment...", className }: MentionSystemProps) => {
  const { projects } = useProjects();
  const [inputValue, setInputValue] = useState(value);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Extract team members from projects
  useEffect(() => {
    // In a real app, this would come from a users API
    // For now, we'll create mock team members
    const mockTeamMembers: TeamMember[] = [
      { id: "user1", name: "John Doe", avatar: "https://i.pravatar.cc/150?u=user1", role: "Project Manager" },
      { id: "user2", name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=user2", role: "Developer" },
      { id: "user3", name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?u=user3", role: "Designer" },
      { id: "user4", name: "Emily Davis", avatar: "https://i.pravatar.cc/150?u=user4", role: "Developer" },
      { id: "user5", name: "Michael Wilson", avatar: "https://i.pravatar.cc/150?u=user5", role: "QA Engineer" },
    ];
    
    setTeamMembers(mockTeamMembers);
  }, [projects]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    
    setInputValue(newValue);
    setCursorPosition(cursorPos);
    
    // Check if we should show the mention menu
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@([\w\s]*)$/); // Match @ followed by any word characters or spaces
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentionMenu(true);
    } else {
      setShowMentionMenu(false);
    }
    
    onChange(newValue);
  };
  
  // Handle selecting a user from the mention menu
  const handleSelectMention = (member: TeamMember) => {
    if (!textareaRef.current) return;
    
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const textAfterCursor = inputValue.substring(cursorPosition);
    
    // Find the position of the @ symbol before cursor
    const lastAtSymbol = textBeforeCursor.lastIndexOf("@");
    
    if (lastAtSymbol !== -1) {
      // Replace the @query with the selected user
      const newTextBeforeCursor = textBeforeCursor.substring(0, lastAtSymbol) + `@${member.name} `;
      const newValue = newTextBeforeCursor + textAfterCursor;
      
      setInputValue(newValue);
      onChange(newValue);
      setShowMentionMenu(false);
      
      // Set cursor position after the inserted mention
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = newTextBeforeCursor.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          setCursorPosition(newCursorPos);
        }
      }, 0);
    }
  };
  
  // Filter team members based on mention query
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );
  
  return (
    <div className={`relative ${className}`}>
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onKeyDown={(e) => {
          // Close mention menu on escape
          if (e.key === "Escape" && showMentionMenu) {
            e.preventDefault();
            setShowMentionMenu(false);
          }
        }}
      />
      
      {showMentionMenu && (
        <div className="absolute z-10 w-[250px] bg-popover text-popover-foreground shadow-md rounded-md border border-border overflow-hidden">
          <Command>
            <CommandInput placeholder="Search team members..." value={mentionQuery} onValueChange={setMentionQuery} />
            <CommandEmpty>No team members found.</CommandEmpty>
            <CommandGroup heading="Team Members">
              {filteredMembers.map(member => (
                <CommandItem
                  key={member.id}
                  onSelect={() => handleSelectMention(member)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                    {member.role && <span className="text-xs text-muted-foreground ml-auto">{member.role}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground mt-1">
        Tip: Use @ to mention team members
      </div>
    </div>
  );
};

export default MentionSystem;
