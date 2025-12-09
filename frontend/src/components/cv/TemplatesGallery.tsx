'use client';

import React, { useState } from 'react';
import { useCVStore } from '@/stores/useCVStore';
import { templates } from '@/templates/definitions';
import { CheckCircle, Loader2, Sparkles, Eye, Layout } from 'lucide-react';
import { cn } from '@/templates/utils'; // Assuming global utils exist, or I import local

interface TemplatesGalleryProps {
    isDark?: boolean;
    selectedTemplate?: string;
    onTemplateChange?: (id: string) => void;
}

export default function TemplatesGallery({ isDark, selectedTemplate, onTemplateChange }: TemplatesGalleryProps) {
    const storeTemplateId = useCVStore(state => state.cvData.template || 'modern');
    const setStoreTemplate = useCVStore(state => state.setSelectedTemplate);

    // Use props if provided (controlled), otherwise use store
    const activeId = selectedTemplate || storeTemplateId;

    const handleSelect = (id: string) => {
        if (onTemplateChange) {
            onTemplateChange(id);
        } else {
            setStoreTemplate(id as any);
        }
    };

    const [previewId, setPreviewId] = useState<string | null>(null);

    const templateList = Object.values(templates);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className={cn("font-bold text-lg", isDark ? 'text-white' : 'text-gray-900')}>
                        Pro Templates
                    </h3>
                    <p className={cn("text-xs opacity-75", isDark ? 'text-gray-400' : 'text-gray-500')}>
                        Select a layout to instantly update your CV
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {templateList.map((t) => {
                    const isSelected = activeId === t.id;
                    return (
                        <div key={t.id} className="group relative">
                            <button
                                onClick={() => handleSelect(t.id)}
                                className={cn(
                                    "w-full aspect-[210/297] rounded-xl border-2 overflow-hidden transition-all text-left relative",
                                    isSelected
                                        ? "border-blue-500 ring-2 ring-blue-200 ring-offset-2"
                                        : "border-gray-200 hover:border-gray-300 hover:shadow-lg",
                                    isDark && "border-gray-700 bg-gray-800"
                                )}
                            >
                                {/* Thumbnail Image */}
                                <div className="w-full h-full bg-gray-100 relative">
                                    <img
                                        src={t.thumbnail}
                                        alt={t.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            // Fallback
                                            (e.target as HTMLImageElement).src = '/templates/placeholder.png'; // Make sure this exists or simple div
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).parentElement!.style.backgroundColor = t.palette.primary + '20';
                                            (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest">${t.name}</div>`;
                                        }}
                                    />

                                    {/* Overlay */}
                                    <div className={cn(
                                        "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors",
                                        isSelected && "bg-blue-900/10"
                                    )} />
                                </div>

                                {/* Active Badge */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full shadow-lg animate-in zoom-in">
                                        <CheckCircle size={16} />
                                    </div>
                                )}
                            </button>

                            {/* Label */}
                            <div className="mt-2 text-center">
                                <h4 className={cn("font-semibold text-sm", isDark ? 'text-gray-200' : 'text-gray-900')}>
                                    {t.name}
                                </h4>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t.metadata.layout}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
