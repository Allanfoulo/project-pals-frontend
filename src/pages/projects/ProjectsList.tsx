
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Star,
  StarOff,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";

const ProjectsList = () => {
  const { projects, workspaces, toggleFavorite } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [workspaceFilter, setWorkspaceFilter] = useState<string | null>(null);

  // Filter projects based on search query and filters
  const filteredProjects = projects.filter((project) => {
    const matchesQuery = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    const matchesWorkspace =
      !workspaceFilter || project.workspace === workspaceFilter;
    return matchesQuery && matchesStatus && matchesWorkspace;
  });

  // Sort projects by those with due dates first, then by due date
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    // First, sort by favorite status
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    
    // Then, sort by due date (if both have due dates)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Projects with due dates come before projects without due dates
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // If neither has a due date, sort by creation date (newest first)
    return (
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            {projects.length} project{projects.length !== 1 && "s"} in total
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              {["active", "completed", "onHold"].map((status) => (
                <DropdownMenuItem
                  key={status}
                  className="cursor-pointer"
                  onClick={() =>
                    setStatusFilter(
                      statusFilter === status ? null : status
                    )
                  }
                >
                  <span
                    className={`h-2 w-2 rounded-full mr-2 ${
                      status === "active"
                        ? "bg-green-500"
                        : status === "completed"
                        ? "bg-blue-500"
                        : "bg-amber-500"
                    }`}
                  />
                  <span className="capitalize">{status}</span>
                  {statusFilter === status && (
                    <CheckCircle2 className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Filter by workspace</DropdownMenuLabel>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  className="cursor-pointer"
                  onClick={() =>
                    setWorkspaceFilter(
                      workspaceFilter === workspace.id ? null : workspace.id
                    )
                  }
                >
                  <span
                    className="h-2 w-2 rounded-full mr-2"
                    style={{ backgroundColor: workspace.color }}
                  />
                  {workspace.name}
                  {workspaceFilter === workspace.id && (
                    <CheckCircle2 className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setStatusFilter(null);
                  setWorkspaceFilter(null);
                }}
              >
                Clear all filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                Date created (newest)
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Date created (oldest)
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Due date (soonest)
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Progress (high-low)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.map((project) => {
          const workspace = workspaces.find(
            (w) => w.id === project.workspace
          );
          const completedTasks = project.tasks.filter(
            (task) => task.status === "done"
          ).length;
          const totalTasks = project.tasks.length;

          return (
            <Card key={project.id} className="glass-card overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {workspace && (
                      <Badge
                        className="text-xs"
                        style={{
                          backgroundColor: workspace.color,
                          color: "white",
                        }}
                      >
                        {workspace.name}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        project.status === "active"
                          ? "text-green-500 border-green-200"
                          : project.status === "completed"
                          ? "text-blue-500 border-blue-200"
                          : "text-amber-500 border-amber-200"
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold group">
                    <Link
                      to={`/projects/${project.id}`}
                      className="hover:text-primary/80 transition-colors"
                    >
                      {project.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {project.description}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(project.id);
                    }}
                    className="text-muted-foreground hover:text-amber-400 transition-colors"
                  >
                    {project.favorite ? (
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ) : (
                      <StarOff className="h-5 w-5" />
                    )}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Link
                          to={`/projects/${project.id}`}
                          className="flex items-center w-full"
                        >
                          View project
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit project
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Duplicate project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-500">
                        Delete project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-col gap-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span>
                        {project.dueDate
                          ? format(new Date(project.dueDate), "MMM d, yyyy")
                          : "No due date"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />
                      <span>
                        {completedTasks}/{totalTasks} tasks
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <div className="w-full flex justify-between items-center mt-1">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((memberId, index) => (
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
                    {project.members.length > 4 && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-xs font-medium">
                        +{project.members.length - 4}
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/projects/${project.id}`} className="gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {sortedProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No projects found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery || statusFilter || workspaceFilter
              ? "Try adjusting your search or filters"
              : "Create your first project to get started"}
          </p>
          <Button className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
