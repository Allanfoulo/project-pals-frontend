
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/contexts/ProjectContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import BoardView from "@/components/projects/BoardView";
import {
  Calendar,
  LayoutGrid,
  List,
  MoreHorizontal,
  PenLine,
  Star,
  StarOff,
  Trash2,
  Users,
} from "lucide-react";
import { format } from "date-fns";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    projects,
    workspaces,
    updateProject,
    deleteProject,
    toggleFavorite,
  } = useProjects();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("board");

  if (!projectId) {
    return <div>Project ID is missing</div>;
  }

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="text-muted-foreground mt-2">
            The project you're looking for doesn't exist or has been deleted.
          </p>
          <Button
            onClick={() => navigate("/projects")}
            className="mt-4"
            variant="outline"
          >
            View all projects
          </Button>
        </div>
      </div>
    );
  }

  const workspace = workspaces.find((w) => w.id === project.workspace);

  const handleDelete = () => {
    deleteProject(project.id);
    toast({
      title: "Project deleted",
      description: `"${project.name}" has been deleted`,
    });
    navigate("/projects");
  };

  const statusCounts = {
    backlog: project.tasks.filter((t) => t.status === "backlog").length,
    todo: project.tasks.filter((t) => t.status === "todo").length,
    inProgress: project.tasks.filter((t) => t.status === "inProgress").length,
    inReview: project.tasks.filter((t) => t.status === "inReview").length,
    done: project.tasks.filter((t) => t.status === "done").length,
  };

  const totalTasks = project.tasks.length;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <button
            onClick={() => toggleFavorite(project.id)}
            className="text-muted-foreground hover:text-amber-400 transition-colors"
          >
            {project.favorite ? (
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            ) : (
              <StarOff className="h-5 w-5" />
            )}
          </button>
          {workspace && (
            <Badge
              className="text-xs"
              style={{ backgroundColor: workspace.color, color: "white" }}
            >
              {workspace.name}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((memberId, index) => (
              <Avatar key={index} className="border-2 border-background h-8 w-8">
                <AvatarImage
                  src={`https://i.pravatar.cc/150?u=${memberId}`}
                  alt={`Team member ${index + 1}`}
                />
                <AvatarFallback>
                  {memberId.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-xs font-medium">
                +{project.members.length - 3}
              </div>
            )}
          </div>

          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Team
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <PenLine className="mr-2 h-4 w-4" />
                Edit project
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => toggleFavorite(project.id)}
              >
                {project.favorite ? (
                  <>
                    <StarOff className="mr-2 h-4 w-4" />
                    Remove from favorites
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Add to favorites
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Progress</p>
          <div className="mt-1 flex items-center">
            <span className="text-2xl font-bold">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2 mt-2" />
        </div>

        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Tasks</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-2xl font-bold">{totalTasks}</span>
            <div className="text-sm">
              <span className="text-green-500">{statusCounts.done}</span> /{" "}
              {totalTasks}
            </div>
          </div>
          <div className="h-2 mt-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${
                  totalTasks > 0
                    ? (statusCounts.done / totalTasks) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Due Date</p>
          <div className="mt-1 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-lg font-bold">
              {project.dueDate
                ? format(new Date(project.dueDate), "MMM d, yyyy")
                : "No due date"}
            </span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Status</p>
          <div className="mt-1 flex items-center">
            <span className="text-lg font-bold capitalize">
              {project.status}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="border-b px-6 py-3">
            <TabsList className="grid w-max grid-cols-3">
              <TabsTrigger value="board" className="flex items-center px-4">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Board
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center px-4">
                <List className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center px-4">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <TabsContent value="board" className="h-full">
              <BoardView projectId={project.id} />
            </TabsContent>
            <TabsContent value="list">List view content</TabsContent>
            <TabsContent value="calendar">Calendar view content</TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;
