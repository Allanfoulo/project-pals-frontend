import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, File, Image, FileText, X, Download } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface TaskAttachmentsProps {
  taskId: string;
}

interface Attachment {
  id: string;
  taskId: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// Mock attachments - in a real app these would come from an API or context
const mockAttachments: Attachment[] = [
  {
    id: "a1",
    taskId: "t1",
    name: "wireframe-homepage.png",
    size: 1240000,
    type: "image/png",
    url: "/attachments/wireframe-homepage.png",
    uploadedAt: "2023-07-03T15:30:00Z",
  },
  {
    id: "a2",
    taskId: "t1",
    name: "design-requirements.pdf",
    size: 2450000,
    type: "application/pdf",
    url: "/attachments/design-requirements.pdf",
    uploadedAt: "2023-07-02T10:15:00Z",
  },
  {
    id: "a3",
    taskId: "t2",
    name: "mockup-feedback.docx",
    size: 1850000,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    url: "/attachments/mockup-feedback.docx",
    uploadedAt: "2023-07-18T09:45:00Z",
  },
];

const TaskAttachments = ({ taskId }: TaskAttachmentsProps) => {
  const [attachments, setAttachments] = useState<Attachment[]>(
    mockAttachments.filter(a => a.taskId === taskId)
  );
  const [isDragging, setIsDragging] = useState(false);
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };
  
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    else if (type.includes("pdf")) return <FileText className="h-4 w-4" />;
    else return <File className="h-4 w-4" />;
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // In a real app, you would upload these files to your server/storage
    // Here we'll just simulate adding them to our local state
    if (e.dataTransfer.files) {
      const newAttachments: Attachment[] = [];
      
      Array.from(e.dataTransfer.files).forEach(file => {
        newAttachments.push({
          id: uuidv4(),
          taskId,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // This is temporary and would be replaced with a real URL in production
          uploadedAt: new Date().toISOString(),
        });
      });
      
      setAttachments([...attachments, ...newAttachments]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments: Attachment[] = [];
      
      Array.from(e.target.files).forEach(file => {
        newAttachments.push({
          id: uuidv4(),
          taskId,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // This is temporary and would be replaced with a real URL in production
          uploadedAt: new Date().toISOString(),
        });
      });
      
      setAttachments([...attachments, ...newAttachments]);
    }
  };
  
  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium flex items-center gap-1">
        <Paperclip className="h-4 w-4" />
        <span>Attachments</span>
      </h3>
      
      <div
        className={`border-2 border-dashed rounded-md p-4 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">Drag and drop files here</p>
        <p className="text-xs text-muted-foreground mb-2">or</p>
        <Input
          type="file"
          className="hidden"
          id="file-upload"
          multiple
          onChange={handleFileInputChange}
        />
        <Button asChild variant="outline" size="sm">
          <label htmlFor="file-upload" className="cursor-pointer">
            Browse Files
          </label>
        </Button>
      </div>
      
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map(attachment => (
            <div key={attachment.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <div className="flex items-center gap-2">
                {getFileIcon(attachment.type)}
                <div>
                  <p className="text-sm font-medium">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive"
                  onClick={() => removeAttachment(attachment.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskAttachments;
