'use client';

import React, { useState } from 'react';
import { CoverLetterData } from '@/types/cover-letter';
import { coverLetterTemplates } from '@/data/cover-letter-templates';
import { formatDate } from '@/utils/cover-letter-export';
import { ZoomIn, ZoomOut, Sun, Moon, Download } from 'lucide-react';

interface CoverLetterPreviewProps {
    data: CoverLetterData;
    isDark?: boolean;
}

export default function CoverLetterPreview({ data, isDark = false }: CoverLetterPreviewProps) {
    const [scale, setScale] = useState(100);
    const [darkMode, setDarkMode] = useState(false);

    const template = coverLetterTemplates.find(t => t.id === data.templateId) || coverLetterTemplates[0];
    const styles = template.styles;

    const { personalInfo, companyInfo, content } = data;

    const salutation = companyInfo.hiringManagerName
        ? `Dear ${companyInfo.hiringManagerName},`
        : 'Dear Hiring Manager,';

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 25, 150));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 25, 50));
    };

    const handleDownloadPreview = () => {
        // TODO: Implement screenshot download
        alert('Download preview as PNG - Coming soon!');
    };

    return (
        <div className="flex flex-col h-full">
            {/* Preview Controls */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomOut}
                        disabled={scale <= 50}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Zoom Out"
                    >
                        <ZoomOut size={18} className="text-gray-700 dark:text-gray-300" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[4rem] text-center">
                        {scale}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        disabled={scale >= 150}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Zoom In"
                    >
                        <ZoomIn size={18} className="text-gray-700 dark:text-gray-300" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Toggle Preview Theme"
                    >
                        {darkMode ? (
                            <Sun size={18} className="text-gray-700 dark:text-gray-300" />
                        ) : (
                            <Moon size={18} className="text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                    <button
                        onClick={handleDownloadPreview}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Download Preview as PNG"
                    >
                        <Download size={18} className="text-gray-700 dark:text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-8">
                <div
                    className="mx-auto shadow-2xl transition-all duration-300"
                    style={{
                        transform: `scale(${scale / 100})`,
                        transformOrigin: 'top center',
                        width: '8.5in',
                        minHeight: '11in',
                        backgroundColor: darkMode ? '#1F2937' : 'white',
                        padding: '1in'
                    }}
                >
                    {/* Header */}
                    <div
                        className="pb-4 mb-6"
                        style={{
                            borderBottom: `2px solid ${styles.accentColor}`
                        }}
                    >
                        <h1
                            className="text-2xl font-bold mb-2"
                            style={{
                                color: darkMode ? '#E5E7EB' : styles.headerColor,
                                fontFamily: styles.fontFamily
                            }}
                        >
                            {personalInfo.fullName || 'Your Name'}
                        </h1>
                        <div
                            className="text-sm"
                            style={{
                                color: darkMode ? '#D1D5DB' : styles.textColor,
                                fontFamily: styles.fontFamily
                            }}
                        >
                            {personalInfo.email || 'your.email@example.com'} | {personalInfo.phone || '+1 (555) 123-4567'}
                            {personalInfo.linkedIn && ` | ${personalInfo.linkedIn}`}
                        </div>
                    </div>

                    {/* Date */}
                    <div
                        className="mb-6"
                        style={{
                            color: darkMode ? '#D1D5DB' : styles.textColor,
                            fontFamily: styles.fontFamily,
                            fontSize: styles.fontSize
                        }}
                    >
                        {formatDate()}
                    </div>

                    {/* Recipient */}
                    <div
                        className="mb-6"
                        style={{
                            color: darkMode ? '#D1D5DB' : styles.textColor,
                            fontFamily: styles.fontFamily,
                            fontSize: styles.fontSize
                        }}
                    >
                        {companyInfo.hiringManagerName && (
                            <div className="mb-1">{companyInfo.hiringManagerName}</div>
                        )}
                        <div className="mb-1">{companyInfo.companyName || 'Company Name'}</div>
                        <div>
                            Re: {companyInfo.jobTitle || 'Job Title'}
                            {companyInfo.jobReference && ` (Ref: ${companyInfo.jobReference})`}
                        </div>
                    </div>

                    {/* Salutation */}
                    <div
                        className="mb-4 font-medium"
                        style={{
                            color: darkMode ? '#E5E7EB' : styles.textColor,
                            fontFamily: styles.fontFamily,
                            fontSize: styles.fontSize
                        }}
                    >
                        {salutation}
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            color: darkMode ? '#D1D5DB' : styles.textColor,
                            fontFamily: styles.fontFamily,
                            fontSize: styles.fontSize,
                            lineHeight: styles.lineHeight
                        }}
                    >
                        {content.introduction && (
                            <p className="text-justify" style={{ marginBottom: styles.spacing }}>
                                {content.introduction}
                            </p>
                        )}
                        {content.bodyParagraph1 && (
                            <p className="text-justify" style={{ marginBottom: styles.spacing }}>
                                {content.bodyParagraph1}
                            </p>
                        )}
                        {content.bodyParagraph2 && (
                            <p className="text-justify" style={{ marginBottom: styles.spacing }}>
                                {content.bodyParagraph2}
                            </p>
                        )}
                        {content.bodyParagraph3 && (
                            <p className="text-justify" style={{ marginBottom: styles.spacing }}>
                                {content.bodyParagraph3}
                            </p>
                        )}
                        {content.closing && (
                            <p className="text-justify" style={{ marginBottom: styles.spacing }}>
                                {content.closing}
                            </p>
                        )}
                        {content.callToAction && (
                            <p className="text-justify" style={{ marginBottom: styles.spacing }}>
                                {content.callToAction}
                            </p>
                        )}
                    </div>

                    {/* Signature */}
                    <div
                        className="mt-8"
                        style={{
                            color: darkMode ? '#E5E7EB' : styles.textColor,
                            fontFamily: styles.fontFamily,
                            fontSize: styles.fontSize
                        }}
                    >
                        <div className="mb-2">Sincerely,</div>
                        <div className="font-bold">{personalInfo.fullName || 'Your Name'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
