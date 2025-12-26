'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadSection from '@/components/ai-resume-review/UploadSection';
import ResultsPreview from '@/components/ai-resume-review/ResultsPreview';
import Testimonials from '@/components/ai-resume-review/Testimonials';
import FAQAccordion from '@/components/ai-resume-review/FAQAccordion';
import { Sparkles, ShieldCheck, Zap, BarChart3, Clock, Rocket } from 'lucide-react';

export default function AIResumeReviewPage() {
    const t = useTranslations('ai-resume-review');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleAnalyze = async (file: File | null, text: string) => {
        setIsAnalyzing(true);
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsAnalyzing(false);
        setShowResults(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-20 pb-16 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 -skew-y-3 origin-top-left -z-10 transform scale-110 opacity-10"></div>

                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-bounce">
                            <Sparkles size={16} />
                            {t('hero.stats')}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                            {t('hero.title')}
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                            {t('hero.subtitle')}
                        </p>

                        {!showResults && (
                            <div className="flex flex-col items-center gap-4">
                                <UploadSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <ShieldCheck size={14} className="text-green-500" />
                                    {t('hero.privacyNote')}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {showResults && (
                    <section className="py-16 bg-white border-y border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <div className="container mx-auto px-4 max-w-4xl text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('results.title')}</h2>
                            <ResultsPreview />
                        </div>
                    </section>
                )}

                {/* Features / How it works */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
                            <p className="text-gray-600">{t('howItWorks.subtitle')}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
                                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                                        {step}
                                    </div>
                                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                        {step === 1 ? <Rocket size={28} /> : step === 2 ? <Zap size={28} /> : <BarChart3 size={28} />}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{t(`howItWorks.steps.${step}.title`)}</h3>
                                    <p className="text-gray-600">{t(`howItWorks.steps.${step}.description`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <Testimonials />

                {/* FAQ */}
                <FAQAccordion />

                {/* Final CTA */}
                {!showResults && (
                    <section className="py-20 bg-blue-600 text-white">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-3xl md:text-5xl font-black mb-8">{t('cta.title')}</h2>
                            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">{t('cta.description')}</p>
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="px-10 py-5 bg-white text-blue-600 font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-xl"
                            >
                                {t('uploadSection.analyzeButton')}
                            </button>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
