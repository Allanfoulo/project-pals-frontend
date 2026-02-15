import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { useAI } from "@/contexts/AIContext";
import { useProjects } from "@/contexts/ProjectContext";

const SmartInsights = () => {
    const { generateContent } = useAI();
    const { projects } = useProjects();
    const [insights, setInsights] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generateInsights = async () => {
        setLoading(true);
        try {
            // Prepare a summary of project data for the AI
            const projectSummary = projects.map(p => ({
                name: p.name,
                status: p.status,
                progress: p.progress,
                taskCount: p.tasks.length,
                overdueTasks: p.tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length
            }));

            const prompt = `Analyze the following project data and provide 3 brief, actionable insights. Focus on risks (overdue tasks), opportunities (projects nearing completion), and resource allocation. Format the output as a JSON object with keys: "risks", "opportunities", "recommendations". Each key should hold an array of strings. Data: ${JSON.stringify(projectSummary)}`;

            const response = await generateContent(prompt);

            // Clean up code blocks if present
            const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
            setInsights(cleanResponse);
        } catch (error) {
            console.error("Failed to generate insights:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to parse JSON safely
    const parsedInsights = insights ? (() => {
        try {
            return JSON.parse(insights);
        } catch (e) {
            return null;
        }
    })() : null;

    return (
        <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles size={120} />
            </div>

            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    AI Intelligence Center
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateInsights}
                    disabled={loading}
                    className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>
            <CardContent>
                {!parsedInsights && !loading && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Unlock AI-powered insights for your projects.</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={generateInsights}
                            className="mt-4 border-primary/20 hover:bg-primary/5"
                        >
                            Generate Insights
                        </Button>
                    </div>
                )}

                {loading && (
                    <div className="space-y-3 py-4">
                        <div className="h-4 bg-primary/10 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-primary/10 rounded animate-pulse w-1/2"></div>
                        <div className="h-4 bg-primary/10 rounded animate-pulse w-full"></div>
                    </div>
                )}

                {parsedInsights && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {parsedInsights.risks?.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-red-500 flex items-center gap-1">
                                    <AlertTriangle size={12} /> Risks
                                </h4>
                                <ul className="space-y-1">
                                    {parsedInsights.risks.map((risk: string, i: number) => (
                                        <li key={i} className="text-sm border-l-2 border-red-500/30 pl-3 py-1 bg-red-500/5 rounded-r">
                                            {risk}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {parsedInsights.opportunities?.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-green-500 flex items-center gap-1">
                                    <TrendingUp size={12} /> Opportunities
                                </h4>
                                <ul className="space-y-1">
                                    {parsedInsights.opportunities.map((opp: string, i: number) => (
                                        <li key={i} className="text-sm border-l-2 border-green-500/30 pl-3 py-1 bg-green-500/5 rounded-r">
                                            {opp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {parsedInsights.recommendations?.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-1">
                                    <Lightbulb size={12} /> Recommendations
                                </h4>
                                <ul className="space-y-1">
                                    {parsedInsights.recommendations.map((rec: string, i: number) => (
                                        <li key={i} className="text-sm border-l-2 border-blue-500/30 pl-3 py-1 bg-blue-500/5 rounded-r">
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SmartInsights;
