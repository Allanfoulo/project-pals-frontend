import { CalendarIntegration, FileStorageIntegration, CommunicationIntegration, ApiIntegration, EmailIntegration, N8nIntegration } from "@/components/integrations";
import { Separator } from "@/components/ui/separator";

const Integrations = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect your favorite tools and services to enhance your workflow.
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-8">
        <N8nIntegration />
        <CalendarIntegration />
        <FileStorageIntegration />
        <CommunicationIntegration />
        <EmailIntegration />
        <ApiIntegration />
      </div>
    </div>
  );
};

export default Integrations;
