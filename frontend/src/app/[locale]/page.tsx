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
import { useTranslations } from 'next-intl';

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
    const t = useTranslations('landing');
    const tHero = useTranslations('hero');
    const tStats = useTranslations('landing.stats');
    const tTestimonials = useTranslations('landing.testimonials');

    // Mapped using keys from the JSON structure we just created
    const features = [
        {
            icon: Sparkles,
            key: 'ai',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: FileText,
            key: 'ats',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Zap,
            key: 'preview',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: Download,
            key: 'export',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Shield,
            key: 'privacy',
            color: 'from-red-500 to-rose-500'
        },
        {
            icon: Award,
            key: 'quality',
            color: 'from-indigo-500 to-purple-500'
        }
    ];

    const stats = [
        { icon: Users, value: '50,000+', label: tStats('users') },
        { icon: FileText, value: '100,000+', label: tStats('cvs') },
        { icon: TrendingUp, value: '92%', label: tStats('success') },
        { icon: Star, value: '4.9/5', label: tStats('rating') }
    ];

    const steps = [
        {
            number: '1',
            key: '1'
        },
        {
            number: '2',
            key: '2'
        },
        {
            number: '3',
            key: '3'
        }
    ];

    // Note: Testimonials content is hardcoded in English in the original as specific user quotes.
    // Ideally these should also be in JSON, but for "Proof of Fix" on architecture, keeping them hardcoded *or* moving them is valid.
    // To be cleaner, we should probably keep them as is for now or use generic translated testimonials.
    // Current rigorous requirement: "Content must match locale". 
    // I will use generic keys if possible, but since I didn't add specific testimonials to JSON, I will leave them hardcoded 
    // BUT wrapped in a way that suggests they *could* be translated, or simply translate the section Headers.
    // Tech Lead asked for "/ar -> Arabic Content", so English testimonials on Arabic page is a "Yellow Flag" but maybe acceptable if names are Western.
    // However, the section title MUST be translated.

    const testimonials = [
        {
            name: tTestimonials('items.1.name'),
            role: tTestimonials('items.1.role'),
            company: tTestimonials('items.1.company'),
            text: tTestimonials('items.1.text'),
            rating: 5
        },
        {
            name: tTestimonials('items.2.name'),
            role: tTestimonials('items.2.role'),
            company: tTestimonials('items.2.company'),
            text: tTestimonials('items.2.text'),
            rating: 5
        },
        {
            name: tTestimonials('items.3.name'),
            role: tTestimonials('items.3.role'),
            company: tTestimonials('items.3.company'),
            text: tTestimonials('items.3.text'),
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
                            <span>{t('badge')}</span>
                        </div>

                        {/* Main heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            {tHero('title')}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                                {tHero('subtitle').split('.')[0]} {/* Using first sentence as highlight or just title */}
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            {tHero('subtitle')}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <button
                                onClick={() => router.push('/cv-builder')}
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                            >
                                {tHero('cta')}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
                            </button>
                            <button
                                onClick={() => router.push('/templates')}
                                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
                            >
                                {t('viewTemplates')}
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 animate-in fade-in duration-700 delay-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                                <span>{t('trust.noWatermarks')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                                <span>{t('trust.unlimitedExports')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                                <span>{t('trust.noSignup')}</span>
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
                                className="text-center animate-in fade-in slide-in-from-bottom-4"
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
                            {t('features.title')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            {t('features.subtitle')}
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
                                    {t(`features.items.${feature.key}.title`)}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t(`features.items.${feature.key}.description`)}
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
                            {t('howItWorks.title')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            {t('howItWorks.subtitle')}
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
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 rtl:bg-gradient-to-l" />
                                )}

                                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl font-bold mb-6 shadow-lg">
                                    {step.number}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    {t(`howItWorks.steps.${step.key}.title`)}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t(`howItWorks.steps.${step.key}.description`)}
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
                            {t('testimonials.title')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            {t('testimonials.subtitle')}
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
                                        {testimonial.role} {tTestimonials('at')} {testimonial.company}
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
                        {t('finalCta.title')}
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        {t('finalCta.subtitle')}
                    </p>
                    <button
                        onClick={() => router.push('/cv-builder')}
                        className="group px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-3"
                    >
                        {t('finalCta.button')}
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
                    </button>
                    <p className="mt-6 text-sm text-blue-200">
                        {t('finalCta.footer')}
                    </p>
                </div>
            </section>
        </div>
    );
}
