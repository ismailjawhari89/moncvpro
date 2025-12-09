import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    isDark?: boolean;
    className?: string;
}

export const Card = ({ children, isDark, className = '' }: CardProps) => (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-sm ${className}`}>
        {children}
    </div>
);

export interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    isDark?: boolean;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export const InputField = ({ label, value, onChange, placeholder, type = 'text', isDark, required, disabled, className = '' }: InputFieldProps) => (
    <div className={className}>
        {label && (
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-2.5 rounded-xl border ${isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
        />
    </div>
);

export interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    isDark?: boolean;
}

export const TextAreaField = ({ label, value, onChange, placeholder, rows = 4, isDark }: TextAreaFieldProps) => (
    <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {label}
        </label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`w-full px-4 py-2.5 rounded-xl border ${isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none`}
        />
    </div>
);
