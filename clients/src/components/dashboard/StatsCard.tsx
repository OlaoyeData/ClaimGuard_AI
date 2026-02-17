import React from 'react';
import { Card } from '@/components/ui/Card';

interface StatsCardProps {
    icon: string;
    label: string;
    value: number | string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'yellow' | 'red';
}

export const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    label,
    value,
    trend,
    color = 'blue',
}) => {
    const colorClasses = {
        blue: 'from-primary-600 to-primary-400',
        green: 'from-success-600 to-success-400',
        yellow: 'from-warning-600 to-warning-400',
        red: 'from-danger-600 to-danger-400',
    };

    return (
        <Card className="animate-fade-in">
            <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center text-3xl`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">{label}</p>
                    <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                        {trend && (
                            <span className={`text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                                {trend.isPositive ? '↑' : '↓'} {trend.value}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};
