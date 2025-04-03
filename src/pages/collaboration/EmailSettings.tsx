import { CollaborationEmailSettings } from "@/components/collaboration";
import { PageHeader } from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";
import { Mail, Bell } from "lucide-react";

const EmailSettingsPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        heading="Email Notification Settings"
        description="Configure email notifications for collaboration features"
        icon={<Mail className="h-6 w-6" />}
      />
      <Separator />
      
      <div className="grid grid-cols-1 gap-6">
        <CollaborationEmailSettings />
      </div>
    </div>
  );
};

export default EmailSettingsPage;
