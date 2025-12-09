'use client';

import { useState, useMemo } from 'react';
import {
    Target,
    Search,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Briefcase,
    GraduationCap,
    Award,
    Zap,
    Copy,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    Star,
    FileText,
    RefreshCw,
    Info,
    Plus,
    Clipboard
} from 'lucide-react';
import { matchJobDescription, type JobMatchResult } from '@/lib/jobMatcher';
import type { CVData } from '@/types/cv';

interface JobMatcherProps {
    cvData: CVData;
    onAddSkill?: (skill: string) => void;
    onAddKeyword?: (keyword: string, section: 'summary' | 'experience') => void;
    isDark?: boolean;
}

const GRADE_STYLES = {
    A: { bg: 'from-emerald-500 to-green-600', light: 'bg-emerald-100 text-emerald-700', badge: 'bg-emerald-500' },
    B: { bg: 'from-blue-500 to-indigo-600', light: 'bg-blue-100 text-blue-700', badge: 'bg-blue-500' },
    C: { bg: 'from-amber-500 to-yellow-600', light: 'bg-amber-100 text-amber-700', badge: 'bg-amber-500' },
    D: { bg: 'from-orange-500 to-red-500', light: 'bg-orange-100 text-orange-700', badge: 'bg-orange-500' },
    F: { bg: 'from-red-600 to-rose-700', light: 'bg-red-100 text-red-700', badge: 'bg-red-500' }
};

