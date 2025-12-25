'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    CheckCircle, Star, Download, Zap,
    Layout, PenTool, ArrowRight, Eye
} from 'lucide-react';
import { aiTemplates } from '@/data/ai-templates/ai-templates';
import { AITemplatePreview } from '@/components/cv/AITemplatePreview';

interface ExamplesClientProps {
    locale: string;
}

export default function ExamplesClient({ locale }: ExamplesClientProps) {
    const isRTL = locale === 'ar';
    const router = useRouter();

    // Limit to first 3 templates for the examples page
    const templates = aiTemplates.slice(0, 3);

    const handleSelectTemplate = (templateId: string) => {
        router.push(`/${locale}/cv-builder?template=${templateId}`);
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const features = [
        {
            icon: <Layout className="w-8 h-8 text-blue-600" />,
            title: isRTL ? "قوالب مصممة محترفياً" : "Professionally Designed Templates",
            desc: isRTL ? "قوالب متوافقة مع ATS، مع تخصيص كامل للألوان والخطوط." : "ATS-friendly templates with full color and font customization."
        },
        {
            icon: <Download className="w-8 h-8 text-green-600" />,
            title: isRTL ? "تصدير متعدد الصيغ" : "Multi-Format Export",
            desc: isRTL ? "PDF نصي عالي الجودة (للتحليل الآلي) وصيغ أخرى." : "High-quality text PDF (for automated analysis)."
        },
        {
            icon: <Zap className="w-8 h-8 text-purple-600" />,
            title: isRTL ? "ذكاء اصطناعي مساعد" : "AI Assistant",
            desc: isRTL ? "تعديل الصور وتحسين المحتوى بالذكاء الاصطناعي." : "AI Image enhancement and content improvement."
        }
    ];

    const tips = [
        { title: isRTL ? "استخدم أفعال قوية" : "Use Action Verbs", text: isRTL ? '"قادت، طورت، حققت" بدلاً من "مسؤول عن".' : '"Led, Developed, Achieved" instead of "Responsible for".' },
        { title: isRTL ? "ركز على الإنجازات" : "Focus on Achievements", text: isRTL ? "استخدم أرقاماً ونسباً مئوية لإثبات تأثيرك." : "Use numbers and percentages to prove your impact." },
        { title: isRTL ? "خصص لكل وظيفة" : "Tailor for Each Job", text: isRTL ? "عدل سيرتك لتتناسب مع متطلبات كل فرصة عمل." : "Customize your CV to match each job opportunity requirements." },
        { title: isRTL ? "تحقق من التوافق" : "Check Compatibility", text: isRTL ? "اختبر سيرتك على محاكي ATS المدمج قبل الإرسال." : "Test your CV on the built-in ATS simulator before sending." }
    ];

    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>

            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white dark:bg-gray-950">
                {/* ... (Kept similar styling) */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/20 opacity-70"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mb-8 border border-blue-100 dark:border-blue-800">
                            <Star size={16} fill="currentColor" />
                            <span className="text-sm font-medium">{isRTL ? "الجيل الجديد من السير الذاتية" : "The Next Generation of CVs"}</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
                            {isRTL ? "صانع السير الذاتية" : "AI-Powered CV"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{isRTL ? "الذكي" : "Builder"}</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            {isRTL ? "قوالب ذكية، تحسين صور تلقائي، ومحتوى احترافي في دقائق." : "Smart templates, automatic photo enhancement, and professional content in minutes."}
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href={`/${locale}/cv-builder`} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                <PenTool size={20} />
                                {isRTL ? "ابدأ الآن مجاناً" : "Start Now Free"}
                            </Link>
                            <Link href="#examples" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                                <Eye size={20} />
                                {isRTL ? "شاهد الأمثلة" : "View Examples"}
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 2. FEATURES SECTION */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{isRTL ? "أذكى من أي وقت مضى" : "Smarter Than Ever"}</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
                            {features.map((feature, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. EXAMPLES GALLERY */}
            <section id="examples" className="py-24 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{isRTL ? "نماذج حقيقية" : "Real Examples"}</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">{isRTL ? "قوالبنا تعرض كيف ستبدو سيرتك الذاتية في الواقع." : "See exactly how your CV will look."}</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                        {templates.map((template) => (
                            <div key={template.id} className="flex justify-center">
                                {/* Use AITemplatePreview */}
                                <AITemplatePreview
                                    template={template}
                                    onSelect={() => handleSelectTemplate(template.id)}
                                    onPreview={() => handleSelectTemplate(template.id)}
                                    locale={locale}
                                    width={320}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href={`/${locale}/templates`} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg">
                            {isRTL ? "تصفح جميع القوالب" : "Browse All Templates"} <ArrowRight size={20} className={isRTL ? 'rotate-180' : ''} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. FINAL CTA */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-white shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">{isRTL ? "جاهز للانطلاق؟" : "Ready to Launch?"}</h2>
                        <Link
                            href={`/${locale}/cv-builder`}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
                        >
                            {isRTL ? "أنشئ سيرتك الذاتية الآن" : "Build Your CV Now"}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
