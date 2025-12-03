'use client';

import React from 'react';
import { Shield, Lock, Eye, Download, Trash2, UserCheck, Mail } from 'lucide-react';

export default function GDPRPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield size={40} />
                        <h1 className="text-4xl font-bold">GDPR Compliance</h1>
                    </div>
                    <p className="text-xl text-blue-100">
                        Your data protection rights under the General Data Protection Regulation
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                        <h3 className="font-bold text-blue-900 mb-2">MonCVPro is GDPR Compliant</h3>
                        <p className="text-blue-800 text-sm">
                            We are committed to protecting your personal data and respecting your privacy rights as outlined
                            in the European Union&apos;s General Data Protection Regulation (GDPR).
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                        {/* Your Rights */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your GDPR Rights</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <Eye className="text-blue-600 mb-3" size={28} />
                                    <h3 className="font-bold text-gray-900 mb-2">Right to Access</h3>
                                    <p className="text-gray-600 text-sm">
                                        You have the right to request copies of your personal data. We will provide you
                                        with all the information we hold about you.
                                    </p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <UserCheck className="text-green-600 mb-3" size={28} />
                                    <h3 className="font-bold text-gray-900 mb-2">Right to Rectification</h3>
                                    <p className="text-gray-600 text-sm">
                                        You have the right to request correction of any inaccurate information or to
                                        complete any incomplete data.
                                    </p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <Trash2 className="text-red-600 mb-3" size={28} />
                                    <h3 className="font-bold text-gray-900 mb-2">Right to Erasure</h3>
                                    <p className="text-gray-600 text-sm">
                                        Also known as the &quot;right to be forgotten&quot;. You can request deletion of your
                                        personal data when there&apos;s no compelling reason to continue processing it.
                                    </p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <Lock className="text-purple-600 mb-3" size={28} />
                                    <h3 className="font-bold text-gray-900 mb-2">Right to Restrict Processing</h3>
                                    <p className="text-gray-600 text-sm">
                                        You have the right to request that we limit the processing of your personal
                                        data under certain circumstances.
                                    </p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <Download className="text-indigo-600 mb-3" size={28} />
                                    <h3 className="font-bold text-gray-900 mb-2">Right to Data Portability</h3>
                                    <p className="text-gray-600 text-sm">
                                        You have the right to request transfer of your data to another service provider
                                        in a structured, machine-readable format.
                                    </p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <Mail className="text-orange-600 mb-3" size={28} />
                                    <h3 className="font-bold text-gray-900 mb-2">Right to Object</h3>
                                    <p className="text-gray-600 text-sm">
                                        You have the right to object to our processing of your personal data, particularly
                                        for direct marketing purposes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How to Exercise Your Rights */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Exercise Your Rights</h2>
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                                <p className="text-gray-700 mb-4">
                                    To exercise any of your GDPR rights, please contact us using one of the following methods:
                                </p>
                                <div className="space-y-2 text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Mail className="text-blue-600" size={18} />
                                        <span><strong>Email:</strong> gdpr@moncvpro.com</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="text-purple-600" size={18} />
                                        <span><strong>Subject Line:</strong> &quot;GDPR Request - [Your Right]&quot;</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-4">
                                    We will respond to your request within 30 days. In some cases, we may need to verify
                                    your identity before processing your request.
                                </p>
                            </div>
                        </div>

                        {/* Data We Collect */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data We Collect</h2>
                            <div className="space-y-3 text-gray-700">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                                        <li>Name and email address</li>
                                        <li>CV content (work history, education, skills)</li>
                                        <li>Account preferences and settings</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Automatic Information</h4>
                                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                                        <li>IP address and device information</li>
                                        <li>Browser type and version</li>
                                        <li>Usage data and analytics</li>
                                        <li>Cookies and tracking technologies</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Legal Basis */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Basis for Processing</h2>
                            <div className="text-gray-700 space-y-3">
                                <p>We process your personal data based on the following legal grounds:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>
                                        <strong>Consent:</strong> You have given clear consent for us to process your
                                        personal data for specific purposes (e.g., creating an account)
                                    </li>
                                    <li>
                                        <strong>Contractual Necessity:</strong> Processing is necessary to provide our
                                        service to you
                                    </li>
                                    <li>
                                        <strong>Legitimate Interests:</strong> Processing is necessary for our legitimate
                                        business interests (e.g., improving our service, preventing fraud)
                                    </li>
                                    <li>
                                        <strong>Legal Obligation:</strong> Processing is required to comply with legal
                                        requirements
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Security */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                            <p className="text-gray-700 mb-3">
                                We implement appropriate technical and organizational measures to ensure a level of security
                                appropriate to the risk, including:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security assessments and updates</li>
                                <li>Access controls and authentication</li>
                                <li>Regular backups and disaster recovery plans</li>
                                <li>Employee training on data protection</li>
                            </ul>
                        </div>

                        {/* Data Retention */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
                            <div className="text-gray-700 space-y-3">
                                <p>
                                    We retain your personal data only for as long as necessary to fulfill the purposes for
                                    which it was collected:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
                                    <li><strong>Deleted Accounts:</strong> Data deleted within 30 days of account deletion</li>
                                    <li><strong>Legal Requirements:</strong> Some data may be retained longer if required by law</li>
                                </ul>
                            </div>
                        </div>

                        {/* International Transfers */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
                            <p className="text-gray-700">
                                Your data may be transferred to and processed in countries outside the European Economic Area (EEA).
                                When we transfer data outside the EEA, we ensure appropriate safeguards are in place, such as:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700 mt-3">
                                <li>Standard Contractual Clauses approved by the European Commission</li>
                                <li>Processing agreements with third-party providers</li>
                                <li>Ensuring adequate data protection certifications</li>
                            </ul>
                        </div>

                        {/* Complaints */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Right to Lodge a Complaint</h2>
                            <p className="text-gray-700">
                                If you believe we have not handled your personal data properly, you have the right to lodge
                                a complaint with your local supervisory authority. In the EU, you can find your data protection
                                authority at{' '}
                                <a href="https://edpb.europa.eu/about-edpb/board/members_en" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                    EDPB Member List
                                </a>.
                            </p>
                        </div>

                        {/* Contact DPO */}
                        <div className="border-t border-gray-200 pt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Our Data Protection Officer</h2>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <p className="text-gray-700 mb-4">
                                    If you have any questions about our GDPR compliance or data protection practices:
                                </p>
                                <div className="space-y-2 text-gray-700">
                                    <p><strong>Email:</strong> dpo@moncvpro.com</p>
                                    <p><strong>Subject:</strong> GDPR Inquiry</p>
                                    <p className="text-sm text-gray-600 mt-4">
                                        We will respond to all inquiries within 30 days as required by GDPR.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
