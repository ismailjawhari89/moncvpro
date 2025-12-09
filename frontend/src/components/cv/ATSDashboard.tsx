'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Shield,
    FileText,
    Zap,
    BarChart3,
    Search,
    Award,
    RefreshCw,
    Info,
    ArrowUpRight
} from 'lucide-react';
import { analyzeATS, type ATSAnalysisResult, type ATSMetric, type MetricCategory } from '@/lib/atsAnalyzer';
import type { CVData } from '@/types/cv';

interface ATSDashboardProps {
    cvData: CVData;
    jobDescription?: string;
    onImprove?: (metricId: string) => void;
    isDark?: boolean;
}

const CATEGORY_CONFIG: Record<MetricCategory, { label: string; labelAr: string; icon: any; color: string }> = {
    content: { label: 'Content Quality', labelAr: 'جودة المحتوى', icon: FileText, color: 'blue' },
    formatting: { label: 'Formatting', labelAr: 'التنسيق', icon: BarChart3, color: 'purple' },
    keywords: { label: 'Keywords', labelAr: 'الكلمات المفتاحية', icon: Search, color: 'green' },
    impact: { label: 'Impact', labelAr: 'التأثير', icon: Zap, color: 'orange' },
    completeness: { label: 'Completeness', labelAr: 'الاكتمال', icon: Shield, color: 'cyan' }
};

const GRADE_COLORS = {
    A: { bg: 'from-emerald-500 to-green-600', text: 'text-emerald-600', ring: 'ring-emerald-500' },
    B: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-600', ring: 'ring-blue-500' },
    C: { bg: 'from-amber-500 to-yellow-600', text: 'text-amber-600', ring: 'ring-amber-500' },
    D: { bg: 'from-orange-500 to-red-500', text: 'text-orange-600', ring: 'ring-orange-500' },
    F: { bg: 'from-red-600 to-rose-700', text: 'text-red-600', ring: 'ring-red-500' }
};