export default function JobMatcher({ cvData, onAddSkill, onAddKeyword, isDark = false }: JobMatcherProps) {
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<JobMatchResult | null>(null);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['skills', 'actions']));
    const [copied, setCopied] = useState(false);

    const handleAnalyze = () => {
        if (!jobDescription.trim()) return;

        setIsAnalyzing(true);
        // Simulate processing delay for UX
        setTimeout(() => {
            const matchResult = matchJobDescription(cvData, jobDescription);
            setResult(matchResult);
            setIsAnalyzing(false);
        }, 1000);
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setJobDescription(text);
        } catch (err) {
            console.error('Failed to paste:', err);
        }
    };

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(section)) {
            newExpanded.delete(section);
        } else {
            newExpanded.add(section);
        }
        setExpandedSections(newExpanded);
    };

    const handleCopySkills = () => {
        if (!result) return;
        const skills = result.missingSkills.join(', ');
        navigator.clipboard.writeText(skills);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // If no result yet, show input form
    if (!result) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                            <Target className="text-blue-600" size={28} />
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Job Description Matcher
                            </h3>
                            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Paste a job description to see how well your CV matches and get personalized suggestions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-100 bg-gray-50'}`}>
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Job Description
                        </span>
                        <button
                            onClick={handlePaste}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${isDark
                                    ? 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                        >
                            <Clipboard size={14} />
                            Paste from Clipboard
                        </button>
                    </div>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here...

Example:
We are looking for a Senior Full Stack Developer with 5+ years of experience in React, Node.js, and TypeScript. The ideal candidate should have strong problem-solving skills, experience with AWS, and excellent communication abilities..."
                        rows={10}
                        className={`w-full px-4 py-4 resize-none outline-none ${isDark
                                ? 'bg-gray-800 text-white placeholder-gray-500'
                                : 'bg-white text-gray-900 placeholder-gray-400'
                            }`}
                    />
                </div>

                {/* Analyze Button */}
                <button
                    onClick={handleAnalyze}
                    disabled={!jobDescription.trim() || isAnalyzing}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${jobDescription.trim() && !isAnalyzing
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isAnalyzing ? (
                        <>
                            <RefreshCw size={22} className="animate-spin" />
                            Analyzing Match...
                        </>
                    ) : (
                        <>
                            <Search size={22} />
                            Analyze Match
                        </>
                    )}
                </button>

                {/* Tips */}
                <div className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <Info size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <strong>Pro tip:</strong> Copy the entire job posting including requirements, qualifications, and responsibilities for the most accurate analysis.
                    </p>
                </div>
            </div>
        );
    }

    // Show results
    const gradeStyle = GRADE_STYLES[result.matchGrade];

    return (
        <div className="space-y-6">
            {/* Match Score Header */}
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradeStyle.bg} p-6 text-white`}>
                <div className="flex items-center gap-6">
                    {/* Score Circle */}
                    <div className="relative">
                        <svg className="w-28 h-28 transform -rotate-90">
                            <circle
                                cx="56" cy="56" r="48"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            <circle
                                cx="56" cy="56" r="48"
                                stroke="white"
                                strokeWidth="8"
                                fill="transparent"
                                strokeLinecap="round"
                                strokeDasharray={`${result.matchScore * 3.02} 302`}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold">{result.matchScore}%</span>
                        </div>
                    </div>

                    {/* Match Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-5xl font-black">{result.matchGrade}</span>
                            <span className="px-4 py-1 bg-white/20 rounded-full font-semibold">
                                {result.matchLabel}
                            </span>
                        </div>
                        <p className="text-white/90">
                            {result.matchScore >= 70
                                ? "Great match! Your CV aligns well with this position."
                                : result.matchScore >= 50
                                    ? "Moderate match. Some adjustments can improve your chances."
                                    : "This role requires skills you may be missing. See suggestions below."}
                        </p>
                    </div>
                </div>

                {/* New Analysis Button */}
                <button
                    onClick={() => setResult(null)}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
                    title="Analyze new job"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                    icon={CheckCircle2}
                    iconColor="text-green-500"
                    label="Matching Skills"
                    value={result.matchingSkills.length}
                    isDark={isDark}
                />
                <StatCard
                    icon={XCircle}
                    iconColor="text-red-500"
                    label="Missing Skills"
                    value={result.missingSkills.length}
                    isDark={isDark}
                />
                <StatCard
                    icon={result.experienceMatch.status === 'exceeds' || result.experienceMatch.status === 'meets' ? TrendingUp : TrendingDown}
                    iconColor={result.experienceMatch.status === 'exceeds' || result.experienceMatch.status === 'meets' ? 'text-green-500' : 'text-amber-500'}
                    label="Experience"
                    value={`${result.experienceMatch.yours}yr`}
                    sublabel={result.experienceMatch.required || 'Any'}
                    isDark={isDark}
                />
                <StatCard
                    icon={GraduationCap}
                    iconColor={result.educationMatch.status === 'meets' ? 'text-green-500' : 'text-amber-500'}
                    label="Education"
                    value={result.educationMatch.status === 'meets' ? '✓' : '○'}
                    isDark={isDark}
                />
            </div>

            {/* Insights Card */}
            {result.insights.competitiveAdvantage && (
                <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${isDark ? 'bg-emerald-900/20 border-emerald-700' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                    <Star className="text-emerald-500 flex-shrink-0" size={24} />
                    <div>
                        <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            Competitive Advantage:
                        </span>
                        <span className={`ml-2 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                            {result.insights.competitiveAdvantage}
                        </span>
                    </div>
                </div>
            )}

            {/* Skills Match Section */}
            <CollapsibleSection
                title="Skills Analysis"
                icon={Zap}
                isExpanded={expandedSections.has('skills')}
                onToggle={() => toggleSection('skills')}
                isDark={isDark}
                badge={`${result.matchingSkills.length}/${result.matchingSkills.length + result.missingSkills.length}`}
            >
                <div className="space-y-4">
                    {/* Matching Skills */}
                    {result.matchingSkills.length > 0 && (
                        <div>
                            <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                                <CheckCircle2 size={16} />
                                Matching Skills ({result.matchingSkills.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.matchingSkills.map((skill, i) => (
                                    <span key={i} className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                                        }`}>
                                        ✓ {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Missing Skills */}
                    {result.missingSkills.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                                    <XCircle size={16} />
                                    Missing Skills ({result.missingSkills.length})
                                </h4>
                                <button
                                    onClick={handleCopySkills}
                                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Copy size={12} />
                                    {copied ? 'Copied!' : 'Copy all'}
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {result.missingSkills.map((skill, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onAddSkill?.(skill)}
                                        className={`group flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition ${isDark
                                                ? 'bg-red-900/30 text-red-300 hover:bg-blue-900/50 hover:text-blue-300'
                                                : 'bg-red-100 text-red-700 hover:bg-blue-100 hover:text-blue-700'
                                            }`}
                                        title={onAddSkill ? 'Click to add to your CV' : skill}
                                    >
                                        <span className="group-hover:hidden">✗</span>
                                        <Plus size={14} className="hidden group-hover:block" />
                                        {skill}
                                    </button>
                                ))}
                            </div>
                            {onAddSkill && (
                                <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Click on a skill to add it to your CV
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            {/* Keywords Section */}
            <CollapsibleSection
                title="Keywords Analysis"
                icon={Search}
                isExpanded={expandedSections.has('keywords')}
                onToggle={() => toggleSection('keywords')}
                isDark={isDark}
                badge={`${result.matchingKeywords.length}/${result.matchingKeywords.length + result.missingKeywords.length}`}
            >
                <div className="space-y-4">
                    {result.matchingKeywords.length > 0 && (
                        <div>
                            <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Found in your CV
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.matchingKeywords.map((kw, i) => (
                                    <span key={i} className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {result.missingKeywords.length > 0 && (
                        <div>
                            <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                                Consider adding these keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.missingKeywords.map((kw, i) => (
                                    <span key={i} className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        + {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            {/* Priority Actions */}
            <CollapsibleSection
                title="Priority Improvements"
                icon={Sparkles}
                isExpanded={expandedSections.has('actions')}
                onToggle={() => toggleSection('actions')}
                isDark={isDark}
                badge={`${result.priorityActions.length}`}
            >
                <div className="space-y-3">
                    {result.priorityActions.map((action, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-4 p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${action.priority === 'high'
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                    : action.priority === 'medium'
                                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                {i + 1}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${action.category === 'skill' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                            action.category === 'keyword' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                action.category === 'experience' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                        {action.category}
                                    </span>
                                    <span className={`text-xs ${action.priority === 'high' ? 'text-red-500' :
                                            action.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                                        }`}>
                                        {action.priority} priority
                                    </span>
                                </div>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-800'}>
                                    {action.action}
                                </p>
                            </div>
                            {action.canAutoFix && (
                                <button
                                    onClick={() => {
                                        if (action.category === 'skill') {
                                            // Extract skill name from action
                                            const match = action.action.match(/"([^"]+)"/);
                                            if (match) onAddSkill?.(match[1]);
                                        }
                                    }}
                                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center gap-1 flex-shrink-0"
                                >
                                    <Plus size={14} />
                                    Add
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </CollapsibleSection>

            {/* Extracted Requirements (collapsed by default) */}
            <CollapsibleSection
                title="Extracted Requirements"
                icon={FileText}
                isExpanded={expandedSections.has('requirements')}
                onToggle={() => toggleSection('requirements')}
                isDark={isDark}
            >
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <RequirementList
                        title="Technical Skills"
                        items={result.extractedRequirements.hardSkills}
                        isDark={isDark}
                    />
                    <RequirementList
                        title="Soft Skills"
                        items={result.extractedRequirements.softSkills}
                        isDark={isDark}
                    />
                    <RequirementList
                        title="Experience"
                        items={result.extractedRequirements.experience}
                        isDark={isDark}
                    />
                    <RequirementList
                        title="Education"
                        items={result.extractedRequirements.education}
                        isDark={isDark}
                    />
                    <RequirementList
                        title="Tools"
                        items={result.extractedRequirements.tools}
                        isDark={isDark}
                    />
                    <RequirementList
                        title="Certifications"
                        items={result.extractedRequirements.certifications}
                        isDark={isDark}
                    />
                </div>
            </CollapsibleSection>

            {/* Analyze Another */}
            <button
                onClick={() => setResult(null)}
                className={`w-full py-4 rounded-xl font-bold border-2 transition ${isDark
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
            >
                <RefreshCw size={18} className="inline mr-2" />
                Analyze Another Job Description
            </button>
        </div>
    );
}

// Helper Components

function StatCard({ icon: Icon, iconColor, label, value, sublabel, isDark }: {
    icon: any;
    iconColor: string;
    label: string;
    value: string | number;
    sublabel?: string;
    isDark: boolean;
}) {
    return (
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon size={18} className={iconColor} />
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
            </div>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
            {sublabel && (
                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>req: {sublabel}</div>
            )}
        </div>
    );
}

function CollapsibleSection({ title, icon: Icon, isExpanded, onToggle, children, isDark, badge }: {
    title: string;
    icon: any;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    isDark: boolean;
    badge?: string;
}) {
    return (
        <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-4 ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition`}
            >
                <div className="flex items-center gap-3">
                    <Icon size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</span>
                    {badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            {badge}
                        </span>
                    )}
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isExpanded && (
                <div className={`p-4 pt-0 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="pt-4">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

function RequirementList({ title, items, isDark }: { title: string; items: string[]; isDark: boolean }) {
    if (items.length === 0) return null;

    return (
        <div>
            <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h4>
            <div className="flex flex-wrap gap-1">
                {items.map((item, i) => (
                    <span key={i} className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
