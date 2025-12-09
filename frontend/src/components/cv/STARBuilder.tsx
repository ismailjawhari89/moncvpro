'use client';

import { useState } from 'react';
import {
    Sparkles,
    ArrowRight,
    ChevronRight,
    CheckCircle2,
    Code,
    Zap,
    Users,
    TrendingUp,
    HelpCircle,
    Copy,
    RefreshCw,
    X
} from 'lucide-react';
import { STAR_TEMPLATES, assembleSTARPoint, generateSTARPreview, type STARContent, type AchievementTemplate } from '@/lib/starFramework';

interface STARBuilderProps {
    onSave?: (text: string) => void;
    onCancel?: () => void;
    isDark?: boolean;
}

const ICONS: Record<string, any> = {
    Code,
    Zap,
    Users,
    TrendingUp
};

export default function STARBuilder({ onSave, onCancel, isDark = false }: STARBuilderProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<AchievementTemplate | null>(null);
    const [content, setContent] = useState<STARContent>({
        situation: '',
        task: '',
        action: '',
        result: ''
    });
    const [step, setStep] = useState<number>(0);
    const [preview, setPreview] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleTemplateSelect = (template: AchievementTemplate) => {
        setSelectedTemplate(template);
        setContent({ situation: '', task: '', action: '', result: '' });
        setStep(1);
    };

    const handleInputChange = (field: keyof STARContent, value: string) => {
        const newContent = { ...content, [field]: value };
        setContent(newContent);
        setPreview(generateSTARPreview(newContent));
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
        else handleFinish();
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
        else setStep(0);
    };

    const handleFinish = () => {
        setIsGenerating(true);
        // Simulate "AI Assembly" time
        setTimeout(() => {
            const finalPoint = assembleSTARPoint(content);
            if (onSave) onSave(finalPoint);
            setIsGenerating(false);
        }, 800);
    };

    // Step 0: Template Selection
    if (step === 0) {
        return (
            <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-indigo-900/50' : 'bg-white shadow-sm'}`}>
                            <Sparkles className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                STAR Method Builder
                            </h3>
                            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Create powerful, results-oriented bullet points by following the <strong className="text-indigo-600">Situation, Task, Action, Result</strong> framework.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    {STAR_TEMPLATES.map(template => {
                        const Icon = ICONS[template.icon] || Sparkles;
                        return (
                            <button
                                key={template.id}
                                onClick={() => handleTemplateSelect(template)}
                                className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${isDark
                                        ? 'bg-gray-800 border-gray-700 hover:border-indigo-500 hover:bg-gray-750'
                                        : 'bg-white border-gray-200 hover:border-indigo-400 hover:shadow-md'
                                    }`}
                            >
                                <div className={`p-3 rounded-lg ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h4 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {template.label}
                                    </h4>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {Object.values(template.prompts)[0].split('?')[0]}...
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Builder Steps
    const currentField = ['situation', 'task', 'action', 'result'][step - 1] as keyof STARContent;
    const labels = { situation: 'Situation', task: 'Task', action: 'Action', result: 'Result' };
    const prompt = selectedTemplate?.prompts[currentField];
    const example = selectedTemplate?.example[currentField];

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header / Progress */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => setStep(0)}
                    className={`text-sm flex items-center gap-1 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <X size={16} /> Choose different template
                </button>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            className={`h-2 w-8 rounded-full transition-all ${s === step
                                    ? 'bg-indigo-600'
                                    : s < step
                                        ? 'bg-green-500'
                                        : isDark ? 'bg-gray-700' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 flex flex-col gap-6`}>
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-sm">
                        <span className="w-5 h-5 bg-white dark:bg-indigo-500 rounded-full flex items-center justify-center text-xs">
                            {labels[currentField][0]}
                        </span>
                        {labels[currentField]}
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {prompt}
                    </h2>
                </div>

                <div className="relative">
                    <textarea
                        value={content[currentField]}
                        onChange={(e) => handleInputChange(currentField, e.target.value)}
                        placeholder={`Example: ${example}`}
                        className={`w-full h-32 p-5 rounded-2xl border-2 resize-none text-lg transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${isDark
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
                            }`}
                        autoFocus
                    />
                    {content[currentField].length > 10 && (
                        <div className="absolute bottom-4 right-4 text-green-500 animate-in fade-in zoom-in">
                            <CheckCircle2 size={24} />
                        </div>
                    )}
                </div>

                {/* Example Box */}
                <div className={`p-4 rounded-xl border border-dashed ${isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <div className="flex items-start gap-2">
                        <HelpCircle size={18} className="text-gray-400 mt-0.5" />
                        <div>
                            <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Good Example
                            </span>
                            <p className={`text-sm italic ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                "{example}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={prevStep}
                    className={`px-6 py-3 rounded-xl font-medium transition ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={content[currentField].length < 5}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all ${content[currentField].length < 5
                            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-70'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 hover:scale-105'
                        }`}
                >
                    {step === 4 ? (
                        isGenerating ? (
                            <>
                                <RefreshCw size={20} className="animate-spin" />
                                Assembling...
                            </>
                        ) : (
                            <>
                                Finish & Create
                                <Sparkles size={20} />
                            </>
                        )
                    ) : (
                        <>
                            Next Step
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
