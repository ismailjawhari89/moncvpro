'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, BarChart2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCVStore } from '@/stores/useCVStore';
import { CVAIService } from '@/services/cvAI.service';

export default function ResultsPreview() {
    const t = useTranslations('ai-resume-review.results');
    const router = useRouter();
    const { cvData, addAISuggestions, clearAISuggestions } = useCVStore();
    const [score, setScore] = useState(0);

    useEffect(() => {
        // Animate score on mount
        const interval = setInterval(() => {
            setScore(prev => {
                if (prev >= 78) {
                    clearInterval(interval);
                    return 78;
                }
                return prev + 2;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const handleFixIssues = () => {
        // 1. Clear old suggestions
        clearAISuggestions();

        // 2. Generate new structured suggestions
        const suggestions = CVAIService.generateSmartFixSuggestions(cvData);

        // 3. Add to store
        addAISuggestions(suggestions);

        // 4. Redirect to builder
        router.push('/cv-builder?smartFix=true');
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-400 text-sm ml-2">{t('reportTitle')}</span>
                </div>
                <div className="text-xs text-gray-500">{t('generationTime')}</div>
            </div>

            <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                    {/* Score Circle */}
                    <div className="relative w-40 h-40 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * score) / 100}
                                className={`text-yellow-500 transition-all duration-1000 ease-out`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-gray-900">{score}</span>
                            <span className="text-sm text-gray-500 uppercase tracking-wider">{t('scoreLabel')}</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{t('summaryTitle')}</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-green-600" size={20} />
                                    <span className="text-gray-700 font-medium">{t('metrics.contact')}</span>
                                </div>
                                <span className="text-green-700 font-bold">100%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="text-yellow-600" size={20} />
                                    <span className="text-gray-700 font-medium">{t('metrics.keywords')}</span>
                                </div>
                                <span className="text-yellow-700 font-bold">65%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                <div className="flex items-center gap-3">
                                    <XCircle className="text-red-600" size={20} />
                                    <span className="text-gray-700 font-medium">{t('metrics.results')}</span>
                                </div>
                                <span className="text-red-700 font-bold">40%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart2 size={18} className="text-blue-600" />
                        {t('recommendationsTitle')}
                    </h4>
                    <ul className="space-y-3 mb-6">
                        {t.raw('recommendations').map((rec: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${i === 0 ? 'bg-red-100 text-red-600' :
                                        i === 1 ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {i + 1}
                                </span>
                                {rec}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleFixIssues}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {t('ctaButton')}
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
