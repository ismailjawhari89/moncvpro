
import React, { useState } from 'react';
import { AICVTemplate, PhotoPosition } from '@/data/ai-templates/ai-templates';
import { TemplateRenderer } from '@/templates/components/TemplateRenderer';
import { Eye, Sparkles, UserCircle, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AITemplatePreviewProps {
    template: AICVTemplate;
    onSelect: () => void;
    onPreview: () => void;
    locale?: string;
    width?: number; // Target width
    variant?: 'compact' | 'full';
}

export const AITemplatePreview: React.FC<AITemplatePreviewProps> = ({
    template,
    onSelect,
    onPreview,
    locale = 'en',
    width = 300,
    variant = 'compact'
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isRTL = locale === 'ar';
    const t = useTranslations('templates');

    // A4 dimensions
    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;

    // Badge Colors
    const getLayoutBadgeColor = (layout: string) => {
        switch (layout) {
            case 'modern': return 'bg-blue-100 text-blue-700';
            case 'creative': return 'bg-pink-100 text-pink-700';
            case 'executive': return 'bg-slate-100 text-slate-700';
            case 'academic': return 'bg-purple-100 text-purple-700';
            case 'technical': return 'bg-cyan-100 text-cyan-700';
            case 'classic': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Full Preview using TemplateRenderer (for modal)
    if (variant === 'full') {
        const scale = width / A4_WIDTH;

        return (
            <div
                className="bg-white shadow-2xl rounded-sm overflow-hidden"
                style={{ width }}
            >
                <div
                    style={{
                        width: A4_WIDTH,
                        zoom: scale,
                    }}
                >
                    <TemplateRenderer
                        templateId={template.id}
                        data={template.exampleData}
                        locale={locale}
                    />
                </div>
            </div>
        );
    }

    // Compact Preview - Uses actual TemplateRenderer scaled down
    const previewScale = (width - 16) / A4_WIDTH; // Account for padding
    const previewHeight = A4_HEIGHT * previewScale * 0.85; // Slightly crop bottom

    return (
        <div
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col"
            style={{ width }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Real Template Preview using TemplateRenderer */}
            <div
                className="relative w-full bg-white overflow-hidden cursor-pointer"
                style={{ height: previewHeight }}
                onClick={onPreview}
            >
                {/* Scaled Template Renderer */}
                <div
                    className={`${isRTL ? 'origin-top-right' : 'origin-top-left'} pointer-events-none`}
                    style={{
                        width: A4_WIDTH,
                        transform: `scale(${previewScale})`,
                        transformOrigin: isRTL ? 'top right' : 'top left'
                    }}
                >
                    <TemplateRenderer
                        templateId={template.id}
                        data={template.exampleData}
                        locale={locale}
                    />
                </div>

                {/* Gradient Fade at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end justify-center pb-4 gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onPreview(); }}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2"
                    >
                        <Eye size={16} />
                        {t('actions.preview')}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onSelect(); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
                    >
                        <Sparkles size={16} />
                        {t('actions.use')}
                    </button>
                </div>
            </div>

            {/* Template Info Footer */}
            <div className="p-3 bg-white dark:bg-gray-800 flex flex-col gap-2 border-t border-gray-100 dark:border-gray-700">
                {/* Title Row */}
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">
                            {template.name[locale as 'en' | 'fr' | 'ar'] || template.name.en}
                        </h3>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                            {(template.description[locale as 'en' | 'fr' | 'ar'] || template.description.en)?.substring(0, 50)}...
                        </p>
                    </div>
                    {/* ATS Score Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shrink-0 ${template.atsScore >= 95 ? 'bg-green-100 text-green-700' :
                        template.atsScore >= 90 ? 'bg-emerald-100 text-emerald-700' :
                            template.atsScore >= 85 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-orange-100 text-orange-700'
                        }`}>
                        <ShieldCheck size={12} />
                        {template.atsScore}%
                    </div>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getLayoutBadgeColor(template.design.layout)} uppercase tracking-wide`}>
                        {t(`designStyles.${template.design.layout}`)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
                        <UserCircle size={10} />
                        {t(`photoPositions.${template.photoPosition.replace('-', '').replace('_', '').replace(' ', '').toLowerCase().replace('topleft', 'topLeft').replace('topright', 'topRight').replace('leftsidebar', 'sidebar').replace('rightsidebar', 'sidebar').replace('nophoto', 'noPhoto')}`)}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full mt-1">
                    <button
                        onClick={onPreview}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all flex justify-center items-center gap-1.5"
                    >
                        <Eye size={14} />
                        {t('actions.preview')}
                    </button>
                    <button
                        onClick={onSelect}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm flex justify-center items-center gap-1.5"
                    >
                        <Sparkles size={14} />
                        {t('actions.use')}
                    </button>
                </div>
            </div>
        </div>
    );
};
