'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight, Briefcase, Layout, Zap, Star, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cvExamplesService, type CVExample } from '@/services/cvExamplesService';
import Link from 'next/link';

export default function CVExamplesPage() {
    const router = useRouter();
    const [examples, setExamples] = useState<CVExample[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedStyle, setSelectedStyle] = useState('All');
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        loadExamples();
    }, []);

    const loadExamples = async () => {
        try {
            const data = await cvExamplesService.getAllExamples();
            setExamples(data);
        } catch (error) {
            console.error('Error loading examples:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredExamples = examples.filter(ex => {
        const matchesSearch = ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ex.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ex.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesIndustry = selectedIndustry === 'All' || ex.industry === selectedIndustry;
        const matchesLevel = selectedLevel === 'All' || ex.level === selectedLevel;
        const matchesStyle = selectedStyle === 'All' || ex.style === selectedStyle;

        return matchesSearch && matchesIndustry && matchesLevel && matchesStyle;
    });

    const visibleExamples = filteredExamples.slice(0, visibleCount);
    const hasMore = visibleCount < filteredExamples.length;

    const industries = ['All', ...Array.from(new Set(examples.map(ex => ex.industry))).sort()];
    const levels = ['All', ...Array.from(new Set(examples.map(ex => ex.level))).sort()];
    const styles = ['All', ...Array.from(new Set(examples.map(ex => ex.style))).sort()];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-medium mb-8 animate-fade-in-up">
                        <Zap size={16} className="text-yellow-400" />
                        <span>Updated for 2025 Job Market</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight animate-fade-in-up delay-100">
                        Browse 20+ Professionally<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Designed CV Examples
                        </span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                        Get inspired by real-world examples. Find the perfect template for your industry and build your winning CV in minutes.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative animate-fade-in-up delay-300">
                        <input
                            type="text"
                            placeholder="Search by job title, industry, or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 pl-12 shadow-xl transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200" size={20} />
                    </div>

                    <div className="mt-8 animate-fade-in-up delay-400">
                        <button
                            onClick={() => router.push('/cv-builder')}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
                        >
                            Start Building Your CV
                        </button>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                            <Filter size={18} className="text-gray-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700 mr-2">Filter by:</span>

                            <select
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                {industries.map(ind => (
                                    <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
                                ))}
                            </select>

                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                {levels.map(lvl => (
                                    <option key={lvl} value={lvl}>{lvl === 'All' ? 'All Levels' : lvl}</option>
                                ))}
                            </select>

                            <select
                                value={selectedStyle}
                                onChange={(e) => setSelectedStyle(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                {styles.map(style => (
                                    <option key={style} value={style}>{style === 'All' ? 'All Styles' : style}</option>
                                ))}
                            </select>
                        </div>
                        <div className="text-sm text-gray-500 whitespace-nowrap">
                            Showing <span className="font-bold text-gray-900">{filteredExamples.length}</span> examples
                        </div>
                    </div>
                </div>
            </section>

            {/* Examples Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-96 animate-pulse">
                                    <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {visibleExamples.map((example, index) => (
                                    <React.Fragment key={example.id}>
                                        {/* AdSense Slot every 8 items */}
                                        {index > 0 && index % 8 === 0 && (
                                            <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-gray-100 rounded-xl border border-gray-200 p-4 flex items-center justify-center min-h-[100px]">
                                                <span className="text-xs text-gray-400 uppercase tracking-widest">Advertisement</span>
                                            </div>
                                        )}

                                        <Link
                                            href={`/cv-examples/${example.slug}`}
                                            className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                                        >
                                            {/* Thumbnail */}
                                            <div className={`aspect-[3/4] ${example.color} relative overflow-hidden p-6 flex flex-col`}>
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>

                                                {/* Mini CV Preview Structure */}
                                                <div className="bg-white h-full w-full rounded shadow-lg p-3 text-[6px] text-gray-400 overflow-hidden opacity-90 group-hover:scale-105 transition-transform duration-500">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
                                                    <div className="h-2 bg-gray-800 w-3/4 mb-1"></div>
                                                    <div className="h-1 bg-blue-500 w-1/2 mb-3"></div>
                                                    <div className="space-y-1">
                                                        <div className="h-1 bg-gray-200 w-full"></div>
                                                        <div className="h-1 bg-gray-200 w-full"></div>
                                                        <div className="h-1 bg-gray-200 w-5/6"></div>
                                                    </div>
                                                    <div className="mt-3 space-y-1">
                                                        <div className="h-1.5 bg-gray-300 w-1/3 mb-1"></div>
                                                        <div className="h-1 bg-gray-200 w-full"></div>
                                                        <div className="h-1 bg-gray-200 w-full"></div>
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                                                    <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-md">
                                                        {example.industry}
                                                    </span>
                                                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-md">
                                                        {example.level}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                    {example.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                                                    {example.description}
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-gray-100">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Layout size={12} />
                                                            {example.style}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                            <CheckCircle size={12} />
                                                            ATS Score: {example.atsScore}
                                                        </div>
                                                    </div>
                                                    <span className="w-full py-2 flex items-center justify-center gap-2 bg-gray-50 group-hover:bg-blue-50 text-gray-700 group-hover:text-blue-600 text-sm font-medium rounded-lg transition-colors">
                                                        View Example
                                                        <ArrowRight size={14} />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </React.Fragment>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-12 text-center">
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 8)}
                                        className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        Load More Examples
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {!loading && filteredExamples.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-gray-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No examples found</h3>
                            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedIndustry('All');
                                    setSelectedLevel('All');
                                    setSelectedStyle('All');
                                }}
                                className="mt-4 text-blue-600 font-medium hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="bg-white border-t border-gray-200 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <Briefcase size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Build Your Professional CV Today
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join 50,000+ professionals who have landed their dream jobs using MonCVPro.
                        It&apos;s free, fast, and ATS-friendly.
                    </p>
                    <button
                        onClick={() => router.push('/cv-builder')}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        Create My CV Now
                    </button>
                </div>
            </section>
        </div>
    );
}
