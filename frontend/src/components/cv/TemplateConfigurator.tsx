'use client';

import { useState } from 'react';
import {
    Palette,
    Type,
    Layout,
    Check,
    Crown,
    ChevronDown,
    ChevronUp,
    Eye,
    Sparkles
} from 'lucide-react';
import {
    TEMPLATES,
    TemplateId,
    TemplateCustomizations,
    COLOR_PRESETS,
    FONT_FAMILIES,
    getTemplateConfig
} from './templates';
import { useTranslations } from 'next-intl';

interface TemplateConfiguratorProps {
    selectedTemplate: TemplateId;
    customizations: Partial<TemplateCustomizations>;
    onTemplateChange: (templateId: TemplateId) => void;
    onCustomizationChange: (customizations: Partial<TemplateCustomizations>) => void;
    isPremiumUser?: boolean;
    isDark?: boolean;
}

export default function TemplateConfigurator({
    selectedTemplate,
    customizations,
    onTemplateChange,
    onCustomizationChange,
    isPremiumUser = false,
    isDark = false
}: TemplateConfiguratorProps) {
    const t = useTranslations('cvBuilder.templateConfig');
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'templates' | 'colors' | 'fonts' | 'spacing'>('templates');

    const currentConfig = getTemplateConfig(selectedTemplate);

    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
    const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

    const handleColorChange = (color: string) => {
        onCustomizationChange({ ...customizations, primaryColor: color });
    };

    const handleFontChange = (font: TemplateCustomizations['fontFamily']) => {
        onCustomizationChange({ ...customizations, fontFamily: font });
    };

    const handleSpacingChange = (spacing: TemplateCustomizations['spacing']) => {
        onCustomizationChange({ ...customizations, spacing });
    };

    const tabs = [
        { id: 'templates', label: t('tabs.templates'), icon: Layout },
        { id: 'colors', label: t('tabs.colors'), icon: Palette },
        { id: 'fonts', label: t('tabs.fonts'), icon: Type },
        { id: 'spacing', label: t('tabs.spacing'), icon: Eye }
    ] as const;

    return (
        <div className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden shadow-lg`}>
            {/* Header - Always visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full flex items-center justify-between p-4 ${hoverBg} transition-colors`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform hover:scale-105"
                        style={{ backgroundColor: customizations.primaryColor || currentConfig.defaultCustomizations.primaryColor }}
                    >
                        <Palette className="text-white" size={20} />
                    </div>
                    <div className="text-left rtl:text-right">
                        <h3 className={`font-semibold ${textColor}`}>
                            {currentConfig.name}
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {t('clickToCustomize')}
                        </p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className={isDark ? 'text-gray-400' : 'text-gray-500'} size={20} />
                ) : (
                    <ChevronDown className={isDark ? 'text-gray-400' : 'text-gray-500'} size={20} />
                )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className={`border-t ${borderColor}`}>
                    {/* Tabs */}
                    <div className={`flex border-b ${borderColor}`}>
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-xs font-medium transition-colors ${isActive
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                                        : isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={14} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                        {/* Templates Tab */}
                        {activeTab === 'templates' && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {Object.values(TEMPLATES).map(template => {
                                    const isSelected = selectedTemplate === template.id;
                                    const isLocked = template.isPremium && !isPremiumUser;

                                    return (
                                        <button
                                            key={template.id}
                                            onClick={() => !isLocked && onTemplateChange(template.id)}
                                            disabled={isLocked}
                                            className={`relative p-3 rounded-lg border-2 transition-all ${isSelected
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : isLocked
                                                    ? `${borderColor} opacity-60 cursor-not-allowed`
                                                    : `${borderColor} ${hoverBg}`
                                                } hover:shadow-md`}
                                        >
                                            <div
                                                className="w-full aspect-[3/4] rounded mb-2 flex items-center justify-center transition-transform group-hover:scale-105"
                                                style={{
                                                    backgroundColor: template.defaultCustomizations.primaryColor,
                                                    opacity: 0.1
                                                }}
                                            >
                                                <Layout
                                                    size={24}
                                                    style={{ color: template.defaultCustomizations.primaryColor }}
                                                />
                                            </div>

                                            <p className={`text-xs font-medium ${textColor} truncate`}>
                                                {template.name}
                                            </p>

                                            {template.isPremium && (
                                                <div className="absolute top-2 right-2">
                                                    <Crown
                                                        size={14}
                                                        className={isLocked ? 'text-yellow-500' : 'text-yellow-600'}
                                                    />
                                                </div>
                                            )}

                                            {isSelected && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <Check size={12} className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Colors Tab */}
                        {activeTab === 'colors' && (
                            <div className="space-y-4">
                                <div>
                                    <label className={`text-sm font-medium ${textColor} mb-2 block rtl:text-right`}>
                                        {t('colors.primary')}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {COLOR_PRESETS.map(color => (
                                            <button
                                                key={color.value}
                                                onClick={() => handleColorChange(color.value)}
                                                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${customizations.primaryColor === color.value
                                                    ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-lg scale-110'
                                                    : isDark ? 'border-gray-600 shadow' : 'border-white shadow'
                                                    }`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className={`text-sm font-medium ${textColor} mb-2 block rtl:text-right`}>
                                        {t('colors.custom')}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-10 overflow-hidden rounded-lg">
                                            <input
                                                type="color"
                                                value={customizations.primaryColor || '#3b82f6'}
                                                onChange={(e) => handleColorChange(e.target.value)}
                                                className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={customizations.primaryColor || ''}
                                            onChange={(e) => handleColorChange(e.target.value)}
                                            className={`flex-1 px-3 py-2 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-200 focus:border-blue-500'} ${textColor}`}
                                            placeholder={t('colors.placeholder')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fonts Tab */}
                        {activeTab === 'fonts' && (
                            <div className="space-y-2">
                                {(Object.keys(FONT_FAMILIES) as TemplateCustomizations['fontFamily'][]).map(fontKey => (
                                    <button
                                        key={fontKey}
                                        onClick={() => handleFontChange(fontKey)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${customizations.fontFamily === fontKey
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                            : `${borderColor} ${hoverBg}`
                                            }`}
                                    >
                                        <span
                                            className={`${textColor}`}
                                            style={{ fontFamily: FONT_FAMILIES[fontKey] }}
                                        >
                                            {t(`fonts.${fontKey}`)}
                                        </span>
                                        {customizations.fontFamily === fontKey && (
                                            <Check size={16} className="text-blue-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Spacing Tab */}
                        {activeTab === 'spacing' && (
                            <div className="space-y-2">
                                {(['compact', 'normal', 'spacious'] as TemplateCustomizations['spacing'][]).map(spacing => (
                                    <button
                                        key={spacing}
                                        onClick={() => handleSpacingChange(spacing)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${customizations.spacing === spacing
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                            : `${borderColor} ${hoverBg}`
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-0.5 min-w-[24px]">
                                                {[...Array(spacing === 'compact' ? 2 : spacing === 'normal' ? 3 : 4)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-1 h-4 rounded transition-colors ${customizations.spacing === spacing ? 'bg-blue-500' : isDark ? 'bg-gray-500' : 'bg-gray-400'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={textColor}>
                                                {t(`spacing.${spacing}`)}
                                            </span>
                                        </div>
                                        {customizations.spacing === spacing && (
                                            <Check size={16} className="text-blue-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Premium Upsell */}
                    {!isPremiumUser && (
                        <div className={`p-4 border-t ${borderColor} bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-yellow-900/40 rounded-lg shadow-sm">
                                    <Sparkles className="text-yellow-600" size={20} />
                                </div>
                                <div className="flex-1 text-left rtl:text-right">
                                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                        {t('premium.title')}
                                    </p>
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                        {t('premium.subtitle')}
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95">
                                    {t('premium.upgrade')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
