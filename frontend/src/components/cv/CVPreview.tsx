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
    // Get the full cvData object from store
    const cvData = useCVStore(state => state.cvData);

    // Debug: Log when cvData changes
    useEffect(() => {
        console.log('[CVPreview] cvData updated:', {
            fullName: cvData.personalInfo?.fullName,
            summary: cvData.summary?.slice(0, 50),
            experienceCount: cvData.experiences?.length,
            skillsCount: cvData.skills?.length
        });
    }, [cvData]);

    // Determine template to show (prop override or store state)
    const activeTemplate = selectedTemplate || cvData.template || 'modern';

    // Scale factor for preview
    const scaleFactor = 0.4; // 40% of original size

    return (
        <div className="flex flex-col w-full h-full bg-gray-50/50 overflow-hidden relative rounded-xl border border-gray-200">
            {/* Live Preview Header */}
            <div className="w-full bg-white border-b px-4 py-2 flex justify-between items-center text-xs text-gray-500 z-10 shrink-0">
                <span className="font-semibold hidden sm:inline">Live Preview (A4)</span>

                <div className="flex items-center gap-4">
                    <ThemeSelector />
                    <span className="capitalize">{activeTemplate}</span>
                </div>
            </div>

            {/* Scrollable Preview Area with proper scaling container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 bg-gray-100">
                {/* Wrapper to maintain aspect ratio */}
                <div
                    className="relative mx-auto"
                    style={{
                        // A4 dimensions: 210mm x 297mm ≈ 794px x 1123px at 96dpi
                        width: `${794 * scaleFactor}px`,
                        height: `${1123 * scaleFactor}px`,
                    }}
                >
                    {/* Scaled container */}
                    <div
                        className="absolute top-0 left-0 origin-top-left shadow-xl bg-white"
                        style={{
                            width: '794px',
                            minHeight: '1123px',
                            transform: `scale(${scaleFactor})`,
                        }}
                    >
                        <TemplateRenderer
                            data={cvData}
                            templateId={activeTemplate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
