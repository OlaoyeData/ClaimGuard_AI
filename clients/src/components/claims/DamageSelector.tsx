import React from 'react';
import { Card } from '@/components/ui/Card';

interface DamageSelectorProps {
    selected: string;
    onChange: (value: string) => void;
}

const damageTypes = [
    { value: 'none', label: 'No Damage', icon: '✅', description: 'Vehicle appears undamaged' },
    { value: 'minor', label: 'Minor Dent', icon: '🔧', description: 'Small dents or scratches' },
    { value: 'moderate', label: 'Moderate Damage', icon: '⚠️', description: 'Noticeable damage requiring repair' },
    { value: 'severe', label: 'Severe Damage', icon: '🚨', description: 'Major structural damage' },
];

export const DamageSelector: React.FC<DamageSelectorProps> = ({ selected, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {damageTypes.map((type) => (
                <button
                    key={type.value}
                    onClick={() => onChange(type.value)}
                    className={`
            text-left p-6 rounded-lg border-2 transition-all duration-200
            ${selected === type.value
                            ? 'border-primary-500 bg-primary-50 shadow-md'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }
          `}
                >
                    <div className="flex items-start space-x-4">
                        <div className="text-4xl">{type.icon}</div>
                        <div className="flex-1">
                            <h3 className={`font-semibold mb-1 ${selected === type.value ? 'text-primary-700' : 'text-gray-900'}`}>
                                {type.label}
                            </h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                        {selected === type.value && (
                            <div className="text-primary-600 text-xl">✓</div>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
};
