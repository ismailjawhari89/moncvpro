import React, { useState } from 'react';
// import { FileText, Download } from 'lucide-react'; // Mocking icons
import { CVData } from '../../types/cv';
import { analytics } from '../../services/analytics';

// Mock icons
const FileTextIcon = (props: any) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const DownloadIcon = (props: any) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

interface ExportPanelProps {
    cvData: CVData;
    atsMode?: boolean;
    previewElementId: string;
    template?: string;
    filename?: string;
    isDark?: boolean;
}

type ExportFormat = 'pdf' | 'pdf-hq' | 'pdf-ats' | 'docx' | 'txt' | 'json';

export default function ExportPanel({
    cvData,
    atsMode = false,
    previewElementId,
    template = 'modern-pro',
    filename = 'cv',
    isDark = false
}: ExportPanelProps) {
    const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);
    const [exportMessage, setExportMessage] = useState<string | null>(null);

    // Mock Export Functions (In real app, update these to import from utils)
    // These are placeholders to show logic handling
    const exportPDF = async (elementId: string, isAts: boolean) => {
        console.log('Exporting Standard PDF. Mode:', isAts ? 'ATS' : 'Pro');
        return new Promise(resolve => setTimeout(resolve, 1000));
    };
    const exportPDFHighQuality = async (elementId: string, isAts: boolean) => {
        console.log('Exporting HQ PDF (Pro Mode forced)');
        return new Promise(resolve => setTimeout(resolve, 1500));
    };
    const exportPDFATS = async (elementId: string, isAts: boolean) => {
        console.log('Exporting ATS PDF (ATS Mode forced)');
        return new Promise(resolve => setTimeout(resolve, 1000));
    };

    const handleExport = async (format: ExportFormat) => {
        try {
            setIsExporting(format);
            setExportMessage('Generating...');

            if (format === 'pdf') {
                // Use current mode (respects user's toggle)
                await exportPDF(previewElementId, atsMode);
            } else if (format === 'pdf-hq') {
                // High quality: always use Pro mode (ignore toggle)
                await exportPDFHighQuality(previewElementId, false);
            } else if (format === 'pdf-ats') {
                // ATS optimized: force ATS mode (ignore toggle)
                await exportPDFATS(previewElementId, true);
            } else {
                // Other formats
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            analytics.cvExported(format, template);

            setExportMessage(`Saved as ${filename}.${format}`);
            setTimeout(() => setExportMessage(null), 3000);
        } catch (error) {
            setExportMessage('Export failed');
        } finally {
            setIsExporting(null);
        }
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        background: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        width: '100%',
        justifyContent: 'space-between'
    };

    return (
        <div style={{ padding: '16px', background: isDark ? '#1f2937' : '#f9fafb', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: isDark ? 'white' : '#111827' }}>Export Options</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                {/* PDF Standard */}
                <button onClick={() => handleExport('pdf')} disabled={!!isExporting} style={buttonStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileTextIcon size={18} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 500 }}>Standard PDF</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                {atsMode ? 'ATS-optimized (no images)' : 'Professional layout (full design)'}
                            </div>
                        </div>
                    </div>
                    <DownloadIcon size={16} />
                </button>

                {/* PDF HQ */}
                <button onClick={() => handleExport('pdf-hq')} disabled={!!isExporting} style={buttonStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileTextIcon size={18} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 500 }}>High Quality PDF</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Best for print (Vectors)</div>
                        </div>
                    </div>
                    <DownloadIcon size={16} />
                </button>

                {/* PDF ATS */}
                <button onClick={() => handleExport('pdf-ats')} disabled={!!isExporting} style={buttonStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileTextIcon size={18} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 500 }}>ATS Optimized PDF</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Machine readable format</div>
                        </div>
                    </div>
                    <DownloadIcon size={16} />
                </button>

            </div>

            {exportMessage && (
                <div style={{ marginTop: '12px', fontSize: '13px', color: isExporting ? '#2563eb' : '#059669' }}>
                    {exportMessage}
                </div>
            )}
        </div>
    );
}
