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
    tags: ["design", "website", "ui/ux"],
    milestones: [
      {
        id: "m1",
        title: "Wireframes Approval",
        date: "2023-07-15T00:00:00Z",
        completed: true,
      },
      {
        id: "m2",
        title: "Design System Complete",
        date: "2023-08-01T00:00:00Z",
        completed: true,
      },
      {
        id: "m3",
        title: "Frontend Implementation",
        date: "2023-08-30T00:00:00Z",
        completed: false,
      },
      {
        id: "m4",
        title: "User Testing",
        date: "2023-09-10T00:00:00Z",
        completed: false,
      },
    ],
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
    tags: ["marketing", "campaign", "q3"],
    milestones: [
      {
        id: "m5",
        title: "Campaign Strategy Approval",
        date: "2023-07-15T00:00:00Z",
        completed: true,
      },
      {
        id: "m6",
        title: "Content Creation Complete",
        date: "2023-08-15T00:00:00Z",
        completed: false,
      },
      {
        id: "m7",
        title: "Campaign Launch",
        date: "2023-09-01T00:00:00Z",
        completed: false,
      },
    ],
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
    tags: ["mobile", "development", "ios", "android"],
    milestones: [
      {
        id: "m8",
        title: "Requirements Gathering",
        date: "2023-06-01T00:00:00Z",
        completed: true,
      },
      {
        id: "m9",
        title: "UI/UX Design Complete",
        date: "2023-07-15T00:00:00Z",
        completed: true,
      },
      {
        id: "m10",
        title: "Alpha Release",
        date: "2023-09-15T00:00:00Z",
        completed: false,
      },
      {
        id: "m11",
        title: "Beta Testing",
        date: "2023-10-15T00:00:00Z",
        completed: false,
      },
      {
        id: "m12",
        title: "App Store Submission",
        date: "2023-11-15T00:00:00Z",
        completed: false,
      },
    ],
    tasks: [
      {
        id: "t7",
        title: "Requirements gathering",
        description: "Define app requirements and user stories",
        status: "done",
        priority: "high",
        assigneeId: "user-5",
        dueDate: "2023-06-01T00:00:00Z",
        createdAt: "2023-05-15T09:30:00Z",
        tags: ["planning", "requirements"],
        subtasks: [
          { id: "st18", title: "User interviews", completed: true },
          { id: "st19", title: "Feature prioritization", completed: true },
        ],
        projectId: "p3",
      },
      {
        id: "t8",
        title: "UI/UX Design",
        description: "Create app wireframes and high-fidelity designs",
        status: "done",
        priority: "high",
        assigneeId: "user-2",
        dueDate: "2023-07-15T00:00:00Z",
        createdAt: "2023-06-05T14:20:00Z",
        tags: ["design", "ui", "ux"],
        subtasks: [
          { id: "st20", title: "Wireframes", completed: true },
          { id: "st21", title: "UI design", completed: true },
          { id: "st22", title: "Prototyping", completed: true },
        ],
        projectId: "p3",
      },
      {
        id: "t9",
        title: "iOS Development",
        description: "Develop the iOS version of the app",
        status: "inProgress",
        priority: "high",
        assigneeId: "user-3",
        dueDate: "2023-09-15T00:00:00Z",
        createdAt: "2023-07-20T11:00:00Z",
        tags: ["development", "ios", "swift"],
        subtasks: [
          { id: "st23", title: "Set up project", completed: true },
          { id: "st24", title: "Implement core features", completed: false },
          { id: "st25", title: "Integrate APIs", completed: false },
        ],
        projectId: "p3",
      },
      {
        id: "t10",
        title: "Android Development",
        description: "Develop the Android version of the app",
        status: "inProgress",
        priority: "high",
        assigneeId: "user-6",
        dueDate: "2023-09-15T00:00:00Z",
        createdAt: "2023-07-20T11:30:00Z",
        tags: ["development", "android", "kotlin"],
        subtasks: [
          { id: "st26", title: "Set up project", completed: true },
          { id: "st27", title: "Implement core features", completed: false },
          { id: "st28", title: "Integrate APIs", completed: false },
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
  addMilestone: (milestone: Partial<Milestone>) => void;
  updateMilestone: (id: string, milestone: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
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
      tags: project.tags || [],
      milestones: project.milestones || [],
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

  const addMilestone = (milestone: Partial<Milestone>) => {
    if (!milestone.projectId) return;

    const newMilestone: Milestone = {
      id: `m${Math.floor(Math.random() * 1000)}`,
      title: milestone.title || "New Milestone",
      date: milestone.date || "",
      completed: milestone.completed || false,
    };

    setProjects(
      projects.map((project) => {
        if (project.id === milestone.projectId) {
          return {
            ...project,
            milestones: [...project.milestones, newMilestone],
          };
        }
        return project;
      })
    );
  };

  const updateMilestone = (id: string, updatedFields: Partial<Milestone>) => {
    setProjects(
      projects.map((project) => {
        const updatedMilestones = project.milestones.map((milestone) =>
          milestone.id === id ? { ...milestone, ...updatedFields } : milestone
        );
        return {
          ...project,
          milestones: updatedMilestones,
        };
      })
    );
  };

  const deleteMilestone = (id: string) => {
    setProjects(
      projects.map((project) => ({
        ...project,
        milestones: project.milestones.filter((milestone) => milestone.id !== id),
      }))
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
        addMilestone,
        updateMilestone,
        deleteMilestone,
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
