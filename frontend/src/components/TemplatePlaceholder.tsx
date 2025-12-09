'use client';

import React from 'react';

interface TemplatePlaceholderProps {
    name: string;
    category: string;
    atsScore: number;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

const categoryIcons: Record<string, string> = {
    'Tech/IT': '💻',
    'Business': '💼',
    'Creative': '🎨',
    'Medical': '⚕️',
    'Education': '📚',
    'Universal': '📋',
};

const categoryColors: Record<string, string> = {
    'Tech/IT': '#3B82F6',
    'Business': '#1F2937',
    'Creative': '#8B5CF6',
    'Medical': '#EF4444',
    'Education': '#F59E0B',
    'Universal': '#10B981',
};

export default function TemplatePlaceholder({
    name,
    category,
    atsScore,
    colors,
}: TemplatePlaceholderProps) {
    const categoryName = category.split(',')[0].trim();
    const icon = categoryIcons[categoryName] || '📄';
    const bgColor = colors.primary || categoryColors[categoryName] || '#6B7280';

    return (
        <svg
            viewBox="0 0 400 500"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Background */}
            <rect width="400" height="500" fill="white" />

            {/* Top color bar */}
            <rect width="400" height="80" fill={bgColor} />

            {/* Decorative gradient overlay */}
            <defs>
                <linearGradient id={`grad-${name.replace(/\s/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: bgColor, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: colors.secondary || bgColor, stopOpacity: 0.8 }} />
                </linearGradient>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
                </filter>
            </defs>

            <rect width="400" height="80" fill={`url(#grad-${name.replace(/\s/g, '-')})`} />

            {/* Icon/Emoji (larger) */}
            <text
                x="200"
                y="170"
                fontSize="80"
                textAnchor="middle"
                style={{ fontFamily: 'Arial, sans-serif' }}
            >
                {icon}
            </text>

            {/* Template Name */}
            <text
                x="200"
                y="240"
                fontSize="24"
                fontWeight="bold"
                textAnchor="middle"
                fill="#1F2937"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {name}
            </text>

            {/* Category Badge */}
            <rect
                x="130"
                y="260"
                width="140"
                height="30"
                rx="15"
                fill={bgColor}
                opacity="0.1"
            />
            <text
                x="200"
                y="280"
                fontSize="14"
                textAnchor="middle"
                fill={bgColor}
                fontWeight="600"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {categoryName}
            </text>

            {/* ATS Score Circle */}
            <circle
                cx="200"
                cy="340"
                r="40"
                fill="none"
                stroke={bgColor}
                strokeWidth="6"
                opacity="0.2"
            />
            <circle
                cx="200"
                cy="340"
                r="40"
                fill="none"
                stroke={bgColor}
                strokeWidth="6"
                strokeDasharray={`${(atsScore / 100) * 251.2} 251.2`}
                transform="rotate(-90 200 340)"
                strokeLinecap="round"
            />
            <text
                x="200"
                y="345"
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
                fill={bgColor}
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {atsScore}%
            </text>
            <text
                x="200"
                y="365"
                fontSize="10"
                textAnchor="middle"
                fill="#6B7280"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                ATS Score
            </text>

            {/* "Coming Soon" message */}
            <text
                x="200"
                y="420"
                fontSize="14"
                textAnchor="middle"
                fill="#9CA3AF"
                fontStyle="italic"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                Preview Coming Soon
            </text>

            {/* Decorative elements */}
            <rect x="80" y="450" width="60" height="3" rx="1.5" fill={bgColor} opacity="0.3" />
            <rect x="160" y="450" width="80" height="3" rx="1.5" fill={bgColor} opacity="0.3" />
            <rect x="260" y="450" width="60" height="3" rx="1.5" fill={bgColor} opacity="0.3" />

            {/* Border */}
            <rect
                width="400"
                height="500"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
            />
        </svg>
    );
}
