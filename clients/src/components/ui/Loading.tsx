import React from 'react';

// Spinner component
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex items-center justify-center">
            <svg
                className={`animate-spin text-primary-600 ${sizes[size]}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </div>
    );
};

// Skeleton loader for cards
export const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    );
};

// Skeleton loader for lists
export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-soft border border-gray-200 p-4 animate-pulse">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Full page loading
export const PageLoading: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <Spinner size="lg" />
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    );
};
