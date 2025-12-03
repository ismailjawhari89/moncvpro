'use client';

import React, { useState } from 'react';
import { CheckCircle, Eye, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ThemeMode = 'light' | 'dark';
type TemplateCategory = 'all' | 'modern' | 'minimalist' | 'creative' | 'professional';

interface Template {
    id: string;
    name: string;
    category: TemplateCategory[];
    preview: string;
    isPremium?: boolean;
}

export default function TemplatesGalleryPage() {
    const router = useRouter();
    const [theme] = useState<ThemeMode>('light');
    const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');

    const isDark = theme === 'dark';

    const templates: Template[] = [
        {
            id: 'modern',
            name: 'Modern Professional',
            category: ['modern', 'professional'],
            preview: '/templates/modern-preview.png'
        },
        {
            id: 'classic',
            name: 'Classic Elegance',
            category: ['professional', 'minimalist'],
            preview: '/templates/classic-preview.png'
        },
        {
            id: 'creative',
            name: 'Creative Bold',
            category: ['creative', 'modern'],
            preview: '/templates/creative-preview.png',
            isPremium: false
        },
        {
            id: 'minimalist',
            name: 'Minimalist Clean',
            category: ['minimalist', 'modern'],
            preview: '/templates/minimalist-preview.png'
        },
        {
            id: 'executive',
            name: 'Executive Pro',
            category: ['professional'],
            preview: '/templates/executive-preview.png'
        },
        {
            id: 'designer',
            name: 'Designer Portfolio',
            category: ['creative'],
            preview: '/templates/designer-preview.png'
        }
    ];

    const categories = [
        { id: 'all' as TemplateCategory, label: 'All Templates' },
        { id: 'modern' as TemplateCategory, label: 'Modern' },
        { id: 'minimalist' as TemplateCategory, label: 'Minimalist' },
        { id: 'creative' as TemplateCategory, label: 'Creative' },
        { id: 'professional' as TemplateCategory, label: 'Professional' }
    ];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category.includes(selectedCategory));

    const handleUseTemplate = (templateId: string) => {
        router.push(`/cv-builder?template=${templateId}`);
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            {/* Header */}
            <section className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40 backdrop-blur-md bg-opacity-90`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                            Professional CV Templates
                        </h1>
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Choose from our collection of ATS-friendly templates — all free
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${selectedCategory === category.id
                                ? isDark
                                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                                    : 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-200'
                                : isDark
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Templates Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTemplates.map((template, index) => (
                        <div
                            key={template.id}
                            className={`group relative ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Template Preview */}
                            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                                {/* Placeholder for template preview */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`text-center p-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                        <Eye size={48} className="mx-auto mb-4" />
                                        <p className="text-sm font-medium">{template.name}</p>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                        <button
                                            onClick={() => handleUseTemplate(template.id)}
                                            className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
                                        >
                                            <Eye size={18} />
                                            Preview
                                        </button>
                                    </div>
                                </div>

                                {/* Premium Badge */}
                                {template.isPremium && (
                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                        <Sparkles size={12} />
                                        FREE
                                    </div>
                                )}



                                {/* Zoom Effect on Hover */}
                                <div className="absolute inset-0 transform group-hover:scale-105 transition-transform duration-500" />
                            </div>

                            {/* Template Info */}
                            <div className="p-4">
                                <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {template.name}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {template.category.slice(0, 2).map((cat) => (
                                        <span
                                            key={cat}
                                            className={`text-xs px-2 py-1 rounded-full ${isDark
                                                ? 'bg-blue-900/50 text-blue-400'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleUseTemplate(template.id)}
                                    className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300 ${isDark
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    Use This Template
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-16">
                        <Eye className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} size={64} />
                        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                            No templates found
                        </h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Try selecting a different category
                        </p>
                    </div>
                )}
            </section>

            {/* Bottom CTA */}
            <section className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t py-12`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Can&apos;t decide? Start with our most popular template
                    </h2>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                        The Modern Professional template is loved by thousands of users
                    </p>
                    <button
                        onClick={() => handleUseTemplate('modern')}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Start with Modern Template
                    </button>
                </div>
            </section>
        </div>
    );
}
