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
    Share2,
    CheckCircle,
    Star,
    Zap,
    Linkedin,
    ChevronRight,
    Printer
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

    const handleUseTemplate = () => {
        // Redirect to builder with template pre-selected
        // In a real app, we might pass the template ID or style
        router.push(`/cv-builder?template=${example?.style.toLowerCase()}`);
    };

    const handlePrint = () => {
        window.print();
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
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <ChevronRight size={16} className="mx-2" />
                        <Link href="/cv-examples" className="hover:text-blue-600">CV Examples</Link>
                        <ChevronRight size={16} className="mx-2" />
                        <span className="text-gray-900 font-medium truncate">{example.title}</span>
                    </nav>
                </div>
            </div>

            {/* Sticky Header for Mobile/Tablet Actions */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm lg:hidden">
                <div className="px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/cv-examples"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <button
                        onClick={handleUseTemplate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                        <Copy size={16} />
                        Use Template
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main CV Content (A4 Preview) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white shadow-xl rounded-sm min-h-[1000px] p-8 sm:p-12 relative print:shadow-none print:p-0 print:m-0">
                            {/* CV Header */}
                            <div className="border-b-2 border-gray-900 pb-8 mb-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{example.content.personalInfo.fullName}</h1>
                                        <p className="text-xl text-gray-600 mb-4">{example.content.personalInfo.title}</p>
                                    </div>
                                    {/* QR Code Placeholder for modern styles */}
                                    {example.style === 'Modern' && (
                                        <div className="hidden sm:block w-20 h-20 bg-gray-100 rounded-lg"></div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
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
                                    {example.content.personalInfo.linkedin && (
                                        <div className="flex items-center gap-1">
                                            <Linkedin size={14} />
                                            {example.content.personalInfo.linkedin.replace('https://', '')}
                                        </div>
                                    )}
                                    {example.content.personalInfo.website && (
                                        <div className="flex items-center gap-1">
                                            <Globe size={14} />
                                            {example.content.personalInfo.website.replace('https://', '')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
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
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                                <h3 className="font-bold text-gray-900 text-lg">{exp.title}</h3>
                                                <span className="text-sm text-gray-500 whitespace-nowrap font-medium">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            <div className="text-blue-600 font-medium text-sm mb-3">
                                                {exp.company}, {exp.location}
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                                {exp.description}
                                            </p>
                                            {exp.achievements && (
                                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                                                    {exp.achievements.map((achievement, i) => (
                                                        <li key={i}>{achievement}</li>
                                                    ))}
                                                </ul>
                                            )}
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
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">
                                        Skills
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {example.content.skills.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">
                                        Languages
                                    </h2>
                                    <ul className="space-y-2">
                                        {example.content.languages.map((lang, index) => (
                                            <li key={index} className="text-gray-700 text-sm flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                {lang}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Actions Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Use This Template</h3>

                            <button
                                onClick={handleUseTemplate}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all mb-3 flex items-center justify-center gap-2"
                            >
                                <Copy size={18} />
                                Build My CV
                            </button>

                            <button
                                onClick={handlePrint}
                                className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors mb-6 flex items-center justify-center gap-2"
                            >
                                <Printer size={18} />
                                Print / Download PDF
                            </button>

                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">ATS Score</span>
                                    <span className="font-bold text-green-600 flex items-center gap-1">
                                        <CheckCircle size={14} />
                                        {example.atsScore}/100
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Style</span>
                                    <span className="font-medium text-gray-900">{example.style}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Level</span>
                                    <span className="font-medium text-gray-900">{example.level}</span>
                                </div>
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                                <Zap size={18} className="text-blue-600" />
                                Key Features
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-blue-800">
                                    <CheckCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                    Optimized for ATS tracking systems
                                </li>
                                <li className="flex gap-3 text-sm text-blue-800">
                                    <CheckCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                    Professional {example.style.toLowerCase()} layout
                                </li>
                                <li className="flex gap-3 text-sm text-blue-800">
                                    <CheckCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                    Clear hierarchy for readability
                                </li>
                            </ul>
                        </div>

                        {/* AdSense Slot */}
                        <div className="bg-gray-100 rounded-xl border border-gray-200 p-4 flex items-center justify-center min-h-[250px]">
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Advertisement</span>
                        </div>

                        {/* Related Examples */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Related Examples</h3>
                            <div className="space-y-3">
                                {relatedExamples.map((related) => (
                                    <Link
                                        href={`/cv-examples/${related.slug}`}
                                        key={related.id}
                                        className="block bg-white rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-lg ${related.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}>
                                                CV
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                    {related.title}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
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
