
import { createContext, useContext, useState, ReactNode } from "react";

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

export type Workspace = {
  id: string;
  name: string;
  color: string;
};

// Create mock data for our projects
const mockWorkspaces: Workspace[] = [
  { id: "w1", name: "Marketing", color: "#4f46e5" },
  { id: "w2", name: "Product", color: "#0ea5e9" },
  { id: "w3", name: "Design", color: "#8b5cf6" },
  { id: "w4", name: "Engineering", color: "#f97316" },
];

const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Website Redesign",
    description: "Redesign the company website with a modern look and improved UX",
    createdAt: "2023-07-01T09:00:00Z",
    dueDate: "2023-09-15T00:00:00Z",
    status: "active",
    progress: 65,
    members: ["user-1", "user-2", "user-3"],
    workspace: "w3",
    favorite: true,
    color: "#8b5cf6",
    tasks: [
      {
        id: "t1",
        title: "Create wireframes",
        description: "Design initial wireframes for homepage and product pages",
        status: "done",
        priority: "high",
        assigneeId: "user-1",
        dueDate: "2023-07-15T00:00:00Z",
        createdAt: "2023-07-02T10:30:00Z",
        tags: ["design", "wireframe"],
        subtasks: [
          { id: "st1", title: "Homepage wireframe", completed: true },
          { id: "st2", title: "Product page wireframe", completed: true },
          { id: "st3", title: "Contact page wireframe", completed: true },
        ],
        projectId: "p1",
      },
      {
        id: "t2",
        title: "Design high-fidelity mockups",
        description: "Create detailed mockups based on approved wireframes",
        status: "inProgress",
        priority: "high",
        assigneeId: "user-2",
        dueDate: "2023-08-10T00:00:00Z",
        createdAt: "2023-07-16T09:15:00Z",
        tags: ["design", "ui"],
        subtasks: [
          { id: "st4", title: "Homepage mockup", completed: true },
          { id: "st5", title: "Product page mockup", completed: false },
          { id: "st6", title: "Contact page mockup", completed: false },
        ],
        projectId: "p1",
      },
      {
        id: "t3",
        title: "Implement frontend",
        description: "Convert designs to responsive HTML/CSS/JS",
        status: "todo",
        priority: "medium",
        assigneeId: "user-3",
        dueDate: "2023-08-30T00:00:00Z",
        createdAt: "2023-07-17T14:45:00Z",
        tags: ["development", "frontend"],
        subtasks: [
          { id: "st7", title: "Set up project structure", completed: false },
          { id: "st8", title: "Implement homepage", completed: false },
          { id: "st9", title: "Implement product pages", completed: false },
        ],
        projectId: "p1",
      },
    ],
  },
  {
    id: "p2",
    name: "Q3 Marketing Campaign",
    description: "Plan and execute marketing campaign for Q3 product launch",
    createdAt: "2023-06-15T11:20:00Z",
    dueDate: "2023-09-30T00:00:00Z",
    status: "active",
    progress: 35,
    members: ["user-1", "user-4"],
    workspace: "w1",
    favorite: false,
    color: "#4f46e5",
    tasks: [
      {
        id: "t4",
        title: "Market research",
        description: "Conduct market analysis and identify target audience",
        status: "done",
        priority: "high",
        assigneeId: "user-4",
        dueDate: "2023-06-30T00:00:00Z",
        createdAt: "2023-06-16T08:30:00Z",
        tags: ["research", "marketing"],
        subtasks: [
          { id: "st10", title: "Competitor analysis", completed: true },
          { id: "st11", title: "Target audience identification", completed: true },
        ],
        projectId: "p2",
      },
      {
        id: "t5",
        title: "Create campaign strategy",
        description: "Develop comprehensive marketing strategy and messaging",
        status: "inProgress",
        priority: "high",
        assigneeId: "user-1",
        dueDate: "2023-07-31T00:00:00Z",
        createdAt: "2023-07-01T10:15:00Z",
        tags: ["strategy", "marketing"],
        subtasks: [
          { id: "st12", title: "Define key messages", completed: true },
          { id: "st13", title: "Select marketing channels", completed: true },
          { id: "st14", title: "Create content calendar", completed: false },
        ],
        projectId: "p2",
      },
      {
        id: "t6",
        title: "Design campaign assets",
        description: "Create visual assets for various marketing channels",
        status: "todo",
        priority: "medium",
        assigneeId: "user-2",
        dueDate: "2023-08-15T00:00:00Z",
        createdAt: "2023-07-05T15:45:00Z",
        tags: ["design", "marketing"],
        subtasks: [
          { id: "st15", title: "Social media graphics", completed: false },
          { id: "st16", title: "Email templates", completed: false },
          { id: "st17", title: "Web banners", completed: false },
        ],
        projectId: "p2",
      },
    ],
  },
  {
    id: "p3",
    name: "Mobile App Development",
    description: "Develop iOS and Android app for our main product",
    createdAt: "2023-05-10T13:00:00Z",
    dueDate: "2023-11-30T00:00:00Z",
    status: "active",
    progress: 25,
    members: ["user-3", "user-5", "user-6"],
    workspace: "w4",
    favorite: true,
    color: "#f97316",
    tasks: [
      {
        id: "t7",
        title: "Requirements gathering",
        description: "Define app features and technical requirements",
        status: "done",
        priority: "high",
        assigneeId: "user-5",
        dueDate: "2023-05-31T00:00:00Z",
        createdAt: "2023-05-12T09:20:00Z",
        tags: ["planning", "requirements"],
        subtasks: [
          { id: "st18", title: "Stakeholder interviews", completed: true },
          { id: "st19", title: "Feature prioritization", completed: true },
          { id: "st20", title: "Technical specifications", completed: true },
        ],
        projectId: "p3",
      },
      {
        id: "t8",
        title: "UI/UX Design",
        description: "Design user interface and experience for the mobile app",
        status: "inProgress",
        priority: "high",
        assigneeId: "user-2",
        dueDate: "2023-07-15T00:00:00Z",
        createdAt: "2023-06-01T10:30:00Z",
        tags: ["design", "ui", "ux"],
        subtasks: [
          { id: "st21", title: "User flow diagrams", completed: true },
          { id: "st22", title: "UI wireframes", completed: true },
          { id: "st23", title: "Interactive prototypes", completed: false },
        ],
        projectId: "p3",
      },
      {
        id: "t9",
        title: "iOS Development",
        description: "Develop native iOS app using Swift",
        status: "todo",
        priority: "medium",
        assigneeId: "user-6",
        dueDate: "2023-09-30T00:00:00Z",
        createdAt: "2023-06-15T13:45:00Z",
        tags: ["development", "ios", "swift"],
        subtasks: [
          { id: "st24", title: "Set up project architecture", completed: false },
          { id: "st25", title: "Implement core features", completed: false },
          { id: "st26", title: "Integrate APIs", completed: false },
        ],
        projectId: "p3",
      },
      {
        id: "t10",
        title: "Android Development",
        description: "Develop native Android app using Kotlin",
        status: "backlog",
        priority: "medium",
        assigneeId: "user-3",
        dueDate: "2023-10-31T00:00:00Z",
        createdAt: "2023-06-15T14:30:00Z",
        tags: ["development", "android", "kotlin"],
        subtasks: [
          { id: "st27", title: "Set up project architecture", completed: false },
          { id: "st28", title: "Implement core features", completed: false },
          { id: "st29", title: "Integrate APIs", completed: false },
        ],
        projectId: "p3",
      },
    ],
  },
];

