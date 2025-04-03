import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressChart from "./ProgressChart";
import TimeTrackingReport from "./TimeTrackingReport";
import WorkloadVisualization from "./WorkloadVisualization";
import PerformanceMetrics from "./PerformanceMetrics";
import ReportExport from "./ReportExport";

interface AnalyticsDashboardProps {
  projectId: string;
  className?: string;
}

const AnalyticsDashboard = ({ projectId, className }: AnalyticsDashboardProps) => {
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  
  if (!project) return null;
  
  return (
    <div className={`space-y-6 analytics-dashboard overflow-x-hidden ${className}`}>
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <ProgressChart projectId={projectId} className="card" />
        <TimeTrackingReport projectId={projectId} className="card" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <WorkloadVisualization projectId={projectId} className="card" />
        <PerformanceMetrics projectId={projectId} className="card" />
      </div>
      
      <ReportExport projectId={projectId} className="card" />
    </div>
  );
};

export default AnalyticsDashboard;
