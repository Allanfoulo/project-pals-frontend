
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  UserRound, 
  Mail, 
  Briefcase, 
  Calendar, 
  Save,
  Lock
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    avatar: user?.avatarUrl || "",
    bio: "Product manager with 5+ years of experience in SaaS products.",
    location: "San Francisco, CA",
    joinDate: "January 2022",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // This would normally update the user profile in a real backend
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              View and manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.avatar} alt={formData.name} />
              <AvatarFallback>{formData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-medium text-lg">{formData.name}</h3>
              <p className="text-sm text-muted-foreground">{formData.role}</p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{formData.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{formData.role}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Joined {formData.joinDate}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast.info("Password reset instructions sent to your email")}
            >
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name"
                      name="name"
                      className="pl-10" 
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      className="pl-10" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Job Title</Label>
                  <Input 
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Image URL</Label>
                <Input 
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
