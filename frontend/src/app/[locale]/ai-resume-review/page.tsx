'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Star, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIResumeReviewPage() {
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        startAnalysis();
    };

    const startAnalysis = () => {
        setAnalyzing(true);
        // Simulate analysis delay then redirect to builder
        setTimeout(() => {
            router.push('/cv-builder?action=analyze');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-medium mb-8">
                        <Zap size={16} className="text-yellow-400" />
                        <span>Powered by Advanced AI Models</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                        Is Your CV Good Enough?<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Get Instant AI Feedback
                        </span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
                        Upload your CV and let our AI analyze it against thousands of successful resumes.
                        Get your ATS score and actionable improvements in seconds.
                    </p>

                    {/* Upload Box */}
                    <div
                        className={`max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-dashed p-12 transition-all duration-300 cursor-pointer
                            ${isDragging ? 'border-blue-400 bg-white/10 scale-105' : 'border-white/20 hover:border-white/40'}
                        `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={startAnalysis}
                    >
                        {analyzing ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="animate-spin text-blue-400 mb-4" size={48} />
                                <h3 className="text-2xl font-bold text-white mb-2">Analyzing your CV...</h3>
                                <p className="text-blue-200">Checking ATS compatibility and content quality</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center group">
                                <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Upload className="text-blue-400" size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Drop your CV here</h3>
                                <p className="text-blue-200 mb-6">Supports PDF, DOCX, or TXT</p>
                                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/50">
                                    Select File
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="mt-6 text-sm text-blue-300 flex items-center justify-center gap-2">
                        <Shield size={14} />
                        Your data is secure and private. We don't share your CV with anyone.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                                <CheckCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">ATS Compatibility Check</h3>
                            <p className="text-gray-600">
                                Ensure your CV can be read by Applicant Tracking Systems used by 99% of Fortune 500 companies.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Content Quality Score</h3>
                            <p className="text-gray-600">
                                Get a score based on impact verbs, measurable results, and clarity of your professional experience.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Suggestions</h3>
                            <p className="text-gray-600">
                                Receive personalized recommendations to improve your grammar, formatting, and keyword usage.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">50k+</div>
                            <div className="text-gray-600">CVs Analyzed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">92%</div>
                            <div className="text-gray-600">Interview Rate Increase</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
                            <div className="text-gray-600">User Rating</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-orange-600 mb-2">Free</div>
                            <div className="text-gray-600">Forever</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        What Job Seekers Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Alex Thompson",
                                role: "Software Engineer",
                                text: "The AI suggestions were spot on. I fixed my keywords and got 3 interview calls the next week!"
                            },
                            {
                                name: "Sarah Martinez",
                                role: "Marketing Manager",
                                text: "I didn't realize my CV wasn't ATS friendly. This tool saved my job application process."
                            },
                            {
                                name: "David Kim",
                                role: "Data Analyst",
                                text: "Incredible that this is free. The feedback is better than paid services I've used before."
                            }
                        ].map((testimonial, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-700 mb-6">"{testimonial.text}"</p>
                                <div>
                                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-blue-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-xl text-blue-200 mb-8">
                        Join thousands of professionals who improved their CVs with MonCVPro.
                    </p>
                    <button
                        onClick={() => router.push('/cv-builder')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        Start Free Analysis
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>
        </div>
    );
}
