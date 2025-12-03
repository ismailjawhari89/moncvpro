'use client';

import React from 'react';
import { Users, Target, Award, Heart, Sparkles, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                            About MonCVPro
                        </h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Your trusted partner in professional CV creation — completely free, forever
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-700 mb-4">
                                We believe that everyone deserves access to professional CV tools, regardless of their budget.
                                MonCVPro was created to democratize the job application process by providing enterprise-grade
                                CV building tools completely free of charge.
                            </p>
                            <p className="text-lg text-gray-700">
                                Our mission is to help job seekers worldwide create stunning, ATS-optimized CVs that get them
                                noticed by recruiters and land their dream jobs.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-6 rounded-xl">
                                <Users className="text-blue-600 mb-3" size={32} />
                                <h3 className="font-bold text-2xl text-gray-900 mb-2">50K+</h3>
                                <p className="text-gray-600">Happy Users</p>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-xl">
                                <Target className="text-purple-600 mb-3" size={32} />
                                <h3 className="font-bold text-2xl text-gray-900 mb-2">100K+</h3>
                                <p className="text-gray-600">CVs Created</p>
                            </div>
                            <div className="bg-indigo-50 p-6 rounded-xl">
                                <Award className="text-indigo-600 mb-3" size={32} />
                                <h3 className="font-bold text-2xl text-gray-900 mb-2">15+</h3>
                                <p className="text-gray-600">Templates</p>
                            </div>
                            <div className="bg-pink-50 p-6 rounded-xl">
                                <Heart className="text-pink-600 mb-3" size={32} />
                                <h3 className="font-bold text-2xl text-gray-900 mb-2">100%</h3>
                                <p className="text-gray-600">Free Forever</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <Sparkles className="text-blue-600 mb-4" size={40} />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                            <p className="text-gray-600">
                                We continuously innovate to bring you the latest AI-powered features and modern templates
                                that keep you ahead in the job market.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <Globe className="text-purple-600 mb-4" size={40} />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility</h3>
                            <p className="text-gray-600">
                                Professional CV tools should be accessible to everyone. That&apos;s why we offer all our
                                features completely free, with no hidden costs.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <Heart className="text-pink-600 mb-4" size={40} />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Quality</h3>
                            <p className="text-gray-600">
                                We never compromise on quality. Our templates are professionally designed and our tools
                                are built to enterprise standards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Story</h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p className="mb-4">
                            MonCVPro was born from a simple frustration: why should job seekers pay expensive subscriptions
                            just to create a professional CV? In 2024, we set out to change this.
                        </p>
                        <p className="mb-4">
                            Our team of developers, designers, and career experts came together with a shared vision:
                            create the best free CV builder on the market. We studied what makes CVs successful, analyzed
                            ATS systems, and interviewed recruiters to understand exactly what they look for.
                        </p>
                        <p className="mb-4">
                            The result? A platform that combines beautiful design, AI-powered content generation, and
                            ATS optimization — all available for free. We monetize through ethical advertising rather than
                            charging our users, ensuring everyone has equal access to professional CV tools.
                        </p>
                        <p>
                            Today, MonCVPro helps thousands of job seekers every month create CVs that get results.
                            And we&apos;re just getting started.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Create Your Professional CV?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of successful job seekers who trust MonCVPro
                    </p>
                    <button
                        onClick={() => window.location.href = '/cv-builder'}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Start Building Now — It&apos;s Free
                    </button>
                </div>
            </section>
        </div>
    );
}
