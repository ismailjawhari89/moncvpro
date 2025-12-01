'use client';

import { useState } from 'react';
import type { CVData, TemplateType } from '@/types/cv';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';

interface CVPreviewProps {
    data: CVData;
    selectedTemplate: TemplateType;
    onTemplateChange: (template: TemplateType) => void;
}

export default function CVPreview({ data, selectedTemplate, onTemplateChange }: CVPreviewProps) {
    const templates = {
        modern: { component: ModernTemplate, name: 'Modern', color: 'blue' },
        classic: { component: ClassicTemplate, name: 'Classic', color: 'gray' },
        creative: { component: CreativeTemplate, name: 'Creative', color: 'purple' }
    };

    const SelectedTemplate = templates[selectedTemplate].component;

    return (
        <div className="space-y-4">
            {/* Template Selector */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Choisir un template</h3>
                <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(templates) as TemplateType[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => onTemplateChange(key)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${selectedTemplate === key
                                    ? `bg-${templates[key].color}-600 text-white`
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {templates[key].name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview Area */}
            <div className="bg-gray-100 p-6 rounded-lg overflow-auto" style={{ maxHeight: '85vh' }}>
                <SelectedTemplate data={data} />
            </div>
        </div>
    );
}
