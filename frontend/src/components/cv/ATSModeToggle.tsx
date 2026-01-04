
import React from 'react';
// import { Eye, Shield } from 'lucide-react'; // Mocking icons to avoid dependency errors if lucide is missing

// Simple Icon mocks
const EyeIcon = ({ size = 24, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const ShieldIcon = ({ size = 24, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

interface ATSModeToggleProps {
    atsMode: boolean;
    onToggle: (atsMode: boolean) => void;
    isDark?: boolean;
}

export function ATSModeToggle({
    atsMode,
    onToggle,
    isDark = false
}: ATSModeToggleProps) {
    const bgColor = isDark ? '#1f2937' : '#f3f4f6'; // tailwind bg-gray-800 / bg-gray-100
    const activeBg = '#1e40af';
    const inactiveText = isDark ? '#9ca3af' : '#4b5563'; // tailwind text-gray-400 / text-gray-600

    return (
        <div style={{ display: 'flex', gap: '8px', padding: '8px', background: bgColor, borderRadius: '8px' }}>
            {/* Pro Mode Button */}
            <button
                onClick={() => onToggle(false)}
                style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: !atsMode ? activeBg : 'transparent',
                    color: !atsMode ? 'white' : inactiveText,
                    boxShadow: !atsMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                title="Pro Mode: Professional layout with photo and design"
            >
                <EyeIcon size={18} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Pro Mode</span>
            </button>

            {/* ATS Safe Button */}
            <button
                onClick={() => onToggle(true)}
                style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: atsMode ? activeBg : 'transparent',
                    color: atsMode ? 'white' : inactiveText,
                    boxShadow: atsMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                title="ATS Safe: Optimized for applicant tracking systems"
            >
                <ShieldIcon size={18} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>ATS Safe</span>
            </button>
        </div>
    );
}

export default ATSModeToggle;
