'use client';

import React, { useState } from 'react';
import { CoverLetterData, AIAnalysis } from '@/types/cover-letter';
import { Sparkles, Wand2, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AIAssistantPanelProps {
    data: CoverLetterData;
    onUpdateContent: (section: string, text: string) => void;
    isDark?: boolean;
}

export default function AIAssistantPanel({ data, onUpdateContent, isDark = false }: AIAssistantPanelProps) {
    const [analyzing, setAnalyzing] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

    const handleAnalyze = () => {
        setAnalyzing(true);
        // Simulate API call
        setTimeout(() => {
            setAnalysis({
                grammarScore: 85,
                toneScore: 90,
                keywordScore: 75,
                readabilityScore: 80,
                suggestions: [
                    "Consider using more active verbs in the first paragraph.",
                    "Mention specific metrics in your experience section.",
                    "The closing is strong, but could be more personalized."
                ],
                improvements: []
            });
            setAnalyzing(false);
        }, 1500);
    };

    const handleGenerate = () => {
        setGenerating(true);
        // Simulate API call
        setTimeout(() => {
            onUpdateContent('introduction', "I am writing to express my enthusiastic interest in the [Job Title] position at [Company Name]. With over [Number] years of experience in [Field] and a proven track record of [Key Achievement], I am confident in my ability to contribute effectively to your team.");
            setGenerating(false);
        }, 2000);
    };

    const cardClasses = `p-4 rounded-xl border mb-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`;

    return (
        <div className="space-y-4">
            {/* AI Actions */}
            <div className={cardClasses}>
                <div className="flex items-center gap-2 mb-4 text-purple-600 dark:text-purple-400">
                    <Sparkles size={20} />
                    <h3 className="font-bold">AI Assistant</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70"
                    >
                        {analyzing ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                        Analyze Draft
                    </button>

                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 border rounded-lg font-medium transition-colors disabled:opacity-70 ${isDark
                                ? 'border-purple-500 text-purple-400 hover:bg-purple-900/20'
                                : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                            }`}
                    >
                        {generating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                        Generate Content
                    </button>
                </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
                <div className={`${cardClasses} animate-in fade-in slide-in-from-bottom-4`}>
                    <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Analysis Results
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <ScoreCard label="Grammar" score={analysis.grammarScore} isDark={isDark} />
                        <ScoreCard label="Tone" score={analysis.toneScore} isDark={isDark} />
                        <ScoreCard label="Keywords" score={analysis.keywordScore} isDark={isDark} />
                        <ScoreCard label="Readability" score={analysis.readabilityScore} isDark={isDark} />
                    </div>

                    <div className="space-y-2">
                        <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Suggestions
                        </h4>
                        {analysis.suggestions.map((suggestion, i) => (
                            <div key={i} className={`flex gap-2 text-sm p-2 rounded-lg ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'
                                }`}>
                                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                <span>{suggestion}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Tips */}
            {!analysis && (
                <div className={cardClasses}>
                    <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Writing Tips
                    </h3>
                    <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <li className="flex gap-2">
                            <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                            Keep it under one page
                        </li>
                        <li className="flex gap-2">
                            <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                            Tailor to the job description
                        </li>
                        <li className="flex gap-2">
                            <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                            Use active voice
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

function ScoreCard({ label, score, isDark }: { label: string; score: number; isDark: boolean }) {
    const getColor = (s: number) => {
        if (s >= 90) return 'text-green-500';
        if (s >= 70) return 'text-blue-500';
        if (s >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
            <div className={`text-xl font-bold mb-1 ${getColor(score)}`}>
                {score}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {label}
            </div>
        </div>
    );
}
