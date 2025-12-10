import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
    label: string;
    icon: React.ReactNode;
    options: Array<{ id: string; label: string }>;
    value: string | null;
    onChange: (value: string | null) => void;
    isRTL?: boolean;
    allLabel?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label, icon, options, value, onChange, isRTL = false, allLabel = 'All'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(o => o.id === value)?.label || label;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {icon}
                <span className="text-sm font-medium">{selectedLabel}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 ${isRTL ? 'left-0' : 'left-0' /* In RTL usually right-0 but depends on parent context, keeping simple for now or adjusting alignment */}`}
                            style={{ [isRTL ? 'right' : 'left']: 0 }}
                        >
                            <button
                                onClick={() => { onChange(null); setIsOpen(false); }}
                                className={`w-full text-start px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!value ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                dir={isRTL ? 'rtl' : 'ltr'}
                            >
                                {allLabel}
                            </button>
                            {options.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => { onChange(option.id); setIsOpen(false); }}
                                    className={`w-full text-start px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${value === option.id ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
