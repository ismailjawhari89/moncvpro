import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

interface Props {
    params: Promise<{ locale: string }>;
}

export default async function PrivacyPolicyPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'privacy-policy' });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield size={40} />
                        <h1 className="text-4xl font-bold">{t('title')}</h1>
                    </div>
                    <p className="text-xl text-blue-100">
                        {t('lastUpdated')}
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
                                <h3 className="font-bold text-blue-900 mb-2">{t('summaryTitle')}</h3>
                                <p className="text-blue-800 text-sm">
                                    {t('summaryDescription')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                        {/* Information We Collect */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="text-blue-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">{t('sections.collect.title')}</h2>
                            </div>
                            <div className="space-y-4 text-gray-700">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{t('sections.collect.provide.title')}</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        {(t.raw('sections.collect.provide.items') as string[]).map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{t('sections.collect.automated.title')}</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        {(t.raw('sections.collect.automated.items') as string[]).map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Your Information */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="text-purple-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">{t('sections.usage.title')}</h2>
                            </div>
                            <div className="space-y-2 text-gray-700">
                                <p>{t('sections.usage.description')}</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    {(t.raw('sections.usage.items') as string[]).map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Data Storage and Security */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="text-green-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">{t('sections.security.title')}</h2>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    {t('sections.security.paragraph1')}
                                </p>
                                <p>
                                    {t('sections.security.paragraph2')}
                                </p>
                                <p className="font-semibold">
                                    {t('sections.security.paragraph3')}
                                </p>
                            </div>
                        </div>

                        {/* Third-Party Services */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <UserCheck className="text-orange-600" size={28} />
                                <h2 className="text-2xl font-bold text-gray-900">{t('sections.thirdParty.title')}</h2>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                <p>{t('sections.thirdParty.description')}</p>
                                <ul className="space-y-2 ml-4">
                                    <li>
                                        <strong>{t('sections.thirdParty.googleAdsense.name')}:</strong> {t('sections.thirdParty.googleAdsense.text')}{' '}
                                        <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                            {t('sections.thirdParty.googleAdsense.linkText')}
                                        </a>.
                                    </li>
                                    <li>
                                        <strong>{t('sections.thirdParty.supabase.name')}:</strong> {t('sections.thirdParty.supabase.text')}
                                    </li>
                                    <li>
                                        <strong>{t('sections.thirdParty.cloudflare.name')}:</strong> {t('sections.thirdParty.cloudflare.text')}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Your Rights */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sections.yourRights.title')}</h2>
                            <div className="text-gray-700">
                                <p className="mb-3">{t('sections.yourRights.description')}</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>{t('sections.yourRights.access.title')}:</strong> {t('sections.yourRights.access.text')}</li>
                                    <li><strong>{t('sections.yourRights.rectification.title')}:</strong> {t('sections.yourRights.rectification.text')}</li>
                                    <li><strong>{t('sections.yourRights.erasure.title')}:</strong> {t('sections.yourRights.erasure.text')}</li>
                                    <li><strong>{t('sections.yourRights.restrictProcessing.title')}:</strong> {t('sections.yourRights.restrictProcessing.text')}</li>
                                    <li><strong>{t('sections.yourRights.dataPortability.title')}:</strong> {t('sections.yourRights.dataPortability.text')}</li>
                                    <li><strong>{t('sections.yourRights.object.title')}:</strong> {t('sections.yourRights.object.text')}</li>
                                </ul>
                                <p className="mt-3">
                                    {t('sections.yourRights.contactText')} <strong>privacy@moncvpro.com</strong>
                                </p>
                            </div>
                        </div>

                        {/* Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sections.cookies.title')}</h2>
                            <div className="text-gray-700 space-y-3">
                                <p>
                                    {t('sections.cookies.paragraph1')}
                                </p>
                                <p>
                                    {t('sections.cookies.paragraph2')}
                                </p>
                                <p>
                                    {t('sections.cookies.paragraph3')}{' '}
                                    <Link href={`/${locale}/cookies-policy`} className="text-blue-600 hover:underline">{t('sections.cookies.linkText')}</Link>.
                                </p>
                            </div>
                        </div>

                        {/* Data Retention */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sections.dataRetention.title')}</h2>
                            <div className="text-gray-700 space-y-2">
                                <p>
                                    {t('sections.dataRetention.paragraph1')}
                                </p>
                                <p>
                                    {t('sections.dataRetention.paragraph2')}
                                </p>
                            </div>
                        </div>

                        {/* Children's Privacy */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sections.childrenPrivacy.title')}</h2>
                            <p className="text-gray-700">
                                {t('sections.childrenPrivacy.text')}
                            </p>
                        </div>

                        {/* Changes to Policy */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sections.changesToPolicy.title')}</h2>
                            <p className="text-gray-700">
                                {t('sections.changesToPolicy.text')}
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="border-t border-gray-200 pt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sections.contact.title')}</h2>
                            <div className="text-gray-700">
                                <p className="mb-2">{t('sections.contact.description')}</p>
                                <ul className="space-y-1">
                                    <li><strong>{t('sections.contact.emailLabel')}:</strong> privacy@moncvpro.com</li>
                                    <li><strong>{t('sections.contact.websiteLabel')}:</strong> <Link href={`/${locale}/contact`} className="text-blue-600 hover:underline">{t('sections.contact.websiteLinkText')}</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
