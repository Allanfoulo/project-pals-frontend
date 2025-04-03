
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Mail,
  Phone,
  PlusCircle,
  Briefcase,
  User as UserIcon,
  Users as UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamManagement } from "@/components/user";
import { UserRole } from "@/components/user/UserProfile";

// Mock team members data
const teamMembers = [
  {
    id: "user-1",
    name: "Alex Johnson",
    role: "Product Manager",
    email: "alex@example.com",
    phone: "(555) 123-4567",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    department: "Product",
    projects: ["Website Redesign", "Mobile App Development"],
  },
  {
    id: "user-2",
    name: "Sarah Wilson",
    role: "UI/UX Designer",
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    department: "Design",
    projects: ["Website Redesign"],
  },
  {
    id: "user-3",
    name: "Michael Brown",
    role: "Frontend Developer",
    email: "michael@example.com",
    phone: "(555) 345-6789",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    department: "Engineering",
    projects: ["Website Redesign", "Mobile App Development"],
  },
  {
    id: "user-4",
    name: "Emily Davis",
    role: "Marketing Specialist",
    email: "emily@example.com",
    phone: "(555) 456-7890",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    department: "Marketing",
    projects: ["Q3 Marketing Campaign"],
  },
  {
    id: "user-5",
    name: "David Lee",
    role: "Backend Developer",
    email: "david@example.com",
    phone: "(555) 567-8901",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    department: "Engineering",
    projects: ["Mobile App Development"],
  },
  {
    id: "user-6",
    name: "Jessica Clark",
    role: "iOS Developer",
    email: "jessica@example.com",
    phone: "(555) 678-9012",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
    department: "Engineering",
    projects: ["Mobile App Development"],
  },
  {
    id: "user-7",
    name: "Chris Williams",
    role: "Android Developer",
    email: "chris@example.com",
    phone: "(555) 789-0123",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
    department: "Engineering",
    projects: ["Mobile App Development"],
  },
  {
    id: "user-8",
    name: "Rachel Green",
    role: "QA Engineer",
    email: "rachel@example.com",
    phone: "(555) 890-1234",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    department: "Engineering",
    projects: ["Website Redesign", "Mobile App Development"],
  },
];

// Mock departments
const departments = [
  { id: "dep-1", name: "Engineering", members: 5 },
  { id: "dep-2", name: "Design", members: 1 },
  { id: "dep-3", name: "Product", members: 1 },
  { id: "dep-4", name: "Marketing", members: 1 },
];

// Mock teams data for TeamManagement component
const mockTeams = [
  {
    id: "team-1",
    name: "Engineering Team",
    description: "Frontend and backend development team",
    members: teamMembers.filter(m => m.department === "Engineering").map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      avatar: m.avatarUrl,
      role: (m.role.includes("Manager") ? "manager" : (m.role.includes("Developer") || m.role.includes("Engineer") ? "member" : (m.role.includes("Designer") ? "member" : "viewer"))) as UserRole,
      department: m.department,
      joinDate: "2023-01-15"
    })),
    createdAt: "2023-01-01"
  },
  {
    id: "team-2",
    name: "Design Team",
    description: "UI/UX and graphic design team",
    members: teamMembers.filter(m => m.department === "Design").map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      avatar: m.avatarUrl,
      role: (m.role.includes("Manager") ? "manager" : (m.role.includes("Developer") || m.role.includes("Engineer") ? "member" : (m.role.includes("Designer") ? "member" : "viewer"))) as UserRole,
      department: m.department,
      joinDate: "2023-02-10"
    })),
    createdAt: "2023-02-01"
  },
  {
    id: "team-3",
    name: "Marketing Team",
    description: "Marketing and communications team",
    members: teamMembers.filter(m => m.department === "Marketing").map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      avatar: m.avatarUrl,
      role: (m.role.includes("Manager") ? "manager" : (m.role.includes("Developer") || m.role.includes("Engineer") ? "member" : (m.role.includes("Designer") ? "member" : "viewer"))) as UserRole,
      department: m.department,
      joinDate: "2023-03-05"
    })),
    createdAt: "2023-03-01"
  }
];

const Team = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [activeTab, setActiveTab] = useState("members");

  // Filter team members based on search and department
  const filteredMembers = teamMembers.filter((member) => {
    // Filter by department
    if (department !== "all" && member.department !== department) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !member.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !member.role.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <div className="flex items-center gap-2">
          {activeTab === "members" && (
            <>
              <div className="relative w-full sm:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search team members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="management">Team Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-4">


          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">All Members</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-2xl font-bold">{teamMembers.length}</div>
              </CardContent>
            </Card>
            {departments.map((dept) => (
              <Card key={dept.id}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-2xl font-bold">{dept.members}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="all" onValueChange={setDepartment}>
            <TabsList>
              <TabsTrigger value="all">All Members</TabsTrigger>
              {departments.map((dept) => (
                <TabsTrigger key={dept.id} value={dept.name}>
                  {dept.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMembers.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </TabsContent>
            {departments.map((dept) => (
              <TabsContent key={dept.id} value={dept.name} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredMembers
                    .filter((member) => member.department === dept.name)
                    .map((member) => (
                      <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
        
        <TabsContent value="management">
          <TeamManagement 
            teams={mockTeams}
            onCreateTeam={(team) => console.log('Create team:', team)}
            onUpdateTeam={(teamId, updates) => console.log('Update team:', teamId, updates)}
            onDeleteTeam={(teamId) => console.log('Delete team:', teamId)}
            onAddMember={(teamId, member) => console.log('Add member:', teamId, member)}
            onRemoveMember={(teamId, memberId) => console.log('Remove member:', teamId, memberId)}
            onUpdateMember={(teamId, memberId, updates) => console.log('Update member:', teamId, memberId, updates)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TeamMemberCard = ({ member }: { member: any }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={member.avatarUrl} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-lg font-medium">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{member.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{member.department}</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Projects:</p>
            <div className="flex flex-wrap gap-1">
              {member.projects.map((project: string) => (
                <Badge key={project} variant="secondary">
                  {project}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Team;
