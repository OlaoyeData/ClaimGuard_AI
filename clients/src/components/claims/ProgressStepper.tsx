import React from 'react';

interface ProgressStepperProps {
    steps: string[];
    currentStep: number;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                {/* Circle */}
                                <div
                                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                    ${isCompleted
                                            ? 'bg-gradient-to-r from-success-600 to-success-400 text-white shadow-glow-green'
                                            : isCurrent
                                                ? 'bg-gradient-to-r from-primary-600 to-primary-400 text-white shadow-glow-blue'
                                                : 'bg-gray-200 text-gray-500'
                                        }
                  `}
                                >
                                    {isCompleted ? '✓' : index + 1}
                                </div>
                                {/* Label */}
                                <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-primary-600' : 'text-gray-500'}`}>
                                    {step}
                                </span>
                            </div>

                            {/* Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-1 mx-2 -mt-6">
                                    <div
                                        className={`h-full transition-all duration-300 ${index < currentStep ? 'bg-success-500' : 'bg-gray-200'
                                            }`}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