// Create the context and provider
interface ProjectContextType {
  projects: Project[];
  workspaces: Workspace[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Partial<Project>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Partial<Task>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const addProject = (project: Partial<Project>) => {
    const newProject: Project = {
      id: `p${projects.length + 1}`,
      name: project.name || "New Project",
      description: project.description || "",
      createdAt: new Date().toISOString(),
      status: project.status || "active",
      progress: project.progress || 0,
      members: project.members || [],
      tasks: project.tasks || [],
      workspace: project.workspace || workspaces[0].id,
      favorite: project.favorite || false,
      color: project.color || "#4f46e5",
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, ...updatedFields } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  };

  const addTask = (task: Partial<Task>) => {
    if (!task.projectId) return;

    const newTask: Task = {
      id: `t${Math.floor(Math.random() * 1000)}`,
      title: task.title || "New Task",
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "medium",
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      createdAt: new Date().toISOString(),
      tags: task.tags || [],
      subtasks: task.subtasks || [],
      projectId: task.projectId,
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
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
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
  };

  const deleteTask = (id: string) => {
    setProjects(
      projects.map((project) => ({
        ...project,
        tasks: project.tasks.filter((task) => task.id !== id),
      }))
    );
  };

  const toggleFavorite = (id: string) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, favorite: !project.favorite }
          : project
      )
    );
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
