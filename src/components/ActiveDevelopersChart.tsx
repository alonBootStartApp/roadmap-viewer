import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import React from "react";
import {PROGRESS_CATEGORIES} from "@/components/Constants.tsx";

interface RoadmapItem {
    actualProgress: number;
}

interface QuarterlyProgressChartProps {
    items: RoadmapItem[];
}

export const ActiveDevelopersChart: React.FC<QuarterlyProgressChartProps> = ({totalDevelopers, activeDevelopers}) => {
    const progressData = [activeDevelopers, totalDevelopers - activeDevelopers].map((value, index) => {
        return {
            name: index === 0 ? 'Active' : 'Inactive',
            value: value,
            color: index === 0 ? '#10B981' : '#EF4444'
        };
    });


    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Active VS Inactive Developers</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={progressData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {progressData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip/>
                            <Legend/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};