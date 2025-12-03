'use client';

import React, { useState, useEffect } from 'react';
import {
    Download,
    Copy,
    ArrowLeft,
    MapPin,
    Mail,
    Phone,
    Globe,
    Share2
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { cvExamplesService, type CVExample } from '@/services/cvExamplesService';
import Link from 'next/link';

export default function CVExampleSlugPage() {
    const router = useRouter();
    const params = useParams();
    const [example, setExample] = useState<CVExample | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedExamples, setRelatedExamples] = useState<CVExample[]>([]);

    useEffect(() => {
        if (params?.slug) {
            loadExample(params.slug as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.slug]);

    const loadExample = async (slug: string) => {
        setLoading(true);
        try {
            const data = await cvExamplesService.getExampleBySlug(slug);
            if (data) {
                setExample(data);
                const related = await cvExamplesService.getRelatedExamples(slug);
                setRelatedExamples(related);
            } else {
                router.push('/cv-examples');
            }
        } catch (error) {
            console.error('Error loading example:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!example) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/cv-examples"
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">{example.title}</h1>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{example.industry}</span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{example.level}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/cv-builder')}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                        >
                            <Copy size={16} />
                            Use This Template
                        </button>
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Download size={20} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main CV Content (A4 Preview) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-xl rounded-sm min-h-[1000px] p-8 sm:p-12 relative print:shadow-none print:p-0">
                            {/* CV Header */}
                            <div className="border-b-2 border-gray-900 pb-8 mb-8">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{example.content.personalInfo.fullName}</h1>
                                <p className="text-xl text-gray-600 mb-6">{example.content.personalInfo.title}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Mail size={14} />
                                        {example.content.personalInfo.email}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone size={14} />
                                        {example.content.personalInfo.phone}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {example.content.personalInfo.location}
                                    </div>
                                    {example.content.personalInfo.website && (
                                        <div className="flex items-center gap-1">
                                            <Globe size={14} />
                                            {example.content.personalInfo.website}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">
                                    Professional Summary
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {example.content.summary}
                                </p>
                            </div>

                            {/* Experience */}
                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">
                                    Work Experience
                                </h2>
                                <div className="space-y-6">
                                    {example.content.experience.map((exp) => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                                <span className="text-sm text-gray-500 whitespace-nowrap">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            <div className="text-blue-600 font-medium text-sm mb-2">
                                                {exp.company}, {exp.location}
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Education */}
                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">
                                    Education
                                </h2>
                                <div className="space-y-4">
                                    {example.content.education.map((edu) => (
                                        <div key={edu.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                                <span className="text-sm text-gray-500 whitespace-nowrap">
                                                    {edu.startDate} - {edu.endDate}
                                                </span>
                                            </div>
                                            <div className="text-gray-700 text-sm">
                                                {edu.degree}, {edu.location}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Skills & Languages Grid */}
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">
                                        Skills
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {example.content.skills.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">
                                        Languages
                                    </h2>
                                    <ul className="space-y-1">
                                        {example.content.languages.map((lang, index) => (
                                            <li key={index} className="text-gray-700 text-sm flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                                {lang}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* CTA Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                            <h3 className="text-xl font-bold mb-2">Like this CV?</h3>
                            <p className="text-blue-100 mb-6 text-sm">
                                Create your own professional CV using this template. It takes less than 10 minutes.
                            </p>
                            <button
                                onClick={() => router.push('/cv-builder')}
                                className="w-full py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-md"
                            >
                                Build My CV Now
                            </button>
                        </div>

                        {/* CV Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">About this Example</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <div className="text-gray-500 mb-1">Industry</div>
                                    <div className="font-medium text-gray-900">{example.industry}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 mb-1">Experience Level</div>
                                    <div className="font-medium text-gray-900">{example.level}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 mb-1">Style</div>
                                    <div className="font-medium text-gray-900">{example.style}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 mb-1">Description</div>
                                    <div className="text-gray-700 leading-relaxed">{example.description}</div>
                                </div>
                            </div>
                        </div>

                        {/* Related Examples */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Related Examples</h3>
                            <div className="space-y-4">
                                {relatedExamples.map((related) => (
                                    <Link
                                        href={`/cv-examples/${related.slug}`}
                                        key={related.id}
                                        className="block bg-white rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg ${related.color} flex-shrink-0`}></div>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm line-clamp-1">
                                                    {related.title}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {related.industry} • {related.level}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