export default function ATSDashboard({ cvData, jobDescription, onImprove, isDark = false }: ATSDashboardProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<MetricCategory | null>(null);
    const [showAllMetrics, setShowAllMetrics] = useState(false);

    // Run analysis
    const runAnalysis = () => {
        setIsAnalyzing(true);
        // Simulate slight delay for UX
        setTimeout(() => {
            const result = analyzeATS(cvData, jobDescription);
            setAnalysis(result);
            setIsAnalyzing(false);
        }, 800);
    };

    // Auto-analyze on mount
    useEffect(() => {
        runAnalysis();
    }, []);

    // Group metrics by category
    const metricsByCategory = useMemo(() => {
        const grouped: Record<MetricCategory, ATSMetric[]> = {
            content: [],
            formatting: [],
            keywords: [],
            impact: [],
            completeness: []
        };

        if (!analysis) return grouped;

        analysis.metrics.forEach(m => {
            grouped[m.category].push(m);
        });
        return grouped;
    }, [analysis]);

    // Failed/warning metrics for priority display
    const priorityMetrics = useMemo(() => {
        if (!analysis) return [];
        return analysis.metrics
            .filter(m => m.status !== 'pass')
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 5);
    }, [analysis]);

    if (!analysis && !isAnalyzing) {
        return (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Target className="mx-auto mb-4 opacity-50" size={48} />
                <p>Click to analyze your CV</p>
                <button
                    onClick={runAnalysis}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Analyze Now
                </button>
            </div>
        );
    }

    if (isAnalyzing) {
        return (
            <div className="text-center py-16">
                <div className="relative inline-block">
                    <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <Target className="absolute inset-0 m-auto text-blue-600" size={32} />
                </div>
                <p className={`mt-6 text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Analyzing your CV...
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Checking 18 ATS compatibility metrics
                </p>
            </div>
        );
    }

    if (!analysis) return null;

    const gradeColors = GRADE_COLORS[analysis.grade];

    return (
        <div className="space-y-6">
            {/* Main Score Card */}
            <div className={`relative overflow-hidden rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${gradeColors.bg} p-6 sm:p-8`}>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Score Circle */}
                        <div className="relative">
                            <svg className="w-36 h-36 transform -rotate-90">
                                <circle
                                    cx="72" cy="72" r="64"
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="10"
                                    fill="transparent"
                                />
                                <circle
                                    cx="72" cy="72" r="64"
                                    stroke="white"
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    strokeDasharray={`${analysis.overallScore * 4.02} 402`}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-white">{analysis.overallScore}</span>
                                <span className="text-white/80 text-sm font-medium">out of 100</span>
                            </div>
                        </div>

                        {/* Grade & Summary */}
                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                                <span className="text-6xl font-black text-white">{analysis.grade}</span>
                                <div className="px-4 py-1 bg-white/20 rounded-full">
                                    <span className="text-white font-semibold">{analysis.gradeLabel}</span>
                                </div>
                            </div>
                            <p className="text-white/90 text-lg">
                                {analysis.overallScore >= 80
                                    ? "Excellent! Your CV is ATS-ready."
                                    : analysis.overallScore >= 60
                                        ? "Good progress, but there's room for improvement."
                                        : "Your CV needs optimization to pass ATS systems."}
                            </p>
                            <div className="mt-4 flex items-center gap-2 justify-center sm:justify-start">
                                <Shield className="text-white/80" size={18} />
                                <span className="text-white/80 text-sm">
                                    Estimated ATS pass rate: <strong className="text-white">{analysis.estimatedPassRate}%</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <button
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition text-white"
                    title="Re-analyze"
                >
                    <RefreshCw size={18} className={isAnalyzing ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                    const category = key as MetricCategory;
                    const score = analysis.categoryScores[category];
                    const Icon = config.icon;
                    const isExpanded = expandedCategory === category;

                    return (
                        <button
                            key={category}
                            onClick={() => setExpandedCategory(isExpanded ? null : category)}
                            className={`p-4 rounded-xl border-2 transition-all ${isExpanded
                                ? `border-${config.color}-500 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`
                                : isDark
                                    ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Icon size={18} className={`text-${config.color}-500`} />
                                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {config.label}
                                </span>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className={`text-2xl font-bold ${score >= 70 ? 'text-green-600' :
                                    score >= 50 ? 'text-amber-600' : 'text-red-600'
                                    }`}>
                                    {score}%
                                </span>
                                {isExpanded ? (
                                    <ChevronUp size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                                ) : (
                                    <ChevronDown size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Expanded Category Details */}
            {expandedCategory && (
                <div className={`rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-5 animate-in slide-in-from-top-2`}>
                    <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {CATEGORY_CONFIG[expandedCategory].label} Metrics
                    </h3>
                    <div className="space-y-3">
                        {metricsByCategory[expandedCategory]?.map(metric => (
                            <MetricRow key={metric.id} metric={metric} isDark={isDark} onImprove={onImprove} />
                        ))}
                    </div>
                </div>
            )}

            {/* Priority Improvements */}
            {priorityMetrics.length > 0 && (
                <div className={`rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-5`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <AlertTriangle className="text-amber-600" size={20} />
                        </div>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Priority Improvements
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {priorityMetrics.map((metric, index) => (
                            <div
                                key={metric.id}
                                className={`flex items-start gap-4 p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${metric.status === 'fail'
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                                    : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {metric.name}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${metric.status === 'fail'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {metric.score}%
                                        </span>
                                    </div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {metric.tip}
                                    </p>
                                </div>
                                {onImprove && (
                                    <button
                                        onClick={() => onImprove(metric.id)}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-1"
                                    >
                                        <Sparkles size={14} />
                                        Fix
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Metrics Toggle */}
            <button
                onClick={() => setShowAllMetrics(!showAllMetrics)}
                className={`w-full p-4 rounded-xl border ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
                    } flex items-center justify-center gap-2 transition`}
            >
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {showAllMetrics ? 'Hide' : 'Show'} All 18 Metrics
                </span>
                {showAllMetrics ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* All Metrics Grid */}
            {showAllMetrics && (
                <div className="grid sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                    {analysis.metrics.map(metric => (
                        <MetricCard key={metric.id} metric={metric} isDark={isDark} onImprove={onImprove} />
                    ))}
                </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Strengths */}
                {analysis.strengths.length > 0 && (
                    <div className={`rounded-xl border p-5 ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="text-green-600" size={20} />
                            <h4 className={`font-bold ${isDark ? 'text-green-400' : 'text-green-800'}`}>
                                Strengths
                            </h4>
                        </div>
                        <ul className="space-y-2">
                            {analysis.strengths.slice(0, 5).map((s, i) => (
                                <li key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-green-300' : 'text-green-700'
                                    }`}>
                                    <span className="text-green-500">✓</span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Weaknesses */}
                {analysis.weaknesses.length > 0 && (
                    <div className={`rounded-xl border p-5 ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-3">
                            <XCircle className="text-red-600" size={20} />
                            <h4 className={`font-bold ${isDark ? 'text-red-400' : 'text-red-800'}`}>
                                Areas to Improve
                            </h4>
                        </div>
                        <ul className="space-y-2">
                            {analysis.weaknesses.slice(0, 5).map((w, i) => (
                                <li key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-red-300' : 'text-red-700'
                                    }`}>
                                    <span className="text-red-500">✗</span>
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

// Individual Metric Row Component
function MetricRow({ metric, isDark, onImprove }: { metric: ATSMetric; isDark: boolean; onImprove?: (id: string) => void }) {
    return (
        <div className={`flex items-center gap-4 p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.status === 'pass' ? 'bg-green-100 dark:bg-green-900/30' :
                metric.status === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                }`}>
                {metric.status === 'pass' ? (
                    <CheckCircle2 className="text-green-600" size={20} />
                ) : metric.status === 'warning' ? (
                    <AlertTriangle className="text-amber-600" size={20} />
                ) : (
                    <XCircle className="text-red-600" size={20} />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {metric.name}
                    </span>
                    <span className="text-xs text-gray-500">Weight: {metric.weight}</span>
                </div>
                <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {metric.message}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <span className={`text-lg font-bold ${metric.score >= 70 ? 'text-green-600' :
                        metric.score >= 40 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                        {metric.score}%
                    </span>
                </div>
                {metric.status !== 'pass' && onImprove && (
                    <button
                        onClick={() => onImprove(metric.id)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                        <Sparkles size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}

// Individual Metric Card Component
function MetricCard({ metric, isDark, onImprove }: { metric: ATSMetric; isDark: boolean; onImprove?: (id: string) => void }) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className={`rounded-xl border overflow-hidden transition-all ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } ${showDetails ? 'shadow-lg' : ''}`}>
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${metric.status === 'pass' ? 'bg-green-100 dark:bg-green-900/30' :
                            metric.status === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                                'bg-red-100 dark:bg-red-900/30'
                            }`}>
                            {metric.status === 'pass' ? (
                                <CheckCircle2 className="text-green-600" size={16} />
                            ) : metric.status === 'warning' ? (
                                <AlertTriangle className="text-amber-600" size={16} />
                            ) : (
                                <XCircle className="text-red-600" size={16} />
                            )}
                        </div>
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {metric.name}
                        </h4>
                    </div>
                    <span className={`text-2xl font-bold ${metric.score >= 70 ? 'text-green-600' :
                        metric.score >= 40 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                        {metric.score}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className={`h-2 rounded-full overflow-hidden mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${metric.score >= 70 ? 'bg-green-500' :
                            metric.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${metric.score}%` }}
                    />
                </div>

                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {metric.message}
                </p>

                {/* Details Toggle */}
                {metric.details && metric.details.length > 0 && (
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className={`mt-3 text-sm flex items-center gap-1 ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                    >
                        <Info size={14} />
                        {showDetails ? 'Hide' : 'Show'} details
                    </button>
                )}
            </div>

            {/* Expanded Details */}
            {showDetails && metric.details && (
                <div className={`px-4 pb-4 pt-2 border-t ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                    <ul className="space-y-1 mb-3">
                        {metric.details.map((detail, i) => (
                            <li key={i} className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {detail}
                            </li>
                        ))}
                    </ul>
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                        <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                            💡 {metric.tip}
                        </p>
                    </div>
                </div>
            )}

            {/* Fix Button */}
            {metric.status !== 'pass' && onImprove && (
                <div className={`px-4 py-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <button
                        onClick={() => onImprove(metric.id)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition"
                    >
                        <Sparkles size={16} />
                        Auto-Fix This
                    </button>
                </div>
            )}
        </div>
    );
}
