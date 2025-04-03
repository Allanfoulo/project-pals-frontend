import { useState, useEffect } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { MessageSquare, Send, Trash2, Edit2 } from "lucide-react";
import MentionSystem from "./MentionSystem";

interface CommentSystemProps {
  projectId: string;
  taskId: string;
  className?: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: string;
  edited?: boolean;
}

const CommentSystem = ({ projectId, taskId, className }: CommentSystemProps) => {
  const { projects } = useProjects();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  
  // Current user info (in a real app, this would come from auth context)
  const currentUser = {
    id: "user1",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?u=user1"
  };
  
  // Load comments for the task
  useEffect(() => {
    // In a real app, this would fetch comments from an API
    // For now, we'll generate mock comments
    generateMockComments();
  }, [projectId, taskId]);
  
  const generateMockComments = () => {
    const mockUsers = [
      { id: "user1", name: "John Doe", avatar: "https://i.pravatar.cc/150?u=user1" },
      { id: "user2", name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=user2" },
      { id: "user3", name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?u=user3" },
      { id: "user4", name: "Emily Davis", avatar: "https://i.pravatar.cc/150?u=user4" },
    ];
    
    const mockComments: Comment[] = [];
    
    // Generate 0-5 random comments
    const commentCount = Math.floor(Math.random() * 6);
    
    for (let i = 0; i < commentCount; i++) {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const daysAgo = Math.floor(Math.random() * 7); // 0-6 days ago
      const hoursAgo = Math.floor(Math.random() * 24); // 0-23 hours ago
      
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      
      const commentTemplates = [
        "Let's try to finish this by the end of the week.",
        "I've started working on this. Will update soon.",
        "@Jane can you help with this task?",
        "This is more complex than we initially thought.",
        "I've completed the first part of this task.",
        "We should discuss this in our next meeting.",
        "I need more information to complete this task.",
        "Great progress so far! Keep it up.",
        "@Alex I've addressed your feedback.",
        "This is blocked by the API issue we discussed yesterday."
      ];
      
      mockComments.push({
        id: `comment-${i}-${Date.now()}`,
        content: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        timestamp: timestamp.toISOString(),
        edited: Math.random() > 0.8 // 20% chance of being edited
      });
    }
    
    // Sort comments by timestamp (oldest first)
    mockComments.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    setComments(mockComments);
  };
  
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      timestamp: new Date().toISOString()
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment("");
    
    // In a real app, this would send the comment to an API
  };
  
  const handleEditComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    
    setEditingCommentId(commentId);
    setEditContent(comment.content);
  };
  
  const handleSaveEdit = () => {
    if (!editingCommentId || !editContent.trim()) return;
    
    setComments(prev => 
      prev.map(comment => 
        comment.id === editingCommentId 
          ? { ...comment, content: editContent, edited: true } 
          : comment
      )
    );
    
    setEditingCommentId(null);
    setEditContent("");
    
    // In a real app, this would update the comment via an API
  };
  
  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    
    // In a real app, this would delete the comment via an API
  };
  
  // Helper function to format relative time
  const formatRelativeTime = (date: Date | string) => {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  };
  
  const formatCommentContent = (content: string) => {
    // Highlight mentions
    return content.replace(/@([\w\s]+)/g, '<span class="text-blue-500 font-medium">@$1</span>');
  };
  
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-medium">Comments</h3>
        <span className="text-sm text-muted-foreground">({comments.length})</span>
      </div>
      
      {comments.length > 0 ? (
        <div className="space-y-4 mb-6">
          {comments.map(comment => (
            <Card key={comment.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-0.5">
                    {comment.userAvatar && <AvatarImage src={comment.userAvatar} alt={comment.userName} />}
                    <AvatarFallback>{comment.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(comment.timestamp)}
                          {comment.edited && <span className="ml-1">(edited)</span>}
                        </span>
                      </div>
                      
                      {comment.userId === currentUser.id && (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditComment(comment.id)}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteComment(comment.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {editingCommentId === comment.id ? (
                      <div className="mt-2">
                        <MentionSystem
                          value={editContent}
                          onChange={setEditContent}
                          placeholder="Edit your comment..."
                          className="mb-2"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                          <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                        </div>
                      </div>
                    ) : (
                      <p 
                        className="text-sm mt-1" 
                        dangerouslySetInnerHTML={{ __html: formatCommentContent(comment.content) }}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-6 text-muted-foreground border rounded-md">
          <p>No comments yet</p>
          <p className="text-sm">Be the first to add a comment</p>
        </div>
      )}
      
      <div className="space-y-3">
        <MentionSystem
          value={newComment}
          onChange={setNewComment}
          placeholder="Add a comment..."
        />
        
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSystem;
