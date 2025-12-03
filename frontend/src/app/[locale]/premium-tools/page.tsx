'use client';

import React, { useState } from 'react';
import {
    Sparkles,
    Wand2,
    LayoutTemplate,
    Eye,
    Layers,
    FileDown,
    Check,
    X as XIcon,
    ChevronDown,
    ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type ThemeMode = 'light' | 'dark';

export default function PremiumToolsPage() {
    const router = useRouter();
    const [theme] = useState<ThemeMode>('light');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const isDark = theme === 'dark';

    const tools = [
        {
            icon: Sparkles,
            title: 'AI CV Analyzer',
            description: 'Analyze your resume and get improvement suggestions with ATS compatibility scoring.',
            color: 'purple',
            link: '/cv-builder'
        },
        {
            icon: Wand2,
            title: 'AI Content Generator',
            description: 'Generates bullet points, job descriptions, and professional summaries automatically.',
            color: 'blue',
            link: '/cv-builder'
        },
        {
            icon: LayoutTemplate,
            title: 'Template Gallery',
            description: 'Access all professional CV templates without restrictions or watermarks.',
            color: 'indigo',
            link: '/templates'
        },
        {
            icon: Eye,
            title: 'Live Preview',
            description: 'Real-time rendering of your CV as you type with instant updates.',
            color: 'green',
            link: '/cv-builder'
        },
        {
            icon: Layers,
            title: 'Smart Sections',
            description: 'Automatically optimized sections for skills, languages, and experience.',
            color: 'orange',
            link: '/cv-builder'
        },
        {
            icon: FileDown,
            title: 'Export Tools',
            description: 'Download your CV in PDF and DOCX with professional quality formatting.',
            color: 'pink',
            link: '/cv-builder'
        }
    ];

    const comparison = [
        { feature: 'Unlimited Exports', us: true, others: false },
        { feature: 'All Templates Free', us: true, others: false },
        { feature: 'No Watermarks', us: true, others: false },
        { feature: 'AI Tools Included', us: true, others: false },
        { feature: 'No Subscriptions', us: true, others: false },
        { feature: 'No Hidden Fees', us: true, others: false }
    ];

    const faqs = [
        {
            question: 'Is everything really free?',
            answer: 'Yes! All our tools, templates, and features are completely free. No hidden costs, no premium tiers.'
        },
        {
            question: 'How do you make money?',
            answer: 'We display non-intrusive ads to keep the service free. We never charge for CV creation or exports.'
        },
        {
            question: 'Do I need to create an account?',
            answer: 'No account required! You can start building your CV immediately. Optional accounts allow you to save and manage multiple CVs.'
        },
        {
            question: 'Are the templates professional?',
            answer: 'Absolutely! Our templates are designed by professionals and optimized for ATS systems used by recruiters.'
        },
        {
            question: 'Is there a limit to exports?',
            answer: 'No limits! Export as many CVs as you want in PDF or DOCX format, completely free.'
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            purple: isDark ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-50 text-purple-600',
            blue: isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-600',
            indigo: isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600',
            green: isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-50 text-green-600',
            orange: isDark ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-50 text-orange-600',
            pink: isDark ? 'bg-pink-900/50 text-pink-400' : 'bg-pink-50 text-pink-600'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            {/* Hero Section */}
            <section className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-800 via-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                            <Sparkles size={16} />
                            <span>100% Free Forever</span>
                        </div>

                        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                            Premium Tools — <br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Completely Free
                            </span>
                        </h1>

                        <p className={`text-lg sm:text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto mb-10`}>
                            Enjoy all our advanced CV tools at no cost. No sign-ups, no payments, no limits.
                        </p>

                        <button
                            onClick={() => router.push('/cv-builder')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Start Building Your CV
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Professional Tools, Zero Cost
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Everything you need to create the perfect CV
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <div
                            key={index}
                            className={`group ${isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-300'} rounded-xl border p-6 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-4`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`p-3 ${getColorClasses(tool.color)} rounded-xl w-fit mb-4 transition-transform duration-300 group-hover:scale-110`}>
                                <tool.icon size={24} />
                            </div>

                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                                {tool.title}
                            </h3>

                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4 leading-relaxed`}>
                                {tool.description}
                            </p>

                            <button
                                onClick={() => router.push(tool.link)}
                                className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} rounded-lg font-medium transition-all duration-300 text-sm`}
                            >
                                Use Tool
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison Section */}
            <section className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} py-16 sm:py-24 transition-colors duration-300`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Premium Quality, Zero Cost
                        </h2>
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            See how we compare to traditional CV builders
                        </p>
                    </div>

                    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden shadow-sm`}>
                        <table className="w-full">
                            <thead className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Feature
                                    </th>
                                    <th className={`px-6 py-4 text-center text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        MonCVPro
                                    </th>
                                    <th className={`px-6 py-4 text-center text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Traditional Builders
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {comparison.map((item, index) => (
                                    <tr key={index} className={isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                                        <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {item.feature}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.us ? (
                                                <Check className="inline-block text-green-500" size={20} />
                                            ) : (
                                                <XIcon className="inline-block text-red-500" size={20} />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.others ? (
                                                <Check className="inline-block text-green-500" size={20} />
                                            ) : (
                                                <XIcon className="inline-block text-red-500" size={20} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Frequently Asked Questions
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Everything you need to know
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden transition-all duration-300`}
                        >
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left"
                            >
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    size={20}
                                />
                            </button>

                            {expandedFaq === index && (
                                <div className={`px-6 pb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} animate-in slide-in-from-top-2 duration-200`}>
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
                <div className={`relative overflow-hidden rounded-2xl ${isDark ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600'} p-8 sm:p-12 text-center shadow-2xl`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={120} className="text-white" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Build Your CV in Minutes — Free Forever
                        </h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals who created their perfect CV with our tools
                        </p>
                        <button
                            onClick={() => router.push('/cv-builder')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Start Now
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
