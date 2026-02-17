import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={`
            w-full px-4 py-2 border rounded-lg transition-all duration-200
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error
                            ? 'border-danger-500 focus:ring-2 focus:ring-danger-500 focus:border-danger-500'
                            : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                        }
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-danger-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};
