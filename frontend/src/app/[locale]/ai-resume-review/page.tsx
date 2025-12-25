'use client';

import React, { useState } from 'react';
import {
    CheckCircle,
    Zap,
    Shield,
    ArrowRight,
    FileText,
    Target,
    Layout,
    Search,
    Award,
    Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import UploadSection from '@/components/ai-resume-review/UploadSection';
import ResultsPreview from '@/components/ai-resume-review/ResultsPreview';
import Testimonials from '@/components/ai-resume-review/Testimonials';
import FAQAccordion from '@/components/ai-resume-review/FAQAccordion';
import { simulateAnalysis } from '@/utils/resume-upload';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

import { useTranslations } from 'next-intl';

export default function AIResumeReviewPage() {
    const t = useTranslations('ai-resume-review');
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleAnalyze = async (file: File | null, text: string) => {
        setIsAnalyzing(true);
        try {
            await simulateAnalysis();
            setIsAnalyzing(false);
            setShowResults(true);
            const resultsElement = document.getElementById('results-section');
            resultsElement?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Analysis failed:', error);
            setIsAnalyzing(false);
        }
    };

    const steps = t.raw('howItWorks.steps') as Record<string, { title: string; description: string }>;
    const stepItems = [
        { key: '1', icon: <FileText size={32} className="text-blue-600" /> },
        { key: '2', icon: <Search size={32} className="text-purple-600" /> },
        { key: '3', icon: <CheckCircle size={32} className="text-green-600" /> }
    ];

    const featureItems = [
        { key: 'ats', icon: <Target className="text-blue-600" size={24} />, color: "bg-blue-50" },
        { key: 'keywords', icon: <Search className="text-purple-600" size={24} />, color: "bg-purple-50" },
        { key: 'grammar', icon: <CheckCircle className="text-green-600" size={24} />, color: "bg-green-50" },
        { key: 'formatting', icon: <Layout className="text-orange-600" size={24} />, color: "bg-orange-50" },
        { key: 'sections', icon: <FileText className="text-teal-600" size={24} />, color: "bg-teal-50" },
        { key: 'tips', icon: <Award className="text-pink-600" size={24} />, color: "bg-pink-50" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

                <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-medium mb-8 animate-fade-in-up">
                        <Zap size={16} className="text-yellow-400" />
                        <span>{t('hero.stats')}</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight animate-fade-in-up delay-100">
                        {t('hero.title').split('&')[0]}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            {t('hero.title').includes('&') ? `& ${t('hero.title').split('&')[1]}` : ''}
                        </span>
                    </h1>

                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200">
                        {t('hero.subtitle')}
                    </p>

                    {/* Upload Section */}
                    <div className="animate-fade-in-up delay-300 relative z-20">
                        <UploadSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                    </div>

                    <p className="mt-6 text-sm text-blue-300 flex items-center justify-center gap-2 animate-fade-in-up delay-400">
                        <Shield size={14} />
                        {t('hero.privacyNote')}
                    </p>
                </div>
            </section>

            {/* Results Preview Section (Conditional) */}
            {showResults && (
                <section id="results-section" className="py-20 bg-white relative z-10 -mt-20 pt-32">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('results.title')}</h2>
                            <p className="text-gray-600">{t('results.subtitle')}</p>
                        </div>
                        <ResultsPreview />
                    </div>
                </section>
            )}

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {t('howItWorks.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10"></div>

                        {stepItems.map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center bg-white p-6 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 relative">
                                    {item.icon}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">
                                        {i + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{steps[item.key].title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {steps[item.key].description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Features Grid */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('features.title')}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {t('features.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featureItems.map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{t(`features.items.${feature.key}.title`)}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {t(`features.items.${feature.key}.desc`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('testimonials.title')}</h2>
                        <p className="text-gray-600">
                            {t('testimonials.subtitle')}
                        </p>
                    </div>
                    <Testimonials />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('faq.title')}</h2>
                        <p className="text-gray-600">
                            {t('faq.subtitle')}
                        </p>
                    </div>
                    <FAQAccordion />
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-blue-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
                        {t('cta.description')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Zap size={20} />
                            {t('cta.button')}
                        </button>
                        <button
                            onClick={() => router.push('/cv-builder')}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 border border-blue-700 flex items-center justify-center gap-2"
                        >
                            {t('cta.cvBuilder')}
                            <ArrowRight size={20} />
                        </button>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-6 text-blue-300 text-sm">
                        <span className="flex items-center gap-1"><CheckCircle size={14} /> {t('cta.noCreditCard')}</span>
                        <span className="flex items-center gap-1"><CheckCircle size={14} /> {t('cta.instantResults')}</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
