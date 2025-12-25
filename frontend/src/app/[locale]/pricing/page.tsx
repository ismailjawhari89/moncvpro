
import React from 'react';
import { CheckCircle, Zap, Star, Shield, ArrowRight } from 'lucide-react';
import ProWaitlistForm from '@/components/marketing/ProWaitlistForm';

export const metadata = {
    title: 'Pricing & Plans | MonCVPro',
    description: 'Choose the perfect plan for your career. Start for free and upgrade for unlimited AI power.',
};

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-900 to-indigo-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-medium mb-8">
                        <Star size={16} className="text-yellow-400" />
                        <span>Early Access Program</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                        Simple Pricing, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Unlimited Potential
                        </span>
                    </h1>

                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
                        Start building your professional resume for free.
                        Join the waitlist for Pro to unlock unlimited AI power and premium templates.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Free Plan */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Forever</h3>
                            <p className="text-gray-500">Essential tools to build a great CV</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$0</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-gray-700">
                                <CheckCircle size={20} className="text-blue-500 flex-shrink-0" />
                                <span>1 Professional Resume</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <CheckCircle size={20} className="text-blue-500 flex-shrink-0" />
                                <span>Basic Templates</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <CheckCircle size={20} className="text-blue-500 flex-shrink-0" />
                                <span>3 AI Improvements / Day</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <CheckCircle size={20} className="text-blue-500 flex-shrink-0" />
                                <span>PDF Export</span>
                            </li>
                        </ul>

                        <a
                            href="/cv-builder"
                            className="block w-full py-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors"
                        >
                            Start Building Now
                        </a>
                    </div>

                    {/* Pro Plan (Waitlist) */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-900 text-white rounded-3xl shadow-xl p-8 border border-indigo-700 relative overflow-hidden ring-4 ring-indigo-500/20 translate-y-[-10px]">
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-500 text-xs font-bold px-3 py-1 rounded-bl-xl text-black">
                            COMING SOON
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">MonCVPro <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Pro</span></h3>
                            <p className="text-blue-200">Unlock full AI power & premium features</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$9</span>
                                <span className="text-blue-200">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-blue-100">
                                <Zap size={20} className="text-yellow-400 flex-shrink-0" />
                                <span className="font-bold">Unlimited AI Improvements</span>
                            </li>
                            <li className="flex items-center gap-3 text-blue-100">
                                <CheckCircle size={20} className="text-blue-400 flex-shrink-0" />
                                <span>Advanced ATS Analysis</span>
                            </li>
                            <li className="flex items-center gap-3 text-blue-100">
                                <CheckCircle size={20} className="text-blue-400 flex-shrink-0" />
                                <span>Unlimited Resumes & Cover Letters</span>
                            </li>
                            <li className="flex items-center gap-3 text-blue-100">
                                <CheckCircle size={20} className="text-blue-400 flex-shrink-0" />
                                <span>Premium Design Templates</span>
                            </li>
                        </ul>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <Sparkles size={16} className="text-yellow-400" />
                                Join Early Access Waitlist
                            </h4>
                            <ProWaitlistForm source="pricing_page" />
                        </div>
                    </div>

                </div>
            </div>

            {/* Trust Badges */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
                <p className="text-gray-500 mb-8">Trusted by professionals at</p>
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale">
                    {/* Simplified Company Logos/Names */}
                    <span className="text-2xl font-bold text-gray-400">TechCorp</span>
                    <span className="text-2xl font-bold text-gray-400">GlobalSystems</span>
                    <span className="text-2xl font-bold text-gray-400">InnovateLab</span>
                    <span className="text-2xl font-bold text-gray-400">FutureSoft</span>
                </div>
            </div>

            {/* Guarantee */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
                <div className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-4">
                    <Shield size={16} />
                    <span className="font-semibold text-sm">30-Day Money-Back Guarantee</span>
                </div>
                <p className="text-gray-600">
                    We're confident MonCVPro will help you get hired faster. If you're not satisfied, we'll refund your subscription. No questions asked.
                </p>
            </div>
        </div>
    );
}
