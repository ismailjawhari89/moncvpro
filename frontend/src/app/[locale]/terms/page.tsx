'use client';

import React from 'react';
import { FileText, Shield, Ban, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

export default function TermsPage() {
    const lastUpdated = 'December 3, 2025';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText size={40} />
                        <h1 className="text-4xl font-bold">Terms of Service</h1>
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
                        {/* Introduction */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                            <p className="text-gray-700">
                                By accessing and using MonCVPro (&quot;the Service&quot;), you agree to be bound by these Terms of Service
                                (&quot;Terms&quot;). If you disagree with any part of these terms, you may not use our service.
                            </p>
                        </div>

                        {/* Use License */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="text-green-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">2. Use License</h2>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    MonCVPro grants you a personal, non-transferable, non-exclusive license to use the Service
                                    for creating and managing your CVs.
                                </p>
                                <p>You are permitted to:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Create, edit, and download CVs for personal use</li>
                                    <li>Use our templates and tools free of charge</li>
                                    <li>Export your CVs in various formats</li>
                                    <li>Save and manage multiple CVs</li>
                                </ul>
                            </div>
                        </div>

                        {/* Restrictions */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Ban className="text-red-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">3. Restrictions</h2>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                <p>You agree NOT to:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Use the Service for any illegal or unauthorized purpose</li>
                                    <li>Attempt to gain unauthorized access to our systems</li>
                                    <li>Resell, redistribute, or commercialize our templates or tools</li>
                                    <li>Upload malicious code, viruses, or harmful content</li>
                                    <li>Scrape, copy, or reverse engineer our website</li>
                                    <li>Create fake accounts or impersonate others</li>
                                    <li>Spam, harass, or abuse other users</li>
                                    <li>Interfere with the proper functioning of the Service</li>
                                </ul>
                            </div>
                        </div>

                        {/* User Account */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    When you create an account, you are responsible for maintaining the security of your account
                                    and password. You are fully responsible for all activities that occur under your account.
                                </p>
                                <p>You agree to:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Provide accurate and complete information during registration</li>
                                    <li>Keep your password secure and confidential</li>
                                    <li>Notify us immediately of any unauthorized use of your account</li>
                                    <li>Accept responsibility for all activities under your account</li>
                                </ul>
                            </div>
                        </div>

                        {/* Intellectual Property */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    The Service, including all content, features, and functionality (templates, designs, code,
                                    graphics, interfaces), is owned by MonCVPro and is protected by international copyright,
                                    trademark, and other intellectual property laws.
                                </p>
                                <p>
                                    Your CV content remains yours. We only store it to provide our service to you. You retain
                                    all rights to your CV data.
                                </p>
                            </div>
                        </div>

                        {/* Content Ownership */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Content</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    You retain ownership of any content you submit to the Service (your CV data, personal
                                    information, etc.). By using our Service, you grant us a limited license to store, display,
                                    and process your content solely for the purpose of providing our service to you.
                                </p>
                                <p>You are responsible for ensuring that:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Your content does not violate any laws or regulations</li>
                                    <li>Your content does not infringe on others&apos; intellectual property</li>
                                    <li>Your content is truthful and accurate</li>
                                </ul>
                            </div>
                        </div>

                        {/* Free Service */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Free Service and Advertising</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    MonCVPro is a free service. We generate revenue through advertising (Google AdSense) to keep
                                    our tools free for everyone.
                                </p>
                                <p>By using the Service, you acknowledge that:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Advertisements may be displayed on our website</li>
                                    <li>We do not charge for any core features</li>
                                    <li>We reserve the right to modify or discontinue features</li>
                                </ul>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="text-yellow-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">8. Disclaimer of Warranties</h2>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER
                                    EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>The Service will be uninterrupted or error-free</li>
                                    <li>Defects will be corrected</li>
                                    <li>The Service is free of viruses or harmful components</li>
                                    <li>The results of using the Service will meet your requirements</li>
                                </ul>
                                <p className="font-semibold">
                                    You use the Service at your own risk.
                                </p>
                            </div>
                        </div>

                        {/* Limitation of Liability */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                            <p className="text-gray-700">
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, MONCVPRO SHALL NOT BE LIABLE FOR ANY INDIRECT,
                                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
                                WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
                                INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
                            </p>
                        </div>

                        {/* Termination */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    We may terminate or suspend your account and access to the Service immediately, without prior
                                    notice, for any reason, including if you breach these Terms.
                                </p>
                                <p>
                                    You may terminate your account at any time by contacting us or using the account deletion
                                    feature in your profile settings.
                                </p>
                            </div>
                        </div>

                        {/* Changes to Terms */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
                            <p className="text-gray-700">
                                We reserve the right to modify these Terms at any time. We will notify users of any material
                                changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your continued
                                use of the Service after changes become effective constitutes acceptance of the new Terms.
                            </p>
                        </div>

                        {/* Governing Law */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
                            <p className="text-gray-700">
                                These Terms shall be governed by and construed in accordance with the laws of the European Union
                                and France, without regard to conflict of law provisions.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="border-t border-gray-200 pt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
                            <div className="text-gray-700">
                                <p className="mb-2">If you have any questions about these Terms, please contact us:</p>
                                <ul className="space-y-1">
                                    <li><strong>Email:</strong> legal@moncvpro.com</li>
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
