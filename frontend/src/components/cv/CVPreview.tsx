'use client';

import React from 'react';
import { useCVStore } from '@/stores/useCVStore';
import { TemplateRenderer } from '@/templates/components/TemplateRenderer';
import { ThemeSelector } from './ThemeSelector';
import { Eye, Printer } from 'lucide-react';

interface CVPreviewProps {
    data?: any;
    selectedTemplate?: string;
    onTemplateChange?: (templateId: string) => void;
}

export default function CVPreview({ selectedTemplate }: CVPreviewProps) {
    // Get the full cvData object from store
    const cvData = useCVStore(state => state.cvData);

    // Determine template to show (prop override or store state)
    const activeTemplate = selectedTemplate || cvData.template || 'modern';

    // Scale factor for preview - adjusted for better visibility
    const scaleFactor = 0.42;

    return (
        <div className="flex flex-col w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden relative rounded-xl border border-gray-200 shadow-inner">
            {/* Live Preview Header */}
            <div className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <Eye size={14} className="text-blue-600" />
                    <span className="font-semibold text-sm text-gray-700">Live Preview</span>
                    <span className="text-xs text-gray-400 hidden sm:inline">(A4)</span>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeSelector />
                    <div className="h-4 w-px bg-gray-300" />
                    <span className="text-xs text-gray-500 capitalize font-medium bg-gray-100 px-2 py-1 rounded">
                        {activeTemplate}
                    </span>
                </div>
            </div>

            {/* Scrollable Preview Area with proper scaling container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 flex justify-center">
                {/* Wrapper to maintain aspect ratio */}
                <div
                    className="relative"
                    style={{
                        // A4 dimensions: 210mm x 297mm ≈ 794px x 1123px at 96dpi
                        width: `${794 * scaleFactor}px`,
                        height: `${1123 * scaleFactor}px`,
                    }}
                >
                    {/* Scaled container */}
                    <div
                        className="absolute top-0 left-0 origin-top-left rounded-sm overflow-hidden"
                        style={{
                            width: '794px',
                            minHeight: '1123px',
                            transform: `scale(${scaleFactor})`,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <TemplateRenderer
                            data={cvData}
                            templateId={activeTemplate}
                        />
                    </div>
                </div>
            </div>

            {/* Footer with print hint */}
            <div className="w-full bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-2 flex justify-center items-center gap-2 text-xs text-gray-400 shrink-0">
                <Printer size={12} />
                <span>Print-ready format • Updates in real-time</span>
            </div>
        </div>
    );
}
