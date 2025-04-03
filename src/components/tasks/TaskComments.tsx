import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { MessageSquare, Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface TaskCommentsProps {
  taskId: string;
}

// Mock user data - in a real app this would come from a user context
const currentUser = {
  id: "user-1",
  name: "Alex Johnson",
  avatar: "/avatars/alex.png",
  initials: "AJ",
};

// Mock comment data - in a real app this would come from an API or context
interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userInitials: string;
  content: string;
  createdAt: string;
}

const mockComments: Comment[] = [
  {
    id: "c1",
    taskId: "t1",
    userId: "user-2",
    userName: "Sam Taylor",
    userAvatar: "/avatars/sam.png",
    userInitials: "ST",
    content: "I've started working on the wireframes. Should be done by tomorrow.",
    createdAt: "2023-07-03T14:30:00Z",
  },
  {
    id: "c2",
    taskId: "t1",
    userId: "user-3",
    userName: "Jordan Lee",
    userAvatar: "/avatars/jordan.png",
    userInitials: "JL",
    content: "Looking good! Can you add a section for user testimonials?",
    createdAt: "2023-07-04T09:15:00Z",
  },
  {
    id: "c3",
    taskId: "t2",
    userId: "user-1",
    userName: "Alex Johnson",
    userAvatar: "/avatars/alex.png",
    userInitials: "AJ",
    content: "I've reviewed the mockups. We need to adjust the color scheme to match our brand guidelines.",
    createdAt: "2023-07-20T11:45:00Z",
  },
];

const TaskComments = ({ taskId }: TaskCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>(mockComments.filter(c => c.taskId === taskId));
  const [newComment, setNewComment] = useState("");
  
  const addComment = () => {
    if (newComment.trim() === "") return;
    
    const comment: Comment = {
      id: uuidv4(),
      taskId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userInitials: currentUser.initials,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    
    setComments([...comments, comment]);
    setNewComment("");
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium flex items-center gap-1">
        <MessageSquare className="h-4 w-4" />
        <span>Comments</span>
      </h3>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No comments yet</p>
            <p className="text-sm">Be the first to comment on this task</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                <AvatarFallback>{comment.userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.userName}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="flex gap-2 items-start">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px]"
          />
          <Button 
            onClick={addComment} 
            disabled={newComment.trim() === ""}
            className="flex items-center gap-1"
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskComments;
