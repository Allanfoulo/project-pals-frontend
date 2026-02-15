import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Define our data types
export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  dueDate?: string;
  status: "active" | "completed" | "onHold";
  progress: number;
  members: string[];
  tasks: Task[];
  workspace: string;
  favorite: boolean;
  color: string;
  tags?: string[];
  milestones?: Milestone[];
};

export type Milestone = {
  id: string;
  title: string;
  date: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "todo" | "inProgress" | "inReview" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  tags: string[];
  subtasks: Subtask[];
  projectId: string;
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Activity = {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  metadata: any;
  createdAt: string;
};

export type Workspace = {
  id: string;
  name: string;
  color: string;
};

// Create the context and provider
interface ProjectContextType {
  projects: Project[];
  workspaces: Workspace[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  addMilestone: (milestone: Partial<Milestone>) => Promise<void>;
  updateMilestone: (id: string, milestone: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  activities: Activity[];
  logActivity: (activity: Partial<Activity>) => Promise<void>;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setProjects([]);
      setWorkspaces([]);
      setActivities([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch workspaces
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*');

      if (workspacesError) throw workspacesError;

      let userWorkspaces = workspacesData || [];

      // Create default workspace if none exists
      if (user && (!workspacesData || workspacesData.length === 0)) {
        const { data: newWorkspace, error: createError } = await supabase
          .from('workspaces')
          .insert([{
            name: `${user.name}'s Workspace`,
            owner_id: user.id,
            color: '#4f46e5'
          }])
          .select()
          .single();

        if (createError) throw createError;
        if (newWorkspace) {
          userWorkspaces = [newWorkspace];
        }
      }

      setWorkspaces(userWorkspaces);

      // Fetch projects with tasks
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*, tasks(*)');

      if (projectsError) throw projectsError;

      // Map to Project type
      const mappedProjects: Project[] = (projectsData || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        createdAt: p.created_at,
        dueDate: p.due_date,
        status: (p.status as "active" | "completed" | "onHold") || "active",
        progress: p.progress || 0,
        members: p.members || [],
        workspace: p.workspace_id,
        favorite: p.favorite || false,
        color: p.color || "#4f46e5",
        tags: p.tags || [],
        milestones: p.milestones || [],
        tasks: (p.tasks || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || "",
          status: (t.status as "backlog" | "todo" | "inProgress" | "inReview" | "done") || "todo",
          priority: (t.priority as "low" | "medium" | "high" | "urgent") || "medium",
          assigneeId: t.assignee_id,
          dueDate: t.due_date,
          createdAt: t.created_at,
          tags: t.tags || [],
          subtasks: t.subtasks || [],
          projectId: t.project_id
        }))
      }));

      setProjects(mappedProjects);

      // Fetch activities
      await fetchActivities();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const mappedActivities: Activity[] = (data || []).map(a => ({
        id: a.id,
        userId: a.user_id,
        action: a.action,
        entityType: a.entity_type,
        entityId: a.entity_id,
        entityName: a.entity_name,
        metadata: a.metadata || {},
        createdAt: a.created_at
      }));

      setActivities(mappedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const logActivity = async (activity: Partial<Activity>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activities')
        .insert([{
          user_id: user.id,
          action: activity.action,
          entity_type: activity.entityType,
          entity_id: activity.entityId,
          entity_name: activity.entityName,
          metadata: activity.metadata || {}
        }]);

      if (error) throw error;
      await fetchActivities();
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const addProject = async (project: Partial<Project>) => {
    if (!user) return;

    try {
      const newProjectData = {
        name: project.name || "New Project",
        description: project.description || "",
        status: project.status || "active",
        workspace_id: project.workspace || workspaces[0]?.id, // Use first available workspace
        color: project.color || "#4f46e5",
        tags: project.tags || [],
        members: project.members || [],
        milestones: project.milestones || [], // JSONB
        owner_id: user.id,
        favorite: project.favorite || false,
        progress: project.progress || 0
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([newProjectData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newProject: Project = {
          id: data.id,
          name: data.name,
          description: data.description || "",
          createdAt: data.created_at,
          dueDate: data.due_date,
          status: data.status,
          progress: data.progress,
          members: data.members || [],
          workspace: data.workspace_id,
          favorite: data.favorite,
          color: data.color,
          tags: data.tags || [],
          milestones: data.milestones || [],
          tasks: []
        };
        setProjects([...projects, newProject]);
        await logActivity({
          action: "created",
          entityType: "project",
          entityId: data.id,
          entityName: data.name
        });
        toast.success("Project created successfully");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  const updateProject = async (id: string, updatedFields: Partial<Project>) => {
    try {
      // Map generic fields to database fields
      const dbUpdates: any = {};
      if (updatedFields.name !== undefined) dbUpdates.name = updatedFields.name;
      if (updatedFields.description !== undefined) dbUpdates.description = updatedFields.description;
      if (updatedFields.status !== undefined) dbUpdates.status = updatedFields.status;
      if (updatedFields.dueDate !== undefined) dbUpdates.due_date = updatedFields.dueDate;
      if (updatedFields.favorite !== undefined) dbUpdates.favorite = updatedFields.favorite;
      if (updatedFields.color !== undefined) dbUpdates.color = updatedFields.color;
      if (updatedFields.progress !== undefined) dbUpdates.progress = updatedFields.progress;
      if (updatedFields.tags !== undefined) dbUpdates.tags = updatedFields.tags;
      if (updatedFields.members !== undefined) dbUpdates.members = updatedFields.members;
      // milestones specific update is handled separately, but general update could rewrite it
      if (updatedFields.milestones !== undefined) dbUpdates.milestones = updatedFields.milestones;

      const { error } = await supabase
        .from('projects')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setProjects(
        projects.map((project) =>
          project.id === id ? { ...project, ...updatedFields } : project
        )
      );

      // Also update current project if it's the one being edited
      if (currentProject && currentProject.id === id) {
        setCurrentProject({ ...currentProject, ...updatedFields });
      }

      await logActivity({
        action: updatedFields.favorite !== undefined ? (updatedFields.favorite ? "favorited" : "unfavorited") : "updated",
        entityType: "project",
        entityId: id,
        entityName: projects.find(p => p.id === id)?.name
      });

      toast.success("Project updated");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.filter((project) => project.id !== id));
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }

      await logActivity({
        action: "deleted",
        entityType: "project",
        entityId: id,
        entityName: projects.find(p => p.id === id)?.name
      });

      toast.success("Project deleted");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const addTask = async (task: Partial<Task>) => {
    if (!task.projectId || !user) return;

    try {
      const newTaskData = {
        project_id: task.projectId,
        title: task.title || "New Task",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        assignee_id: task.assigneeId || user.id, // Assign to self by default
        due_date: task.dueDate,
        tags: task.tags || [],
        subtasks: task.subtasks || [] // JSONB
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTaskData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newTask: Task = {
          id: data.id,
          title: data.title,
          description: data.description || "",
          status: data.status,
          priority: data.priority,
          assigneeId: data.assignee_id,
          dueDate: data.due_date,
          createdAt: data.created_at,
          tags: data.tags || [],
          subtasks: data.subtasks || [],
          projectId: data.project_id
        };

        setProjects(
          projects.map((project) => {
            if (project.id === task.projectId) {
              return {
                ...project,
                tasks: [...project.tasks, newTask],
              };
            }
            return project;
          })
        );

        await logActivity({
          action: "added task",
          entityType: "task",
          entityId: data.id,
          entityName: data.title,
          metadata: { projectId: data.project_id }
        });

        toast.success("Task added");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    try {
      const dbUpdates: any = {};
      if (updatedFields.title !== undefined) dbUpdates.title = updatedFields.title;
      if (updatedFields.description !== undefined) dbUpdates.description = updatedFields.description;
      if (updatedFields.status !== undefined) dbUpdates.status = updatedFields.status;
      if (updatedFields.priority !== undefined) dbUpdates.priority = updatedFields.priority;
      if (updatedFields.dueDate !== undefined) dbUpdates.due_date = updatedFields.dueDate;
      if (updatedFields.assigneeId !== undefined) dbUpdates.assignee_id = updatedFields.assigneeId;
      if (updatedFields.tags !== undefined) dbUpdates.tags = updatedFields.tags;
      if (updatedFields.subtasks !== undefined) dbUpdates.subtasks = updatedFields.subtasks;

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setProjects(
        projects.map((project) => {
          const updatedTasks = project.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedFields } : task
          );
          return {
            ...project,
            tasks: updatedTasks,
          };
        })
      );

      await logActivity({
        action: updatedFields.status === "done" ? "completed task" : "updated task",
        entityType: "task",
        entityId: id,
        entityName: projects.flatMap(p => p.tasks).find(t => t.id === id)?.title
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(
        projects.map((project) => ({
          ...project,
          tasks: project.tasks.filter((task) => task.id !== id),
        }))
      );

      await logActivity({
        action: "deleted task",
        entityType: "task",
        entityId: id
      });

      toast.success("Task deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const toggleFavorite = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    await updateProject(id, { favorite: !project.favorite });
  };

  // Milestones are stored in projects table as JSONB, so we update the project
  const addMilestone = async (milestone: Partial<Milestone>) => {
    if (!milestone.projectId) return;

    const project = projects.find(p => p.id === milestone.projectId);
    if (!project) return;

    const newMilestone: Milestone = {
      id: `m${Date.now()}`, // Generate client-side ID for simplicity inside JSON
      title: milestone.title || "New Milestone",
      date: milestone.date || "",
      completed: milestone.completed || false,
    };

    const updatedMilestones = [...(project.milestones || []), newMilestone];
    await updateProject(project.id, { milestones: updatedMilestones });
  };

  const updateMilestone = async (id: string, updatedFields: Partial<Milestone>) => {
    // Find project containing this milestone
    const project = projects.find(p => p.milestones?.some(m => m.id === id));
    if (!project) return;

    const updatedMilestones = project.milestones?.map(m =>
      m.id === id ? { ...m, ...updatedFields } : m
    );

    await updateProject(project.id, { milestones: updatedMilestones });
  };

  const deleteMilestone = async (id: string) => {
    const project = projects.find(p => p.milestones?.some(m => m.id === id));
    if (!project) return;

    const updatedMilestones = project.milestones?.filter(m => m.id !== id);
    await updateProject(project.id, { milestones: updatedMilestones });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        workspaces,
        currentProject,
        setCurrentProject,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        toggleFavorite,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        activities,
        logActivity,
        isLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
