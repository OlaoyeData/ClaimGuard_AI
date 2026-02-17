import React from 'react';
import { Card } from '@/components/ui/Card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ClaimChartProps {
    type: 'line' | 'pie';
}

const lineData = [
    { month: 'Jan', claims: 42 },
    { month: 'Feb', claims: 38 },
    { month: 'Mar', claims: 51 },
    { month: 'Apr', claims: 45 },
    { month: 'May', claims: 58 },
    { month: 'Jun', claims: 62 },
];

const pieData = [
    { name: 'Approved', value: 45, color: '#22c55e' },
    { name: 'Pending', value: 30, color: '#eab308' },
    { name: 'Rejected', value: 15, color: '#ef4444' },
    { name: 'Info Requested', value: 10, color: '#3b82f6' },
];

export const ClaimChart: React.FC<ClaimChartProps> = ({ type }) => {
    if (type === 'line') {
        return (
            <Card
                header={<h3 className="font-semibold text-gray-900">Claims Trend</h3>}
                className="animate-fade-in"
            >
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Line type="monotone" dataKey="claims" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        );
    }

    return (
        <Card
            header={<h3 className="font-semibold text-gray-900">Claim Status Distribution</h3>}
            className="animate-fade-in"
        >
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};
