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

export default function AIResumeReviewPage() {
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleAnalyze = async (file: File | null, text: string) => {
        setIsAnalyzing(true);
        try {
            // Simulate API call
            await simulateAnalysis();
            setIsAnalyzing(false);
            setShowResults(true);
            // Scroll to results
            const resultsElement = document.getElementById('results-section');
            resultsElement?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Analysis failed:', error);
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

                {/* Floating Elements Animation */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-medium mb-8 animate-fade-in-up">
                        <Zap size={16} className="text-yellow-400" />
                        <span>50,000+ CVs Analyzed • 98% Accuracy</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight animate-fade-in-up delay-100">
                        Get AI-Powered Resume<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Feedback in 60 Seconds
                        </span>
                    </h1>

                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200">
                        Our AI analyzes your CV for ATS compatibility, keywords, and formatting issues.
                        Upload your CV now - it&apos;s completely free.
                    </p>

                    {/* Upload Section */}
                    <div className="animate-fade-in-up delay-300 relative z-20">
                        <UploadSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                    </div>

                    <p className="mt-6 text-sm text-blue-300 flex items-center justify-center gap-2 animate-fade-in-up delay-400">
                        <Shield size={14} />
                        Your data is secure and private. We don&apos;t share your CV with anyone.
                    </p>
                </div>
            </section>

            {/* Results Preview Section (Conditional) */}
            {showResults && (
                <section id="results-section" className="py-20 bg-white relative z-10 -mt-20 pt-32">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Analysis Results</h2>
                            <p className="text-gray-600">Here's a preview of what our AI found in your resume.</p>
                        </div>
                        <ResultsPreview />
                    </div>
                </section>
            )}

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Three simple steps to a better resume and more interviews.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10"></div>

                        {[
                            {
                                step: 1,
                                title: "Upload or Paste",
                                desc: "Upload your PDF/DOCX resume or paste the text directly.",
                                icon: <FileText size={32} className="text-blue-600" />
                            },
                            {
                                step: 2,
                                title: "AI Analysis",
                                desc: "Our AI scans your CV for 50+ checks including ATS & keywords.",
                                icon: <Search size={32} className="text-purple-600" />
                            },
                            {
                                step: 3,
                                title: "Get Results",
                                desc: "Receive a detailed score and actionable tips to improve.",
                                icon: <CheckCircle size={32} className="text-green-600" />
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center bg-white p-6 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 relative">
                                    {item.icon}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.desc}
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use Our AI Checker?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comprehensive analysis features designed to help you beat the ATS and impress recruiters.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "ATS Compatibility Score",
                                desc: "Check if your resume can be parsed by Applicant Tracking Systems.",
                                icon: <Target className="text-blue-600" size={24} />,
                                color: "bg-blue-50"
                            },
                            {
                                title: "Keyword Optimization",
                                desc: "Find missing keywords that are crucial for your target job role.",
                                icon: <Search className="text-purple-600" size={24} />,
                                color: "bg-purple-50"
                            },
                            {
                                title: "Grammar & Style",
                                desc: "Identify grammar errors, typos, and passive voice usage.",
                                icon: <CheckCircle className="text-green-600" size={24} />,
                                color: "bg-green-50"
                            },
                            {
                                title: "Formatting Analysis",
                                desc: "Ensure your layout, margins, and fonts are professional.",
                                icon: <Layout className="text-orange-600" size={24} />,
                                color: "bg-orange-50"
                            },
                            {
                                title: "Section Detection",
                                desc: "Verify that you have all essential sections (Summary, Skills, etc.).",
                                icon: <FileText className="text-teal-600" size={24} />,
                                color: "bg-teal-50"
                            },
                            {
                                title: "Industry Tips",
                                desc: "Get specific advice tailored to your job industry and level.",
                                icon: <Award className="text-pink-600" size={24} />,
                                color: "bg-pink-50"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {feature.desc}
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
                        <p className="text-gray-600">
                            See how others landed their dream jobs with MonCVPro.
                        </p>
                    </div>
                    <Testimonials />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600">
                            Everything you need to know about our AI Resume Review.
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
                        Ready to Land More Interviews?
                    </h2>
                    <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
                        Don't let a bad CV hold you back. Upload your resume now and get instant, actionable feedback to improve your chances.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Zap size={20} />
                            Start Free Analysis
                        </button>
                        <button
                            onClick={() => router.push('/cv-builder')}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 border border-blue-700 flex items-center justify-center gap-2"
                        >
                            Explore CV Builder
                            <ArrowRight size={20} />
                        </button>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-6 text-blue-300 text-sm">
                        <span className="flex items-center gap-1"><CheckCircle size={14} /> No credit card required</span>
                        <span className="flex items-center gap-1"><CheckCircle size={14} /> Instant results</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
