'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Sparkles,
    FileText,
    Zap,
    Shield,
    Download,
    CheckCircle,
    ArrowRight,
    Star,
    Users,
    TrendingUp,
    Award
} from 'lucide-react';

// Edge Runtime for Page
export const runtime = 'edge';

/**
 * Home Page - Landing Page
 * 
 * Main landing page for MonCVPro showcasing features and benefits.
 * Designed to convert visitors into users with clear CTAs and social proof.
 * 
 * Sections:
 * - Hero with primary CTA
 * - Features grid
 * - Stats/Social proof
 * - How it works
 * - Testimonials
 * - Final CTA
 */
export default function HomePage() {
    const router = useRouter();

    const features = [
        {
            icon: Sparkles,
            title: 'AI-Powered Content',
            description: 'Let AI write compelling bullet points and summaries tailored to your experience.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: FileText,
            title: 'ATS-Friendly Templates',
            description: 'All templates are optimized to pass Applicant Tracking Systems used by recruiters.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Zap,
            title: 'Instant Preview',
            description: 'See changes in real-time with our live preview feature. What you see is what you get.',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: Download,
            title: 'Export Anywhere',
            description: 'Download your CV as PDF or DOCX. No watermarks, no limits, completely free.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'Your data stays private. We never share your information with third parties.',
            color: 'from-red-500 to-rose-500'
        },
        {
            icon: Award,
            title: 'Professional Quality',
            description: 'Create CVs that stand out with our professionally designed templates.',
            color: 'from-indigo-500 to-purple-500'
        }
    ];

    const stats = [
        { icon: Users, value: '50,000+', label: 'Happy Users' },
        { icon: FileText, value: '100,000+', label: 'CVs Created' },
        { icon: TrendingUp, value: '92%', label: 'Success Rate' },
        { icon: Star, value: '4.9/5', label: 'User Rating' }
    ];

    const steps = [
        {
            number: '1',
            title: 'Choose a Template',
            description: 'Select from our collection of ATS-friendly, professional templates.'
        },
        {
            number: '2',
            title: 'Fill Your Details',
            description: 'Add your information with AI assistance for compelling content.'
        },
        {
            number: '3',
            title: 'Download & Apply',
            description: 'Export your CV and start applying to your dream jobs.'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Software Engineer',
            company: 'Tech Corp',
            text: 'MonCVPro helped me land my dream job! The AI suggestions were incredibly helpful.',
            rating: 5
        },
        {
            name: 'Michael Chen',
            role: 'Marketing Manager',
            company: 'Digital Agency',
            text: 'Best free CV builder I\'ve used. The templates are modern and professional.',
            rating: 5
        },
        {
            name: 'Emma Williams',
            role: 'Data Analyst',
            company: 'Finance Inc',
            text: 'The ATS optimization feature gave me confidence that my CV would be seen.',
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 opacity-50" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
                            <span>100% Free Forever • No Credit Card Required</span>
                        </div>

                        {/* Main heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            Create Your Perfect CV
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                                In Minutes, Not Hours
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            Professional CV builder with AI-powered content generation.
                            ATS-friendly templates. Unlimited exports. Completely free.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <button
                                onClick={() => router.push('/cv-builder')}
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                            >
                                Start Building Free
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => router.push('/templates')}
                                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
                            >
                                View Templates
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 animate-in fade-in duration-700 delay-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                                <span>No watermarks</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                                <span>Unlimited exports</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                                <span>No signup required</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Powerful features that help you create a CV that gets noticed
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Three simple steps to your perfect CV
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="relative text-center animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20" />
                                )}

                                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl font-bold mb-6 shadow-lg">
                                    {step.number}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Loved by Job Seekers
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            See what our users have to say
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                                    &quot;{testimonial.text}&quot;
                                </p>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {testimonial.role} at {testimonial.company}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of professionals who created their perfect CV with MonCVPro
                    </p>
                    <button
                        onClick={() => router.push('/cv-builder')}
                        className="group px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-3"
                    >
                        Create Your CV Now — It&apos;s Free
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="mt-6 text-sm text-blue-200">
                        No credit card required • No hidden fees • No watermarks
                    </p>
                </div>
            </section>
        </div>
    );
}
