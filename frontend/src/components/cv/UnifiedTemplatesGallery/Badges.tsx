import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Shield, Briefcase } from 'lucide-react';
import { categoryOptions, levelOptions, type ExperienceLevel } from '@/data/enhanced-templates';

// ATS Score Badge with explanation tooltip
export const ATSScoreBadge: React.FC<{ score: number; reason?: string; size?: 'sm' | 'md' | 'lg'; isRTL?: boolean }> = ({ score, reason, size = 'md', isRTL = false }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const getScoreColor = (s: number) => {
        if (s >= 95) return 'from-green-500 to-emerald-600';
        if (s >= 90) return 'from-blue-500 to-blue-600';
        if (s >= 85) return 'from-yellow-500 to-orange-500';
        return 'from-gray-400 to-gray-500';
    };

    const sizes = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className={`bg-gradient-to-r ${getScoreColor(score)} text-white font-bold rounded-full shadow-lg flex items-center gap-1.5 ${sizes[size]} ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp size={size === 'sm' ? 12 : 14} />
                <span dir="ltr">{score}%</span>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && reason && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl text-start"
                        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    >
                        <div className="font-semibold mb-1 flex items-center gap-1">
                            <Shield size={12} /> {isRTL ? 'توافق ATS' : 'ATS Compatibility'}
                        </div>
                        <p className="text-gray-300">{reason}</p>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                            <div className="border-8 border-transparent border-t-gray-900" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Category Badge
export const CategoryBadge: React.FC<{ category: string; icon?: string; label?: string }> = ({ category, icon, label }) => {
    const option = categoryOptions.find(c => c.id === category);
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium whitespace-nowrap">
            <span>{icon || option?.icon}</span>
            <span>{label || option?.label || category}</span>
        </span>
    );
};

// Level Badge
export const LevelBadge: React.FC<{ level: ExperienceLevel; label?: string }> = ({ level, label }) => {
    const option = levelOptions.find(l => l.id === level);
    const colors: Record<ExperienceLevel, string> = {
        entry: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        mid: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        senior: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        executive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
            <Briefcase size={10} />
            {label || option?.label || level}
        </span>
    );
};
