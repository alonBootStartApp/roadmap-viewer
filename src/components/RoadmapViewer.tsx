import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, AlertCircle, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {quarters} from "@/components/Constants.tsx";
import {QuarterlyProgressChart} from "@/components/QuarterlyProgressChart.tsx";
import {getDevelopersList} from "@/components/Functions.tsx";

interface RoadmapItem {
    projectName: string;
    subProject: string;
    startDate: string;
    endDate: string;
    expectedProgress: number;
    actualProgress: number;
    quickWin: boolean;
    isBackend: boolean;
    isFrontend: boolean;
    isAutomation: boolean;
    isDevops: boolean;
    isCyber: boolean;
    name: string;
    description: string;
}

export const RoadmapViewer = () => {
    const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
    const [filterDelayed, setFilterDelayed] = useState(false);
    const [selectedProject, setSelectedProject] = useState("all");
    const [selectedSubProject, setSelectedSubProject] = useState("all");
    const [quickWinFilter, setQuickWinFilter] = useState("all");

    const uniqueProjects = useMemo(() => {
        const projects = new Set(roadmapItems.map(item => item.projectName));
        return Array.from(projects).sort();
    }, [roadmapItems]);

    const uniqueSubProjects = useMemo(() => {
        let subProjects;
        if (selectedProject === "all") {
            subProjects = new Set(roadmapItems.map(item => item.subProject));
        } else {
            subProjects = new Set(
                roadmapItems
                    .filter(item => item.projectName === selectedProject)
                    .map(item => item.subProject)
            );
        }
        return Array.from(subProjects).filter(Boolean).sort();
    }, [roadmapItems, selectedProject]);

    const calculateProgress = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();

        const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        const daysElapsed = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

        return Math.min(Math.max(Math.round((daysElapsed / totalDays) * 100), 0), 100);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const rows = text.split('\n');
                const headers = rows[0].split(',');

                const items = rows.slice(1).map(row => {
                    const values = row.split(',');
                    const item: any = {};
                    headers.forEach((header, index) => {
                        item[header.trim()] = values[index]?.trim();
                    });
                    item.expectedProgress = calculateProgress(item.startDate, item.endDate);
                    item.quickWin = item.quickWin?.toLowerCase() === 'true';
                    item.isBackend = item.isBackend?.toLowerCase() === 'true';
                    item.isFrontend = item.isFrontend?.toLowerCase() === 'true';
                    item.isAutomation = item.isAutomation?.toLowerCase() === 'true';
                    item.isDevops = item.isDevops?.toLowerCase() === 'true';
                    item.isCyber = item.isCyber?.toLowerCase() === 'true';
                    return item;
                });

                setRoadmapItems(items);
                setSelectedProject("all");
                setSelectedSubProject("all");
                setQuickWinFilter("all");
            };
            reader.readAsText(file);
        }
    };

    const handleProjectChange = (value: string) => {
        setSelectedProject(value);
        setSelectedSubProject("all");
    };

    const getItemsForQuarter = (quarterStart: string, quarterEnd: string) => {
        return roadmapItems.filter(item => {
            const itemStart = new Date(item.startDate);
            const itemEnd = new Date(item.endDate);
            const qStart = new Date(quarterStart);
            const qEnd = new Date(quarterEnd);

            return (itemStart <= qEnd && itemEnd >= qStart);
        });
    };

    const filterItems = (items: RoadmapItem[]) => {
        let filtered = items;

        if (selectedProject !== "all") {
            filtered = filtered.filter(item => item.projectName === selectedProject);
        }

        if (selectedSubProject !== "all") {
            filtered = filtered.filter(item => item.subProject === selectedSubProject);
        }

        if (quickWinFilter !== "all") {
            filtered = filtered.filter(item =>
                quickWinFilter === "true" ? item.quickWin : !item.quickWin
            );
        }

        if (filterDelayed) {
            filtered = filtered.filter(item => Number(item.actualProgress) < item.expectedProgress);
        }

        return filtered;
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex flex-col gap-4">
                        <span>Company Roadmap Viewer</span>
                        <div className="flex items-center gap-4 flex-wrap">
                            <Select value={selectedProject} onValueChange={handleProjectChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by project" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Projects</SelectItem>
                                    {uniqueProjects.map(project => (
                                        <SelectItem key={project} value={project}>
                                            {project}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedSubProject}
                                onValueChange={setSelectedSubProject}
                                disabled={uniqueSubProjects.length === 0}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by sub-project" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sub-Projects</SelectItem>
                                    {uniqueSubProjects.map(subProject => (
                                        <SelectItem key={subProject} value={subProject}>
                                            {subProject}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={quickWinFilter} onValueChange={setQuickWinFilter}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by quick wins" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Items</SelectItem>
                                    <SelectItem value="true">Quick Wins</SelectItem>
                                    <SelectItem value="false">Regular Items</SelectItem>
                                </SelectContent>
                            </Select>

                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="csvInput"
                            />
                            <Button
                                onClick={() => document.getElementById('csvInput')?.click()}
                            >
                                Import CSV1
                            </Button>
                            <Button
                                variant={filterDelayed ? "destructive" : "outline"}
                                onClick={() => setFilterDelayed(!filterDelayed)}
                            >
                                {filterDelayed ? "Show All" : "Show Delayed Only"}
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
            </Card>

            <Tabs defaultValue="Q4-2024" className="w-full">
                <TabsList className="mb-4">
                    {quarters.map(quarter => (
                        <TabsTrigger key={quarter.id} value={quarter.id}>
                            {quarter.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {quarters.map(quarter => {
                    const quarterItems = filterItems(getItemsForQuarter(quarter.start, quarter.end));

                    return (
                        <TabsContent key={quarter.id} value={quarter.id}>
                            <QuarterlyProgressChart items={quarterItems} />

                            <div className="space-y-4">
                                {quarterItems.map((item, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                    {item.name}
                                                    {item.quickWin && (
                                                        <Zap className="w-4 h-4 text-yellow-500"/>
                                                    )}
                                                </h3>
                                                <p className="text-start text-sm text-gray-500">
                                                    Project: {item.projectName}
                                                    {item.subProject && ` > ${item.subProject}`}
                                                </p>
                                                <p className="text-start text-sm text-gray-500">
                                                    Developers: {getDevelopersList({item})}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-4 h-4 mr-1"/>
                                                {item.startDate} - {item.endDate}
                                            </div>
                                        </div>

                                        <p className="mb-4">{item.description}</p>

                                        <div className="space-y-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: `${item.expectedProgress}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${
                                                        Number(item.actualProgress) >= item.expectedProgress
                                                            ? 'bg-green-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${item.actualProgress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Expected: {item.expectedProgress}%</span>
                                                <span>Actual: {item.actualProgress}%</span>
                                            </div>
                                        </div>

                                        {Number(item.actualProgress) < item.expectedProgress && (
                                            <Alert variant="destructive" className="mt-4">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    This item is behind schedule by {(item.expectedProgress - Number(item.actualProgress)).toFixed(1)}%
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
};