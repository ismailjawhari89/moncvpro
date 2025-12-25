'use client';

import { useState } from 'react';
import {
    Download,
    FileText,
    FileSpreadsheet,
    FileCode,
    Loader2,
    Check,
    X
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { generatePDF, generatePDFWithProgress } from '@/lib/pdfGenerator';
import { exportDOCX, exportTXT, exportJSON, generateTextPDF } from '@/utils/export';
import { pdf } from '@react-pdf/renderer';
import { ModernPDF } from './pdf-templates/ModernPDF';
import type { TemplateData, CVData } from '@/types/cv';

interface ExportPanelProps {
    cvData: CVData;
    previewElementId: string;
    filename?: string;
    isDark?: boolean;
}

type ExportFormat = 'pdf' | 'pdf-hq' | 'pdf-ats' | 'docx' | 'txt' | 'json';

interface ExportOption {
    id: ExportFormat;
    label: string;
    description: string;
    icon: typeof FileText;
    isPremium?: boolean;
}

import { useTranslations } from 'next-intl';

export default function ExportPanel({
    cvData,
    previewElementId,
    filename = 'cv',
    isDark = false
}: ExportPanelProps) {
    const t = useTranslations('cvBuilder.export');
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportSuccess, setExportSuccess] = useState<ExportFormat | null>(null);
    const [exportError, setExportError] = useState<string | null>(null);

    const EXPORT_OPTIONS: ExportOption[] = [
        {
            id: 'pdf',
            label: t('formats.pdf.label'),
            description: t('formats.pdf.desc'),
            icon: FileText,
            isPremium: false
        },
        {
            id: 'pdf-hq',
            label: "High Performance (Vector PDF)",
            description: "Fast, small file, and ATS-friendly",
            icon: FileText,
            isPremium: true
        },
        {
            id: 'pdf-ats',
            label: t('formats.pdfAts.label'),
            description: t('formats.pdfAts.desc'),
            icon: FileText,
            isPremium: false
        },
        {
            id: 'docx',
            label: t('formats.docx.label'),
            description: t('formats.docx.desc'),
            icon: FileSpreadsheet,
            isPremium: false
        },
        {
            id: 'txt',
            label: t('formats.txt.label'),
            description: t('formats.txt.desc'),
            icon: FileText,
            isPremium: false
        },
        {
            id: 'json',
            label: t('formats.json.label'),
            description: t('formats.json.desc'),
            icon: FileCode,
            isPremium: false
        }
    ];

    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
    const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

    const getTemplateData = (): TemplateData => ({
        personal: {
            fullName: cvData.personalInfo.fullName,
            email: cvData.personalInfo.email,
            phone: cvData.personalInfo.phone,
            location: cvData.personalInfo.address,
            summary: cvData.summary
        },
        experiences: cvData.experiences,
        education: cvData.education,
        skills: cvData.skills,
        languages: cvData.languages
    });

    const handleExport = async (format: ExportFormat) => {
        setIsExporting(format);
        setExportProgress(0);
        setExportError(null);
        setExportSuccess(null);

        const exportData = getTemplateData();

        try {
            switch (format) {
                case 'pdf':
                    await generatePDFWithProgress(
                        previewElementId,
                        setExportProgress,
                        { filename: `${filename}.pdf` }
                    );
                    break;

                case 'pdf-hq':
                    setExportProgress(30);
                    const blob = await pdf(<ModernPDF data={cvData} />).toBlob();
                    setExportProgress(80);
                    saveAs(blob, `${filename}-hq.pdf`);
                    break;

                case 'pdf-ats':
                    const element = document.getElementById(previewElementId);
                    if (!element) throw new Error('Element de prévisualisation non trouvé');

                    // Capture HTML
                    const html = element.outerHTML;

                    // Capture CSS form head
                    const styles = Array.from(document.querySelectorAll('style'))
                        .map(s => s.outerHTML)
                        .join('\n');

                    await generateTextPDF(html, styles, `${filename}-ats.pdf`);
                    break;

                case 'docx':
                    await exportDOCX(exportData, { filename: `${filename}.docx` });
                    break;

                case 'txt':
                    exportTXT(exportData, { filename: `${filename}.txt` });
                    break;

                case 'json':
                    exportJSON(exportData, { filename: `${filename}.json` });
                    break;
            }

            setExportSuccess(format);
            setTimeout(() => setExportSuccess(null), 2000);
        } catch (error: any) {
            console.error('Export failed:', error);
            setExportError(error.message || 'Export failed');
            setTimeout(() => setExportError(null), 3000);
        } finally {
            setIsExporting(null);
            setExportProgress(0);
        }
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
                <Download size={18} />
                <span className="font-medium">{t('button')}</span>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className={`absolute right-0 top-12 w-80 ${bgColor} rounded-xl border ${borderColor} shadow-2xl z-50 overflow-hidden`}>
                        <div className={`p-4 border-b ${borderColor}`}>
                            <h3 className={`font-semibold ${textColor}`}>{t('title')}</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {t('subtitle')}
                            </p>
                        </div>

                        <div className="p-2">
                            {EXPORT_OPTIONS.map(option => {
                                const Icon = option.icon;
                                const isCurrentlyExporting = isExporting === option.id;
                                const isSuccess = exportSuccess === option.id;

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleExport(option.id)}
                                        disabled={isExporting !== null}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${hoverBg} ${isExporting !== null && !isCurrentlyExporting ? 'opacity-50' : ''
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg ${isSuccess
                                            ? 'bg-green-100 text-green-600'
                                            : isCurrentlyExporting
                                                ? 'bg-blue-100 text-blue-600'
                                                : isDark ? 'bg-gray-700' : 'bg-gray-100'
                                            }`}>
                                            {isCurrentlyExporting ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : isSuccess ? (
                                                <Check size={20} />
                                            ) : (
                                                <Icon size={20} className={textColor} />
                                            )}
                                        </div>

                                        <div className="flex-1 text-left rtl:text-right">
                                            <p className={`font-medium ${textColor}`}>{option.label}</p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {option.description}
                                            </p>
                                        </div>

                                        {/* Progress bar for PDF */}
                                        {isCurrentlyExporting && option.id === 'pdf' && exportProgress > 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                                                <div
                                                    className="h-full bg-blue-500 transition-all duration-300"
                                                    style={{ width: `${exportProgress}%` }}
                                                />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Error Message */}
                        {exportError && (
                            <div className="p-3 bg-red-50 border-t border-red-200 flex items-center gap-2 text-red-600">
                                <X size={16} />
                                <span className="text-sm">{exportError}</span>
                            </div>
                        )}

                        {/* Tips */}
                        <div className={`p-3 border-t ${borderColor} ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {t('tip')}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
