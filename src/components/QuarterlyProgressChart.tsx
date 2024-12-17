import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import React from "react";
import {PROGRESS_CATEGORIES} from "@/components/Constants.tsx";

export const QuarterlyProgressChart = ({ items }) => {
    const progressData = PROGRESS_CATEGORIES.map(category => {
        const count = items.filter(item => {
            const progress = Number(item.actualProgress);
            return progress >= category.range[0] && progress <= category.range[1];
        }).length;

        return {
            name: category.name,
            value: count,
            color: category.color
        };
    }).filter(item => item.value > 0);

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Progress Distribution</CardTitle>
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
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};