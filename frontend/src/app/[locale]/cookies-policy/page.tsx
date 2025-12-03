'use client';

import React from 'react';
import { Cookie, Settings, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CookiesPolicyPage() {
    const lastUpdated = 'December 3, 2025';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Cookie size={40} />
                        <h1 className="text-4xl font-bold">Cookies Policy</h1>
                    </div>
                    <p className="text-xl text-blue-100">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                        {/* What are Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
                            <p className="text-gray-700">
                                Cookies are small text files that are placed on your device when you visit our website. They help us
                                provide you with a better experience by remembering your preferences and understanding how you use our service.
                            </p>
                        </div>

                        {/* How We Use Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>We use cookies for the following purposes:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Essential Cookies:</strong> Required for the website to function properly (login, session management)</li>
                                    <li><strong>Functional Cookies:</strong> Remember your preferences (language, theme, settings)</li>
                                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                                    <li><strong>Advertising Cookies:</strong> Used by Google AdSense to display relevant ads</li>
                                </ul>
                            </div>
                        </div>

                        {/* Types of Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
                            <div className="space-y-6">
                                {/* Essential Cookies */}
                                <div className="border-l-4 border-green-500 pl-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="text-green-600" size={20} />
                                        <h3 className="font-bold text-gray-900">Essential Cookies (Always Active)</h3>
                                    </div>
                                    <p className="text-gray-700 mb-2">These cookies are necessary for the website to function:</p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 text-sm">
                                        <li>Authentication tokens (keeping you logged in)</li>
                                        <li>Session management</li>
                                        <li>Security features</li>
                                        <li>Load balancing</li>
                                    </ul>
                                </div>

                                {/* Functional Cookies */}
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Settings className="text-blue-600" size={20} />
                                        <h3 className="font-bold text-gray-900">Functional Cookies (Optional)</h3>
                                    </div>
                                    <p className="text-gray-700 mb-2">These cookies enhance your experience:</p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 text-sm">
                                        <li>Language preferences</li>
                                        <li>Dark/light mode selection</li>
                                        <li>CV editor preferences</li>
                                        <li>Template selections</li>
                                    </ul>
                                </div>

                                {/* Analytics Cookies */}
                                <div className="border-l-4 border-purple-500 pl-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Settings className="text-purple-600" size={20} />
                                        <h3 className="font-bold text-gray-900">Analytics Cookies (Optional)</h3>
                                    </div>
                                    <p className="text-gray-700 mb-2">Help us improve our service:</p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 text-sm">
                                        <li>Page views and visitor statistics</li>
                                        <li>Feature usage analytics</li>
                                        <li>Performance monitoring</li>
                                        <li>Error tracking</li>
                                    </ul>
                                </div>

                                {/* Advertising Cookies */}
                                <div className="border-l-4 border-yellow-500 pl-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Settings className="text-yellow-600" size={20} />
                                        <h3 className="font-bold text-gray-900">Advertising Cookies (Optional - Google AdSense)</h3>
                                    </div>
                                    <p className="text-gray-700 mb-2">Used to display relevant advertisements:</p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 text-sm">
                                        <li>Ad personalization based on interests</li>
                                        <li>Frequency capping (limiting how often you see same ad)</li>
                                        <li>Ad effectiveness measurement</li>
                                        <li>Cross-site tracking for ad targeting</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Third-Party Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Cookies</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>We use the following third-party services that may set cookies:</p>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Google AdSense</h4>
                                        <p className="text-sm text-gray-600">
                                            Google uses cookies to serve ads based on your prior visits to our website or other websites.
                                            You can opt out of personalized advertising by visiting{' '}
                                            <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                                Google Ads Settings
                                            </a>.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Cloudflare</h4>
                                        <p className="text-sm text-gray-600">
                                            Used for security, performance, and content delivery. Essential for website functionality.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Managing Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Managing Your Cookie Preferences</h2>
                            <div className="space-y-4 text-gray-700">
                                <p>You have several options to manage cookies:</p>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">Browser Settings</h4>
                                    <p className="text-sm text-blue-800 mb-2">
                                        Most browsers allow you to control cookies through their settings:
                                    </p>
                                    <ul className="text-sm text-blue-800 space-y-1 ml-4">
                                        <li>• <strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                                        <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                                        <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                                        <li>• <strong>Edge:</strong> Settings → Privacy → Cookies</li>
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start gap-2">
                                        <XCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                                        <div>
                                            <h4 className="font-semibold text-yellow-900 mb-1">Important Note</h4>
                                            <p className="text-sm text-yellow-800">
                                                Blocking all cookies may prevent you from using certain features of our website,
                                                such as saving your CVs or staying logged in.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cookie Duration */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookie Duration</h2>
                            <div className="text-gray-700">
                                <p className="mb-3">Cookies we set have different lifespans:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                                    <li><strong>Persistent Cookies:</strong> Remain until they expire (typically 30-365 days)</li>
                                </ul>
                            </div>
                        </div>

                        {/* Updates */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Updates to This Policy</h2>
                            <p className="text-gray-700">
                                We may update this Cookies Policy from time to time to reflect changes in our practices or legal
                                requirements. We will notify you of any significant changes by posting the new policy on this page.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="border-t border-gray-200 pt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                            <div className="text-gray-700">
                                <p className="mb-2">If you have questions about our use of cookies, please contact us:</p>
                                <ul className="space-y-1">
                                    <li><strong>Email:</strong> privacy@moncvpro.com</li>
                                    <li><strong>Website:</strong> <Link href="/contact" className="text-blue-600 hover:underline">Contact Form</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
