// Templates Gallery Component with Lazy Loading
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Eye, Loader2 } from 'lucide-react';
import type { TemplateType } from '@/types/cv';

interface Template {
    id: TemplateType;
    name: string;
    description: string;
    color: string;
    preview: string;
    isPremium?: boolean;
}

interface TemplatesGalleryProps {
    selectedTemplate: TemplateType;
    onTemplateChange: (template: TemplateType) => void;
    isDark?: boolean;
}

const templates: Template[] = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and contemporary design',
        color: 'blue',
        preview: '/templates/modern.png',
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional professional layout',
        color: 'gray',
        preview: '/templates/classic.png',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Bold and eye-catching',
        color: 'purple',
        preview: '/templates/creative.png',
        isPremium: true,
    },
];

export default function TemplatesGallery({ selectedTemplate, onTemplateChange, isDark }: TemplatesGalleryProps) {
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [isVisible, setIsVisible] = useState(false);
    const galleryRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (galleryRef.current) {
            observer.observe(galleryRef.current);
        }

        return () => {
            if (galleryRef.current) {
                observer.unobserve(galleryRef.current);
            }
        };
    }, []);

    const handleImageLoad = (templateId: string) => {
        setLoadedImages((prev) => new Set(prev).add(templateId));
    };

    const handleTemplateSelect = (templateId: TemplateType) => {
        onTemplateChange(templateId);

        // Smooth scroll to top on mobile
        if (window.innerWidth < 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div ref={galleryRef} className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Templates
                </h3>
                <span className={`text-xs font-medium ${isDark ? 'text-blue-400 bg-blue-900/50' : 'text-blue-600 bg-blue-50'} px-2 py-1 rounded-full`}>
                    {templates.length} Available
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`relative group text-left rounded-xl border-2 transition-all overflow-hidden ${selectedTemplate === template.id
                                ? 'border-blue-600 ring-2 ring-blue-100 ring-offset-2'
                                : isDark
                                    ? 'border-gray-700 hover:border-blue-500'
                                    : 'border-gray-200 hover:border-blue-300'
                            }`}
                    >
                        {/* Template Preview */}
                        <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                            {isVisible && (
                                <>
                                    {!loadedImages.has(template.id) && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="animate-spin text-gray-400" size={32} />
                                        </div>
                                    )}
                                    <img
                                        src={template.preview}
                                        alt={template.name}
                                        className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages.has(template.id) ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        onLoad={() => handleImageLoad(template.id)}
                                        loading="lazy"
                                    />
                                </>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex items-center gap-2 text-white">
                                    <Eye size={20} />
                                    <span className="font-medium">Preview</span>
                                </div>
                            </div>

                            {/* Premium Badge */}
                            {template.isPremium && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    PRO
                                </div>
                            )}

                            {/* Selected Badge */}
                            {selectedTemplate === template.id && (
                                <div className="absolute top-2 left-2 bg-blue-600 text-white rounded-full p-1 shadow-lg">
                                    <CheckCircle size={16} fill="currentColor" />
                                </div>
                            )}
                        </div>

                        {/* Template Info */}
                        <div className={`p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                            <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {template.name}
                            </h4>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {template.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Template Tips */}
            <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                    💡 <strong>Tip:</strong> Choose a template that matches your industry. Modern for tech, Classic for corporate, Creative for design roles.
                </p>
            </div>
        </div>
    );
}
