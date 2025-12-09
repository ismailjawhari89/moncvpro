'use client';

import React, { useEffect } from 'react';
import { useCVStore } from '@/stores/useCVStore';
import { TemplateRenderer } from '@/templates/components/TemplateRenderer';
import { ThemeSelector } from './ThemeSelector';

interface CVPreviewProps {
    data?: any;
    selectedTemplate?: string;
    onTemplateChange?: (templateId: string) => void;
}

export default function CVPreview({ selectedTemplate }: CVPreviewProps) {
    const cvData = useCVStore(state => state.cvData);

    // Determine template to show (prop override or store state)
    const activeTemplate = selectedTemplate || cvData.template || 'modern';

    return (
        <div className="flex flex-col items-center w-full h-full bg-gray-50/50 overflow-hidden relative">
            {/* Live Preview Header */}
            <div className="w-full bg-white border-b px-4 py-2 flex justify-between items-center text-xs text-gray-500 z-10 h-14">
                <span className="font-semibold hidden sm:inline">Live Preview (A4)</span>

                <div className="flex items-center gap-4">
                    <ThemeSelector />
                    <span className="capitalize">{activeTemplate}</span>
                </div>
            </div>

            {/* Scrollable Preview Area */}
            <div className="flex-1 w-full overflow-y-auto p-4 md:p-8 flex justify-center">
                {/* Scaled Render Container */}
                <div className="relative shadow-2xl transition-all duration-300 origin-top transform scale-[0.45] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.75] xl:scale-[0.85]">
                    <TemplateRenderer
                        data={cvData}
                        templateId={activeTemplate}
                    />
                </div>
            </div>
        </div>
    );
}
