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
import { generatePDF, generatePDFWithProgress } from '@/lib/pdfGenerator';
import { exportDOCX, exportTXT, exportJSON } from '@/utils/export';
import type { TemplateData } from '@/types/cv';

interface ExportPanelProps {
    cvData: TemplateData;
    previewElementId: string;
    filename?: string;
    isDark?: boolean;
}

type ExportFormat = 'pdf' | 'docx' | 'txt' | 'json';

interface ExportOption {
    id: ExportFormat;
    label: string;
    description: string;
    icon: typeof FileText;
    isPremium?: boolean;
}

const EXPORT_OPTIONS: ExportOption[] = [
    {
        id: 'pdf',
        label: 'PDF',
        description: 'Format le plus courant, idéal pour les candidatures',
        icon: FileText,
        isPremium: false
    },
    {
        id: 'docx',
        label: 'Word (DOCX)',
        description: 'Modifiable dans Microsoft Word ou Google Docs',
        icon: FileSpreadsheet,
        isPremium: false
    },
    {
        id: 'txt',
        label: 'Texte brut',
        description: 'Format simple, compatible avec tous les systèmes ATS',
        icon: FileText,
        isPremium: false
    },
    {
        id: 'json',
        label: 'JSON',
        description: 'Sauvegarde des données pour import/export',
        icon: FileCode,
        isPremium: false
    }
];

export default function ExportPanel({
    cvData,
    previewElementId,
    filename = 'cv',
    isDark = false
}: ExportPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportSuccess, setExportSuccess] = useState<ExportFormat | null>(null);
    const [exportError, setExportError] = useState<string | null>(null);

    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
    const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

    const handleExport = async (format: ExportFormat) => {
        setIsExporting(format);
        setExportProgress(0);
        setExportError(null);
        setExportSuccess(null);

        try {
            switch (format) {
                case 'pdf':
                    await generatePDFWithProgress(
                        previewElementId,
                        setExportProgress,
                        { filename: `${filename}.pdf` }
                    );
                    break;

                case 'docx':
                    await exportDOCX(cvData, { filename: `${filename}.docx` });
                    break;

                case 'txt':
                    exportTXT(cvData, { filename: `${filename}.txt` });
                    break;

                case 'json':
                    exportJSON(cvData, { filename: `${filename}.json` });
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
                <span className="font-medium">Exporter</span>
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
                            <h3 className={`font-semibold ${textColor}`}>Exporter votre CV</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Choisissez un format d'export
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

                                        <div className="flex-1 text-left">
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
                                💡 Conseil: Le format PDF est recommandé pour les candidatures en ligne.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
