'use client';

import { useState } from 'react';
import type { CVData, TemplateType } from '@/types/cv';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import { exportPDF, exportDOCX, exportTXT } from '@/utils/export';

interface CVPreviewProps {
    data: CVData;
    selectedTemplate: TemplateType;
    onTemplateChange: (template: TemplateType) => void;
}

export default function CVPreview({ data, selectedTemplate, onTemplateChange }: CVPreviewProps) {
    const [isExporting, setIsExporting] = useState(false);

    const templates = {
        modern: { component: ModernTemplate, name: 'Modern', color: 'blue' },
        classic: { component: ClassicTemplate, name: 'Classic', color: 'gray' },
        creative: { component: CreativeTemplate, name: 'Creative', color: 'purple' }
    };

    const SelectedTemplate = templates[selectedTemplate].component;

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            await exportPDF('cv-preview-content', `CV_${data.personal.fullName || 'Document'}`);
        } catch (error) {
            console.error('PDF export failed:', error);
            alert('Erreur lors de l\'export PDF');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportDOCX = async () => {
        setIsExporting(true);
        try {
            await exportDOCX(data, `CV_${data.personal.fullName || 'Document'}`);
        } catch (error) {
            console.error('DOCX export failed:', error);
            alert('Erreur lors de l\'export DOCX');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportTXT = () => {
        try {
            exportTXT(data, `CV_${data.personal.fullName || 'Document'}`);
        } catch (error) {
            console.error('TXT export failed:', error);
            alert('Erreur lors de l\'export TXT');
        }
    };

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

            {/* Export Buttons */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Exporter le CV</h3>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>📄</span>
                        <span>PDF</span>
                    </button>
                    <button
                        onClick={handleExportDOCX}
                        disabled={isExporting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>📝</span>
                        <span>DOCX</span>
                    </button>
                    <button
                        onClick={handleExportTXT}
                        disabled={isExporting}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>📋</span>
                        <span>TXT</span>
                    </button>
                </div>
                {isExporting && (
                    <p className="text-xs text-gray-500 mt-2 text-center">Export en cours...</p>
                )}
            </div>

            {/* Preview Area */}
            <div className="bg-gray-100 p-6 rounded-lg overflow-auto" style={{ maxHeight: '85vh' }}>
                <div id="cv-preview-content">
                    <SelectedTemplate data={data} />
                </div>
            </div>
        </div>
    );
}
