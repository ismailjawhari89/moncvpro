'use client';

import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

export default function PrivacyPolicyPage() {
    const lastUpdated = 'December 3, 2025';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield size={40} />
                        <h1 className="text-4xl font-bold">Privacy Policy</h1>
                    </div>
                    <p className="text-xl text-blue-100">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-bold text-blue-900 mb-2">Your Privacy Matters</h3>
                                <p className="text-blue-800 text-sm">
                                    At MonCVPro, we are committed to protecting your personal information and your right to privacy.
                                    This Privacy Policy explains how we collect, use, and safeguard your data.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                        {/* Information We Collect */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="text-blue-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
                            </div>
                            <div className="space-y-4 text-gray-700">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">1.1 Information You Provide</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Account information (name, email address)</li>
                                        <li>CV content (work experience, education, skills)</li>
                                        <li>Contact form submissions</li>
                                        <li>Feedback and survey responses</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">1.2 Automatically Collected Information</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Device information (browser type, operating system)</li>
                                        <li>Usage data (pages visited, features used)</li>
                                        <li>Cookies and similar tracking technologies</li>
                                        <li>IP address and location data</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Your Information */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="text-purple-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
                            </div>
                            <div className="space-y-2 text-gray-700">
                                <p>We use the collected information for the following purposes:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>To provide and maintain our CV building service</li>
                                    <li>To personalize your experience and save your CVs</li>
                                    <li>To improve our website and develop new features</li>
                                    <li>To communicate with you about updates and support</li>
                                    <li>To display relevant advertisements (Google AdSense)</li>
                                    <li>To ensure security and prevent fraud</li>
                                    <li>To comply with legal obligations</li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Storage and Security */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="text-green-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">3. Data Storage and Security</h2>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    We implement appropriate technical and organizational security measures to protect your
                                    personal information against unauthorized access, alteration, disclosure, or destruction.
                                </p>
                                <p>
                                    Your CV data is stored securely using industry-standard encryption. We use Supabase
                                    (PostgreSQL) for data storage, which provides enterprise-grade security and compliance.
                                </p>
                                <p className="font-semibold">
                                    However, no method of transmission over the Internet is 100% secure. While we strive to
                                    protect your data, we cannot guarantee absolute security.
                                </p>
                            </div>
                        </div>

                        {/* Third-Party Services */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <UserCheck className="text-orange-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">4. Third-Party Services</h2>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                <p>We use the following third-party services:</p>
                                <ul className="space-y-2 ml-4">
                                    <li>
                                        <strong>Google AdSense:</strong> For displaying advertisements. Google may use cookies
                                        to serve ads based on your interests. You can opt-out at{' '}
                                        <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                            Google Ads Settings
                                        </a>.
                                    </li>
                                    <li>
                                        <strong>Supabase:</strong> For secure data storage and authentication.
                                    </li>
                                    <li>
                                        <strong>Cloudflare:</strong> For content delivery and security.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Your Rights */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights (GDPR)</h2>
                            <div className="text-gray-700">
                                <p className="mb-3">If you are located in the European Economic Area (EEA), you have the following rights:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                                    <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                                    <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                                    <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                                    <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
                                    <li><strong>Right to Object:</strong> Object to processing of your data</li>
                                </ul>
                                <p className="mt-3">
                                    To exercise these rights, please contact us at <strong>privacy@moncvpro.com</strong>
                                </p>
                            </div>
                        </div>

                        {/* Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
                            <div className="text-gray-700 space-y-3">
                                <p>
                                    We use cookies and similar tracking technologies to improve your experience. Cookies are
                                    small files stored on your device that help us remember your preferences and analyze site usage.
                                </p>
                                <p>
                                    You can control cookies through your browser settings. However, disabling cookies may
                                    limit some features of our website.
                                </p>
                                <p>
                                    For more information, please see our <Link href="/cookies-policy" className="text-blue-600 hover:underline">Cookies Policy</Link>.
                                </p>
                            </div>
                        </div>

                        {/* Data Retention */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                            <div className="text-gray-700 space-y-2">
                                <p>
                                    We retain your personal information only for as long as necessary to provide our services
                                    and fulfill the purposes outlined in this Privacy Policy.
                                </p>
                                <p>
                                    When you delete your account, we will delete your personal data within 30 days, except
                                    where we are required to retain it for legal compliance.
                                </p>
                            </div>
                        </div>

                        {/* Children's Privacy */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
                            <p className="text-gray-700">
                                Our service is not intended for children under 16 years of age. We do not knowingly collect
                                personal information from children. If you believe we have collected data from a child,
                                please contact us immediately.
                            </p>
                        </div>

                        {/* Changes to Policy */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
                            <p className="text-gray-700">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by
                                posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="border-t border-gray-200 pt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                            <div className="text-gray-700">
                                <p className="mb-2">If you have questions about this Privacy Policy, please contact us:</p>
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
