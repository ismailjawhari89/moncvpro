'use client';

import React, { useState } from 'react';
import { CoverLetterData } from '@/types/cover-letter';
import { exportAsPDF, exportAsDOCX, exportAsText, copyToClipboard } from '@/utils/cover-letter-export';
import { Download, FileText, Copy, Check, FileType } from 'lucide-react';

interface ExportPanelProps {
    data: CoverLetterData;
    isDark?: boolean;
}

export default function ExportPanel({ data, isDark = false }: ExportPanelProps) {
    const [copied, setCopied] = useState(false);
    const [exporting, setExporting] = useState(false);

    const handleCopy = async () => {
        await copyToClipboard(data);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = async (format: 'pdf' | 'docx' | 'txt') => {
        setExporting(true);
        try {
            if (format === 'pdf') {
                await exportAsPDF(data, { format: 'pdf', pageSize: 'A4', includeHeader: true, includeFooter: true });
            } else if (format === 'docx') {
                await exportAsDOCX(data, { format: 'docx', pageSize: 'A4', includeHeader: true, includeFooter: true });
            } else {
                exportAsText(data);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const buttonClasses = `flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed ${isDark
            ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
            : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
        }`;

    return (
        <div className={`p-6 rounded-xl border shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
            }`}>
            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Export Options
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    onClick={() => handleExport('pdf')}
                    disabled={exporting}
                    className={`${buttonClasses} sm:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none`}
                >
                    <Download size={18} />
                    Download PDF
                </button>

                <button
                    onClick={() => handleExport('docx')}
                    disabled={exporting}
                    className={buttonClasses}
                >
                    <FileType size={18} className="text-blue-600 dark:text-blue-400" />
                    Word (DOCX)
                </button>

                <button
                    onClick={() => handleExport('txt')}
                    disabled={exporting}
                    className={buttonClasses}
                >
                    <FileText size={18} className="text-gray-500" />
                    Plain Text
                </button>

                <button
                    onClick={handleCopy}
                    className={`${buttonClasses} sm:col-span-2`}
                >
                    {copied ? (
                        <>
                            <Check size={18} className="text-green-500" />
                            Copied to Clipboard
                        </>
                    ) : (
                        <>
                            <Copy size={18} className="text-purple-500" />
                            Copy to Clipboard
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
