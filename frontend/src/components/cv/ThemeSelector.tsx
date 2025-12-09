import React from 'react';
import { useCVStore } from '@/stores/useCVStore';
import { getTemplate } from '@/templates/definitions';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils'; // Or templates/utils

export const ThemeSelector = () => {
    const templateId = useCVStore(state => state.cvData.template || 'modern');
    const selectedTheme = useCVStore(state => state.cvData.theme);
    const setSelectedTheme = useCVStore(state => state.setSelectedTheme);

    const template = getTemplate(templateId);
    const variants = template.variants;

    if (!variants) return null;

    const variantKeys = Object.keys(variants);
    if (variantKeys.length === 0) return null;

    return (
        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-200">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Style</span>

            {/* Default Option (Original) */}
            <button
                onClick={() => setSelectedTheme('')}
                className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
                    (!selectedTheme) ? "border-gray-900 scale-110" : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: template.palette.primary }}
                title="Default"
            >
                {(!selectedTheme) && <Check size={12} className="text-white" />}
            </button>

            {/* Variants */}
            {variantKeys.map(key => {
                const v = variants[key];
                const isActive = selectedTheme === key;
                return (
                    <button
                        key={key}
                        onClick={() => setSelectedTheme(key)}
                        className={cn(
                            "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
                            isActive ? "border-gray-900 scale-110" : "border-transparent hover:scale-105"
                        )}
                        style={{ backgroundColor: v.palette.primary || template.palette.primary }}
                        title={v.name}
                    >
                        {isActive && <Check size={12} className="text-white" />}
                    </button>
                );
            })}
        </div>
    );
};
