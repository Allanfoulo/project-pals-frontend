import { useState, useEffect } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Filter, Search as SearchIcon, X } from "lucide-react";

interface ProjectSearchProps {
  onFilterChange: (projects: any[]) => void;
  className?: string;
}

const ProjectSearch = ({ onFilterChange, className }: ProjectSearchProps) => {
  const { projects, workspaces } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [workspaceFilter, setWorkspaceFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  
  // Get all unique tags from projects
  const allTags = Array.from(new Set(
    projects
      .filter(project => project.tags && project.tags.length > 0)
      .flatMap(project => project.tags || [])
  ));
  
  // Apply filters
  useEffect(() => {
    const filteredProjects = projects.filter((project) => {
      // Search query filter
      const matchesQuery = project.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = !statusFilter || project.status === statusFilter;
      
      // Workspace filter
      const matchesWorkspace = !workspaceFilter || project.workspace === workspaceFilter;
      
      // Tag filter
      const matchesTag = !tagFilter || (project.tags && project.tags.includes(tagFilter));
      
      // Priority filter - check if any task has the selected priority
      const matchesPriority = !priorityFilter || 
        project.tasks.some(task => task.priority === priorityFilter);
      
      return matchesQuery && matchesStatus && matchesWorkspace && matchesTag && matchesPriority;
    });
    
    onFilterChange(filteredProjects);
  }, [searchQuery, statusFilter, workspaceFilter, tagFilter, priorityFilter, projects, onFilterChange]);
  
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setWorkspaceFilter(null);
    setTagFilter(null);
    setPriorityFilter(null);
  };
  
  const hasActiveFilters = statusFilter || workspaceFilter || tagFilter || priorityFilter || searchQuery;
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 px-1">
                  {[statusFilter, workspaceFilter, tagFilter, priorityFilter].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            {["active", "completed", "onHold"].map((status) => (
              <DropdownMenuItem
                key={status}
                className="cursor-pointer"
                onClick={() =>
                  setStatusFilter(statusFilter === status ? null : status)
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

            {allTags.length > 0 && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
                {allTags.map((tag) => (
                  <DropdownMenuItem
                    key={tag}
                    className="cursor-pointer"
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                  >
                    <span className="mr-2">#</span>
                    {tag}
                    {tagFilter === tag && (
                      <CheckCircle2 className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
            {["urgent", "high", "medium", "low"].map((priority) => (
              <DropdownMenuItem
                key={priority}
                className="cursor-pointer"
                onClick={() =>
                  setPriorityFilter(priorityFilter === priority ? null : priority)
                }
              >
                <span
                  className={`h-2 w-2 rounded-full mr-2 ${
                    priority === "urgent"
                      ? "bg-purple-500"
                      : priority === "high"
                      ? "bg-red-500"
                      : priority === "medium"
                      ? "bg-amber-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="capitalize">{priority}</span>
                {priorityFilter === priority && (
                  <CheckCircle2 className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Clear all filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {statusFilter && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: <span className="capitalize">{statusFilter}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => setStatusFilter(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {workspaceFilter && (
            <Badge variant="outline" className="flex items-center gap-1">
              Workspace: {workspaces.find(w => w.id === workspaceFilter)?.name}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => setWorkspaceFilter(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {tagFilter && (
            <Badge variant="outline" className="flex items-center gap-1">
              Tag: {tagFilter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => setTagFilter(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {priorityFilter && (
            <Badge variant="outline" className="flex items-center gap-1">
              Priority: <span className="capitalize">{priorityFilter}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => setPriorityFilter(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(statusFilter || workspaceFilter || tagFilter || priorityFilter) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs" 
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectSearch;
