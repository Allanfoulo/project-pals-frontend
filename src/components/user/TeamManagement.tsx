import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserRole } from "./UserProfile";
import { Plus, MoreHorizontal, Mail, UserPlus, UserMinus, Edit, Users, Search } from "lucide-react";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  joinDate: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
}

interface TeamManagementProps {
  teams: Team[];
  onCreateTeam?: (team: Omit<Team, "id" | "createdAt">) => void;
  onUpdateTeam?: (teamId: string, updates: Partial<Team>) => void;
  onDeleteTeam?: (teamId: string) => void;
  onAddMember?: (teamId: string, member: Omit<TeamMember, "id" | "joinDate">) => void;
  onRemoveMember?: (teamId: string, memberId: string) => void;
  onUpdateMember?: (teamId: string, memberId: string, updates: Partial<TeamMember>) => void;
}

const TeamManagement = ({
  teams,
  onCreateTeam,
  onUpdateTeam,
  onDeleteTeam,
  onAddMember,
  onRemoveMember,
  onUpdateMember,
}: TeamManagementProps) => {
  const [activeTeam, setActiveTeam] = useState<Team | null>(teams.length > 0 ? teams[0] : null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newMember, setNewMember] = useState<Omit<TeamMember, "id" | "joinDate">>({ 
    name: "", 
    email: "", 
    role: "member" 
  });
  const [newTeam, setNewTeam] = useState<Omit<Team, "id" | "createdAt">>({ 
    name: "", 
    description: "", 
    members: [] 
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddMember = () => {
    if (!activeTeam || !onAddMember) return;
    
    onAddMember(activeTeam.id, newMember);
    setNewMember({ name: "", email: "", role: "member" });
    setIsAddingMember(false);
    
    toast({
      title: "Team member added",
      description: `${newMember.name} has been added to the team.`,
    });
  };

  const handleCreateTeam = () => {
    if (!onCreateTeam) return;
    
    onCreateTeam(newTeam);
    setNewTeam({ name: "", description: "", members: [] });
    setIsCreatingTeam(false);
    
    toast({
      title: "Team created",
      description: `${newTeam.name} team has been created successfully.`,
    });
  };

  const handleRemoveMember = (memberId: string) => {
    if (!activeTeam || !onRemoveMember) return;
    
    const memberName = activeTeam.members.find(m => m.id === memberId)?.name || "Member";
    
    onRemoveMember(activeTeam.id, memberId);
    
    toast({
      title: "Team member removed",
      description: `${memberName} has been removed from the team.`,
    });
  };

  const handleUpdateMemberRole = (memberId: string, role: UserRole) => {
    if (!activeTeam || !onUpdateMember) return;
    
    onUpdateMember(activeTeam.id, memberId, { role });
    
    toast({
      title: "Role updated",
      description: `Team member's role has been updated to ${role}.`,
    });
  };

  const filteredMembers = activeTeam ? activeTeam.members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "manager": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "member": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "viewer": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Team Management</h2>
        <Dialog open={isCreatingTeam} onOpenChange={setIsCreatingTeam}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a new team and add members to collaborate on projects.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input 
                  id="team-name" 
                  value={newTeam.name} 
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})} 
                  placeholder="Enter team name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description</Label>
                <Input 
                  id="team-description" 
                  value={newTeam.description} 
                  onChange={(e) => setNewTeam({...newTeam, description: e.target.value})} 
                  placeholder="Enter team description" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingTeam(false)}>Cancel</Button>
              <Button onClick={handleCreateTeam} disabled={!newTeam.name}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Teams Yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Create your first team to start collaborating with others.</p>
            <Button onClick={() => setIsCreatingTeam(true)} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Create Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Teams</CardTitle>
              <CardDescription>Select a team to manage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {teams.map((team) => (
                  <div 
                    key={team.id} 
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${activeTeam?.id === team.id ? 'bg-accent' : ''}`}
                    onClick={() => setActiveTeam(team)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 3).map((member, index) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members.length > 3 && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                            +{team.members.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{team.name}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Team
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <UserMinus className="h-4 w-4 mr-2" />
                          Delete Team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            {activeTeam ? (
              <>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{activeTeam.name}</CardTitle>
                    <CardDescription>{activeTeam.description}</CardDescription>
                  </div>
                  <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-1">
                        <UserPlus className="h-4 w-4" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                        <DialogDescription>
                          Add a new member to the {activeTeam.name} team.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input 
                            id="name" 
                            value={newMember.name} 
                            onChange={(e) => setNewMember({...newMember, name: e.target.value})} 
                            placeholder="Enter full name" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={newMember.email} 
                            onChange={(e) => setNewMember({...newMember, email: e.target.value})} 
                            placeholder="Enter email address" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select 
                            value={newMember.role} 
                            onValueChange={(value) => setNewMember({...newMember, role: value as UserRole})}
                          >
                            <SelectTrigger id="role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department (Optional)</Label>
                          <Input 
                            id="department" 
                            value={newMember.department || ""} 
                            onChange={(e) => setNewMember({...newMember, department: e.target.value})} 
                            placeholder="Enter department" 
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingMember(false)}>Cancel</Button>
                        <Button 
                          onClick={handleAddMember} 
                          disabled={!newMember.name || !newMember.email}
                        >
                          Add Member
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search team members..." 
                          className="pl-8" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                              {searchQuery ? "No members match your search" : "No members in this team yet"}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMembers.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-sm text-muted-foreground">{member.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getRoleBadgeColor(member.role)} variant="outline">
                                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{member.department || "-"}</TableCell>
                              <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => window.location.href = `mailto:${member.email}`}>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleUpdateMemberRole(member.id, "admin")}>
                                      Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateMemberRole(member.id, "manager")}>
                                      Manager
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateMemberRole(member.id, "member")}>
                                      Member
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateMemberRole(member.id, "viewer")}>
                                      Viewer
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-destructive" 
                                      onClick={() => handleRemoveMember(member.id)}
                                    >
                                      <UserMinus className="h-4 w-4 mr-2" />
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Select a Team</h3>
                <p className="text-muted-foreground mt-1">Choose a team from the list to view and manage its members.</p>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
