
import React from 'react';
import { TemplateRenderer } from '../../templates/components/TemplateRenderer';
import { getTemplate } from '../../templates/definitions';
import { CVData } from '../../types/cv';

interface CVPreviewProps {
    data: CVData;
    activeTemplate?: string;
    atsMode?: boolean;
    onTemplateChange?: (templateId: string) => void;
    previewMode?: 'print' | 'web';
    contentLocale?: string;
}

export default function CVPreview({
    data,
    activeTemplate = 'modern-pro',
    atsMode = false,
    onTemplateChange,
    previewMode = 'web',
    contentLocale = 'en'
}: CVPreviewProps) {
    const template = getTemplate(activeTemplate);

    if (!template) {
        return <div>Template not found: {activeTemplate}</div>;
    }

    return (
        <div className="relative" style={{ minHeight: '800px', backgroundColor: '#e5e7eb', padding: '20px', display: 'flex', justifyContent: 'center' }}>
            {/* Mode Badge - Optional visual indicator */}
            {atsMode && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#fef3c7', // amber-100
                    color: '#92400e', // amber-800
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    zIndex: 10
                }}>
                    ATS Mode
                </div>
            )}

            {/* Wrapper for scaling/preview */}
            <div id="cv-preview" style={{ width: '210mm', minHeight: '297mm', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <TemplateRenderer
                    template={template}
                    data={data}
                    atsMode={atsMode}
                    locale={contentLocale}
                    customizations={undefined} // Pass customizations if needed
                />
            </div>
        </div>
    );
}
