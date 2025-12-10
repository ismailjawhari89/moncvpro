'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import TemplatePlaceholder from '@/components/TemplatePlaceholder';
import TemplatePreviewModal from '@/components/templates/TemplatePreviewModal';
import { Eye, Sparkles, Star, TrendingUp, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { templates, categories, getTemplatesByCategory, type TemplateCategory, type CVTemplate } from '@/data/templates';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

export default function TemplatesGalleryPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);

    const filteredTemplates = getTemplatesByCategory(selectedCategory).filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUseTemplate = (templateId: string) => {
        router.push(`/cv-builder?template=${templateId}`);
    };

    const handlePreviewTemplate = (template: CVTemplate) => {
        setPreviewTemplate(template);
    };

    // Get top rated templates
    const topTemplates = templates.filter(t => t.atsScore >= 95).slice(0, 3);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            {/* Hero Header */}
            <section className="bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                            <Sparkles size={14} />
                            <span>22 Professional Templates - 100% Free</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Professional CV Templates
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Choose from our curated collection of ATS-optimized templates designed for every industry
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search templates by name or industry..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter Pills */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sticky top-[180px] z-30 bg-gradient-to-br from-gray-50/95 via-blue-50/30 to-purple-50/20 dark:from-gray-900/95 dark:via-gray-900/95 dark:to-gray-900/95 backdrop-blur-sm">
                <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`group px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.id
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:scale-102'
                                }`}
                        >
                            <span className="text-lg">{category.icon}</span>
                            <span>{category.label}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.id
                                ? 'bg-white/20'
                                : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                {getTemplatesByCategory(category.id).length}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Top Rated Templates Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Star className="text-amber-500" fill="currentColor" size={24} />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Top Rated - Highest ATS Score
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handlePreviewTemplate(template)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-bold">
                                        <TrendingUp size={14} />
                                        {template.atsScore}%
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUseTemplate(template.id);
                                    }}
                                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Use This Template
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedCategory === 'all' ? 'All Templates' : categories.find(c => c.id === selectedCategory)?.label}
                        <span className="text-gray-500 dark:text-gray-400 ml-2 text-lg font-normal">
                            ({filteredTemplates.length} templates)
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTemplates.map((template, index) => (
                        <div
                            key={template.id}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
                            style={{ animationDelay: `${index * 30}ms` }}
                            onClick={() => handlePreviewTemplate(template)}
                        >
                            {/* Template Preview */}
                            <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                {template.usePlaceholder ? (
                                    <TemplatePlaceholder
                                        name={template.name}
                                        category={template.category[0]}
                                        atsScore={template.atsScore}
                                        colors={template.colors}
                                    />
                                ) : (
                                    <Image
                                        src={template.previewImage}
                                        alt={template.altText || template.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        priority={index < 4}
                                    />
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-3 px-4 w-full">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePreviewTemplate(template);
                                            }}
                                            className="w-full px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <Eye size={18} />
                                            Preview
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUseTemplate(template.id);
                                            }}
                                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <Sparkles size={18} />
                                            Use Template
                                        </button>
                                        <div className="text-white text-center text-sm mt-2">
                                            ATS Score: <span className="font-bold text-green-400">{template.atsScore}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Premium/Free Badge */}
                                {!template.isPremium && (
                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                        <Sparkles size={12} />
                                        FREE
                                    </div>
                                )}

                                {/* ATS Score Badge */}
                                {template.atsScore >= 90 && (
                                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                        <TrendingUp size={12} />
                                        {template.atsScore}%
                                    </div>
                                )}
                            </div>

                            {/* Template Info */}
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                    {template.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                    {template.description}
                                </p>

                                {/* Features Pills */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {template.features.slice(0, 2).map((feature) => (
                                        <span
                                            key={feature}
                                            className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                {/* Use Template Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUseTemplate(template.id);
                                    }}
                                    className="w-full py-2.5 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md"
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
                        <Eye className="mx-auto mb-4 text-gray-400 dark:text-gray-600" size={64} />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No templates found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your search or filter
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </section>

            {/* Bottom CTA */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 border-t border-blue-500">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        Can't decide? Start with our most popular template
                    </h2>
                    <p className="text-blue-100 mb-6 text-lg">
                        The Modern Developer template is loved by thousands of users
                    </p>
                    <button
                        onClick={() => handleUseTemplate('tech-modern-developer')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <Sparkles size={20} />
                        Start with Modern Developer
                    </button>
                </div>
            </section>

            {/* Preview Modal */}
            <TemplatePreviewModal
                template={previewTemplate}
                isOpen={!!previewTemplate}
                onClose={() => setPreviewTemplate(null)}
                onUseTemplate={handleUseTemplate}
            />

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ItemList',
                        itemListElement: templates.map((template, index) => ({
                            '@type': 'ListItem',
                            position: index + 1,
                            item: {
                                '@type': 'Product',
                                name: template.name,
                                description: template.metaDescription || template.description,
                                image: template.previewImage,
                                offers: {
                                    '@type': 'Offer',
                                    price: '0',
                                    priceCurrency: 'USD',
                                    availability: 'https://schema.org/InStock',
                                },
                            },
                        })),
                    }),
                }}
            />
        </div>
    );
}
