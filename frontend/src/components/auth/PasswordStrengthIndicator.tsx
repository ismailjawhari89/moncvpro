import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

export interface PasswordStrengthIndicatorProps {
    password: string;
    onStrengthChange?: (strength: string) => void;
}

export function PasswordStrengthIndicator({ password, onStrengthChange }: PasswordStrengthIndicatorProps) {

    const validatePasswordStrength = (pwd: string) => {
        const errors: string[] = [];
        if (!pwd || pwd.length < 12) errors.push('Password must be at least 12 characters long');
        if (!/[A-Z]/.test(pwd)) errors.push('Password must contain at least one uppercase letter');
        if (!/[a-z]/.test(pwd)) errors.push('Password must contain at least one lowercase letter');
        if (!/\d/.test(pwd)) errors.push('Password must contain at least one number');
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) errors.push('Password must contain at least one special character');

        let score = 0;
        if (pwd.length >= 12) score += 25;
        if (pwd.length >= 16) score += 10;
        if (pwd.length >= 20) score += 10;
        if (/[a-z]/.test(pwd)) score += 15;
        if (/[A-Z]/.test(pwd)) score += 15;
        if (/\d/.test(pwd)) score += 15;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score += 10;

        let strength = 'weak';
        if (score >= 90) strength = 'strong';
        else if (score >= 70) strength = 'good';
        else if (score >= 40) strength = 'fair';

        return { isValid: errors.length === 0, errors, strength };
    };

    const validation = validatePasswordStrength(password);
    const strength = validation.strength;

    React.useEffect(() => {
        onStrengthChange?.(strength);
    }, [strength, onStrengthChange]);

    const getColor = () => {
        switch (strength) {
            case 'strong': return 'bg-green-500';
            case 'good': return 'bg-blue-500';
            case 'fair': return 'bg-yellow-500';
            case 'weak': return 'bg-red-500';
            default: return 'bg-gray-200';
        }
    };

    const getLabel = () => {
        switch (strength) {
            case 'strong': return 'Strong';
            case 'good': return 'Good';
            case 'fair': return 'Fair';
            case 'weak': return 'Weak';
            default: return '';
        }
    };

    return (
        <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Password Strength</span>
                <span className={`text-sm font-bold ${getColor().replace('bg-', 'text-')}`}>
                    {getLabel()}
                </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ease-in-out ${getColor()}`}
                    style={{ width: `${['weak', 'fair', 'good', 'strong'].indexOf(strength) * 25 + 25}%` }}
                />
            </div>

            {/* Requirements checklist */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <RequirementItem met={password.length >= 12} label="12+ Characters" />
                <RequirementItem met={/[A-Z]/.test(password)} label="Uppercase (A-Z)" />
                <RequirementItem met={/[a-z]/.test(password)} label="Lowercase (a-z)" />
                <RequirementItem met={/\d/.test(password)} label="Number (0-9)" />
                <RequirementItem met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)} label="Symbol (!@#$)" />
            </div>
        </div>
    );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
    return (
        <div className="flex items-center space-x-2 transition-colors duration-200">
            {met ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
                <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
            )}
            <span className={`${met ? 'text-green-700 font-medium' : 'text-gray-500'}`}>{label}</span>
        </div>
    );
}
