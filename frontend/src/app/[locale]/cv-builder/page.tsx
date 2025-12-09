'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, FileText } from 'lucide-react';

// Dynamically import the new unified CVBuilder
const CVBuilder = dynamic(() => import('@/components/cv/CVBuilder'), {
    loading: () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="mb-6 inline-block p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl animate-pulse">
                    <FileText className="text-white" size={64} />
                </div>
                <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Loading CV Builder...
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Preparing your professional CV editor with AI assistance
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    ),
    ssr: false, // Disable SSR for this component as it uses client-side features
});

/**
 * CV Builder Page
 * 
 * Unified CV Builder with 3-column layout, sticky preview, and AI assistance
 * 
 * Features:
 * - Real-time preview that stays visible
 * - Auto-save every 30 seconds
 * - AI Assistant integration
 * - All buttons functional with feedback
 * - Dark mode support
 * - Responsive design
 * - Design System integration
 * 
 * URL Parameters:
 * - ?template={templateId} - Start with specific template from templates page
 */
export default function CVBuilderPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="mb-6 inline-block p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl animate-pulse">
                            <FileText className="text-white" size={64} />
                        </div>
                        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Loading CV Builder...
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Preparing your professional CV editor
                        </p>
                    </div>
                </div>
            }
        >
            <CVBuilder />
        </Suspense>
    );
}
