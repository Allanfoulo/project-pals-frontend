import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Download, FileText, FileSpreadsheet } from "lucide-react";

interface ReportExportProps {
  projectId: string;
  className?: string;
}

type ReportType = "tasks" | "progress" | "timeTracking" | "workload" | "performance";

const ReportExport = ({ projectId, className }: ReportExportProps) => {
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const [reportType, setReportType] = useState<ReportType>("tasks");
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  
  if (!project) return null;
  
  const handleExport = () => {
    if (exportFormat === "csv") {
      exportToCSV();
    } else {
      exportToPDF();
    }
  };
  
  const exportToCSV = () => {
    let csvContent = "";
    let filename = "";
    
    switch (reportType) {
      case "tasks":
        // Generate CSV header
        csvContent = "ID,Title,Description,Status,Priority,Due Date,Assigned To\n";
        
        // Generate CSV rows
        project.tasks.forEach(task => {
          csvContent += `"${task.id}","${task.title}","${task.description || ''}","${task.status}","${task.priority}","${task.dueDate || ''}","${task.assigneeId || ''}"\n`;
        });
        
        filename = `${project.name}-tasks-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
        
      case "progress":
        // Generate progress report CSV
        csvContent = "Status,Count,Percentage\n";
        
        const statusCounts = {
          backlog: project.tasks.filter(task => task.status === "backlog").length,
          todo: project.tasks.filter(task => task.status === "todo").length,
          inProgress: project.tasks.filter(task => task.status === "inProgress").length,
          inReview: project.tasks.filter(task => task.status === "inReview").length,
          done: project.tasks.filter(task => task.status === "done").length
        };
        
        const totalTasks = project.tasks.length;
        
        csvContent += `"Backlog",${statusCounts.backlog},${totalTasks > 0 ? ((statusCounts.backlog / totalTasks) * 100).toFixed(2) : 0}%\n`;
        csvContent += `"To Do",${statusCounts.todo},${totalTasks > 0 ? ((statusCounts.todo / totalTasks) * 100).toFixed(2) : 0}%\n`;
        csvContent += `"In Progress",${statusCounts.inProgress},${totalTasks > 0 ? ((statusCounts.inProgress / totalTasks) * 100).toFixed(2) : 0}%\n`;
        csvContent += `"In Review",${statusCounts.inReview},${totalTasks > 0 ? ((statusCounts.inReview / totalTasks) * 100).toFixed(2) : 0}%\n`;
        csvContent += `"Done",${statusCounts.done},${totalTasks > 0 ? ((statusCounts.done / totalTasks) * 100).toFixed(2) : 0}%\n`;
        
        filename = `${project.name}-progress-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
        
      case "timeTracking":
        // Generate time tracking report CSV (with simulated data)
        csvContent = "Task,Status,Time Spent (hours)\n";
        
        project.tasks.forEach(task => {
          // Simulate time spent for demo purposes
          const timeSpent = (Math.random() * 10).toFixed(2);
          csvContent += `"${task.title}","${task.status}",${timeSpent}\n`;
        });
        
        filename = `${project.name}-time-tracking-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
        
      case "workload":
        // Generate workload report CSV (with simulated data)
        csvContent = "Team Member,Task Count,High Priority Tasks,Tasks Due Soon\n";
        
        // Simulate team members and workload
        const teamMembers = [
          { name: "Alice Smith", taskCount: 5, highPriority: 2, dueSoon: 1 },
          { name: "Bob Johnson", taskCount: 4, highPriority: 1, dueSoon: 2 },
          { name: "Carol Williams", taskCount: 6, highPriority: 3, dueSoon: 0 },
          { name: "David Brown", taskCount: 3, highPriority: 0, dueSoon: 1 },
          { name: "Eva Davis", taskCount: 7, highPriority: 2, dueSoon: 3 }
        ];
        
        teamMembers.forEach(member => {
          csvContent += `"${member.name}",${member.taskCount},${member.highPriority},${member.dueSoon}\n`;
        });
        
        filename = `${project.name}-workload-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
        
      case "performance":
        // Generate performance metrics CSV
        csvContent = "Metric,Value\n";
        
        const completedTasks = project.tasks.filter(task => task.status === "done").length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        csvContent += `"Total Tasks",${totalTasks}\n`;
        csvContent += `"Completed Tasks",${completedTasks}\n`;
        csvContent += `"Completion Rate",${completionRate.toFixed(2)}%\n`;
        csvContent += `"Average Cycle Time",${(Math.random() * 5 + 3).toFixed(2)} days\n`;
        csvContent += `"On-Time Completion Rate",${(Math.random() * 30 + 60).toFixed(2)}%\n`;
        
        filename = `${project.name}-performance-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
    }
    
    // Create a download link and trigger the download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToPDF = () => {
    // In a real application, you would use a library like jsPDF or html2pdf
    // to generate PDF files. For this demo, we'll just show an alert.
    alert(`PDF export for ${reportType} report would be generated here.\n\nIn a real application, this would use a library like jsPDF or html2pdf to generate a formatted PDF document.`);
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Export Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tasks">Task List</SelectItem>
              <SelectItem value="progress">Progress Report</SelectItem>
              <SelectItem value="timeTracking">Time Tracking</SelectItem>
              <SelectItem value="workload">Team Workload</SelectItem>
              <SelectItem value="performance">Performance Metrics</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <div className="flex space-x-2">
            <Button 
              variant={exportFormat === "csv" ? "default" : "outline"} 
              size="sm"
              onClick={() => setExportFormat("csv")}
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button 
              variant={exportFormat === "pdf" ? "default" : "outline"} 
              size="sm"
              onClick={() => setExportFormat("pdf")}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
        
        <Button onClick={handleExport} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Export {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
        </Button>
        
        <div className="text-xs text-muted-foreground mt-2">
          {exportFormat === "csv" ? (
            <p>CSV files can be opened in Excel, Google Sheets, or any spreadsheet application.</p>
          ) : (
            <p>PDF files provide a formatted report that's easy to share and print.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportExport;
