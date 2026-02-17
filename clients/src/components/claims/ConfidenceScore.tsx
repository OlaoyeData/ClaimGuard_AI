import React from 'react';

interface ConfidenceScoreProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({ score, size = 'md' }) => {
    const getColor = (score: number) => {
        if (score >= 80) return 'success';
        if (score >= 50) return 'warning';
        return 'danger';
    };

    const color = getColor(score);
    const colorClasses = {
        success: 'from-success-600 to-success-400',
        warning: 'from-warning-600 to-warning-400',
        danger: 'from-danger-600 to-danger-400',
    };

    const sizes = {
        sm: { circle: 80, stroke: 8, text: 'text-xl' },
        md: { circle: 120, stroke: 10, text: 'text-3xl' },
        lg: { circle: 160, stroke: 12, text: 'text-4xl' },
    };

    const { circle, stroke, text } = sizes[size];
    const radius = (circle - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={circle} height={circle} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={circle / 2}
                    cy={circle / 2}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={stroke}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={circle / 2}
                    cy={circle / 2}
                    r={radius}
                    stroke="url(#gradient)"
                    strokeWidth={stroke}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className={`text-${color}-600`} stopColor="currentColor" />
                        <stop offset="100%" className={`text-${color}-400`} stopColor="currentColor" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent ${text}`}>
                    {score}%
                </span>
                <span className="text-xs text-gray-600 mt-1">Confidence</span>
            </div>
        </div>
    );
};
