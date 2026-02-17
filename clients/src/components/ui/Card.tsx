import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    header,
    footer,
    hoverable = false,
}) => {
    return (
        <div
            className={`
        bg-white rounded-lg shadow-soft border border-gray-200
        ${hoverable ? 'card-hover' : ''}
        ${className}
      `}
        >
            {header && (
                <div className="px-6 py-4 border-b border-gray-200">
                    {header}
                </div>
            )}
            <div className="px-6 py-4">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    {footer}
                </div>
            )}
        </div>
    );
};
