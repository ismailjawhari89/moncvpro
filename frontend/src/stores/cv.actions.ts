import { StateCreator } from 'zustand';
import {
    CVData,
    PersonalInfo,
    Experience,
    Education,
    Skill,
    Language,
    TemplateType,
    AISuggestion,
    CoverLetterData
} from '@/types/cv';
import { HistorySlice } from './cv.history';
import { getAITemplateById } from '@/data/ai-templates/ai-templates';
import { getTemplateSampleCVData, mergeSampleDataWithExisting, hasMinimalData } from '@/utils/templateDataConverter';
import { CVAIService } from '@/services/cvAI.service';

export interface CVActionsSlice {
    // PersonalInfo
    updateTimestamp: () => void;
    updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
    updateSummary: (data: string) => void;

    // Experience
    addExperience: (exp: Experience) => void;
    removeExperience: (id: string) => void;
    updateExperience: (id: string, field: keyof Experience, value: any) => void;
    reorderExperiences: (oldIndex: number, newIndex: number) => void;

    // Education
    addEducation: (edu: Education) => void;
    removeEducation: (id: string) => void;
    updateEducation: (id: string, field: keyof Education, value: any) => void;

    // Skills
    addSkill: (skill: Skill) => void;
    removeSkill: (id: string) => void;
    updateSkill: (id: string, field: keyof Skill, value: any) => void;

    // Languages
    addLanguage: (lang: Language) => void;
    removeLanguage: (id: string) => void;
    updateLanguage: (id: string, field: keyof Language, value: any) => void;

    // Template Actions
    applyTemplate: (templateData: Partial<CVData>) => void;
    setSelectedTemplate: (templateId: TemplateType) => void;
    setSelectedTheme: (themeId: string) => void;
    setContentLanguage: (lang: 'en' | 'ar' | 'fr') => void;

    // Smart Template Actions
    applyTemplateWithSampleData: (templateId: string, fillEmptyOnly?: boolean) => void;
    loadSampleDataForCurrentTemplate: () => void;
    clearSampleData: () => void;

    // Reset
    resetToDefault: () => void;

    // AI Actions (These manipulate state, even if driven by AI)
    applyAISuggestion: (suggestion: Partial<CVData>, actionName?: string) => void;
    addAISuggestions: (suggestions: AISuggestion[]) => void;
    acceptAISuggestion: (id: string) => void;
    acceptAllSuggestions: () => void;
    rejectAISuggestion: (id: string) => void;
    clearAISuggestions: () => void;
    setAIProcessing: (isProcessing: boolean) => void;

    // Logic Wrappers (delegating to service but updating state)
    improveExperienceWithActionVerbs: (experienceId: string) => string;
    improveSummaryWithKeywords: (keywords: string[]) => string;
    addQuantifiableMetrics: (experienceId: string, metrics: { metric: string; value: string }[]) => void;
    autoImproveAll: () => { section: string; improvement: string }[];
    setTargetJob: (jobDescription: string) => void;
    updateCoverLetter: (data: Partial<CoverLetterData>) => void;
}

// Helper for array reordering
function arrayMove<T>(arr: T[], from: number, to: number): T[] {
    const newArr = [...arr];
    const [item] = newArr.splice(from, 1);
    newArr.splice(to, 0, item);
    return newArr;
}

// Default empty state helper
export const defaultCVData: CVData = {
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        profession: '',
        linkedin: '',
        github: ''
    },
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    template: 'modern',
    contentLanguage: 'en',
    targetJob: '',
    coverLetter: {
        content: '',
    },
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        lastAutoSave: new Date().toISOString(),
        lastModified: Date.now()
    }
};

export const createCVActionsSlice: StateCreator<
    CVActionsSlice & { cvData: CVData; isApplyingTemplate: boolean; isAIProcessing: boolean; aiSuggestions: AISuggestion[] } & HistorySlice,
    [],
    [],
    CVActionsSlice
> = (set, get) => ({
    // Helper to update lastModified timestamp
    updateTimestamp: () => {
        set((state) => ({
            cvData: {
                ...state.cvData,
                metadata: {
                    ...state.cvData.metadata,
                    lastModified: Date.now()
                }
            }
        }));
    },
    // ============ PERSONAL INFO ============
    updatePersonalInfo: (data) => {
        get().captureHistory('Update Personal Info');
        set((state) => ({
            cvData: {
                ...state.cvData,
                personalInfo: { ...state.cvData.personalInfo, ...data }
            }
        }));
        get().updateTimestamp();
    },

    updateSummary: (data) => {
        get().captureHistory('Update Summary');
        set((state) => ({
            cvData: { ...state.cvData, summary: data }
        }));
    },

    // ============ EXPERIENCE ============
    addExperience: (exp) => {
        get().captureHistory('Add Experience');
        set((state) => ({
            cvData: {
                ...state.cvData,
                experiences: [...state.cvData.experiences, exp]
            }
        }));
    },

    removeExperience: (id) => {
        get().captureHistory('Remove Experience');
        set((state) => ({
            cvData: {
                ...state.cvData,
                experiences: state.cvData.experiences.filter(e => e.id !== id)
            }
        }));
    },

    updateExperience: (id, field, value) => {
        set((state) => ({
            cvData: {
                ...state.cvData,
                experiences: state.cvData.experiences.map(e =>
                    e.id === id ? { ...e, [field]: value } : e
                )
            }
        }));
    },

    reorderExperiences: (oldIndex, newIndex) => {
        get().captureHistory('Reorder Experiences');
        set((state) => ({
            cvData: {
                ...state.cvData,
                experiences: arrayMove(state.cvData.experiences, oldIndex, newIndex)
            }
        }));
    },

    // ============ EDUCATION ============
    addEducation: (edu) => {
        get().captureHistory('Add Education');
        set((state) => ({
            cvData: {
                ...state.cvData,
                education: [...state.cvData.education, edu]
            }
        }));
    },

    removeEducation: (id) => {
        get().captureHistory('Remove Education');
        set((state) => ({
            cvData: {
                ...state.cvData,
                education: state.cvData.education.filter(e => e.id !== id)
            }
        }));
    },

    updateEducation: (id, field, value) => {
        set((state) => ({
            cvData: {
                ...state.cvData,
                education: state.cvData.education.map(e =>
                    e.id === id ? { ...e, [field]: value } : e
                )
            }
        }));
    },

    // ============ SKILLS ============
    addSkill: (skill) => {
        get().captureHistory('Add Skill');
        set((state) => ({
            cvData: {
                ...state.cvData,
                skills: [...state.cvData.skills, skill]
            }
        }));
    },

    removeSkill: (id) => {
        get().captureHistory('Remove Skill');
        set((state) => ({
            cvData: {
                ...state.cvData,
                skills: state.cvData.skills.filter(s => s.id !== id)
            }
        }));
    },

    updateSkill: (id, field, value) => {
        set((state) => ({
            cvData: {
                ...state.cvData,
                skills: state.cvData.skills.map(s =>
                    s.id === id ? { ...s, [field]: value } : s
                )
            }
        }));
    },

    // ============ LANGUAGES ============
    addLanguage: (lang) => {
        get().captureHistory('Add Language');
        set((state) => ({
            cvData: {
                ...state.cvData,
                languages: [...state.cvData.languages, lang]
            }
        }));
    },

    removeLanguage: (id) => {
        get().captureHistory('Remove Language');
        set((state) => ({
            cvData: {
                ...state.cvData,
                languages: state.cvData.languages.filter(l => l.id !== id)
            }
        }));
    },

    updateLanguage: (id, field, value) => {
        set((state) => ({
            cvData: {
                ...state.cvData,
                languages: state.cvData.languages.map(l =>
                    l.id === id ? { ...l, [field]: value } : l
                )
            }
        }));
    },

    // ============ TEMPLATE ACTIONS ============
    applyTemplate: (templateData) => {
        get().captureHistory('Apply Template');
        set({ isApplyingTemplate: true });

        set((state) => ({
            cvData: {
                ...state.cvData,
                personalInfo: templateData.personalInfo
                    ? { ...templateData.personalInfo }
                    : state.cvData.personalInfo,
                summary: templateData.summary ?? state.cvData.summary,
                experiences: templateData.experiences
                    ? [...templateData.experiences]
                    : state.cvData.experiences,
                education: templateData.education
                    ? [...templateData.education]
                    : state.cvData.education,
                skills: templateData.skills
                    ? [...templateData.skills]
                    : state.cvData.skills,
                languages: templateData.languages
                    ? [...templateData.languages]
                    : state.cvData.languages,
                template: templateData.template
                    ?? state.cvData.template,
                metadata: templateData.metadata ?? state.cvData.metadata
            },
            isApplyingTemplate: false
        }));
    },

    setSelectedTemplate: (templateId) =>
        set((state) => ({
            cvData: {
                ...state.cvData,
                template: templateId,
                theme: undefined
            }
        })),

    setSelectedTheme: (themeId: string) =>
        set((state) => ({
            cvData: {
                ...state.cvData,
                theme: themeId
            }
        })),

    setContentLanguage: (lang) =>
        set((state) => ({
            cvData: {
                ...state.cvData,
                contentLanguage: lang
            }
        })),

    // ============ SMART TEMPLATE ACTIONS ============
    applyTemplateWithSampleData: (templateId, fillEmptyOnly = true) => {
        const { cvData, captureHistory } = get();

        captureHistory('Apply Template with Sample Data');
        set({ isApplyingTemplate: true });

        const template = getAITemplateById(templateId);
        if (!template) {
            set({ isApplyingTemplate: false });
            return;
        }

        const sampleCVData = getTemplateSampleCVData(templateId);

        if (sampleCVData && (fillEmptyOnly ? hasMinimalData(cvData) : true)) {
            const mergedData = mergeSampleDataWithExisting(cvData, sampleCVData, fillEmptyOnly);

            set({
                cvData: {
                    ...mergedData,
                    template: templateId as TemplateType,
                    theme: undefined,
                    metadata: {
                        ...mergedData.metadata,
                        updatedAt: new Date().toISOString()
                    }
                },
                isApplyingTemplate: false
            });
        } else {
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    template: templateId as TemplateType,
                    theme: undefined,
                    metadata: {
                        ...state.cvData.metadata,
                        updatedAt: new Date().toISOString()
                    }
                },
                isApplyingTemplate: false
            }));
        }
    },

    loadSampleDataForCurrentTemplate: () => {
        const { cvData, captureHistory } = get();
        const templateId = cvData.template;

        if (!templateId) return;

        captureHistory('Load Sample Data');
        const sampleCVData = getTemplateSampleCVData(templateId);

        if (sampleCVData) {
            const mergedData = mergeSampleDataWithExisting(cvData, sampleCVData, false);
            set({
                cvData: {
                    ...mergedData,
                    metadata: {
                        ...mergedData.metadata,
                        updatedAt: new Date().toISOString()
                    }
                }
            });
        }
    },

    clearSampleData: () => {
        const { captureHistory } = get();
        captureHistory('Clear Sample Data');
        set({ cvData: { ...defaultCVData } });
    },

    resetToDefault: () => {
        const { captureHistory } = get();
        captureHistory('Reset CV');
        set({ cvData: { ...defaultCVData } });
    },

    // ============ AI ACTIONS ============
    applyAISuggestion: (suggestion, actionName = 'AI Suggestion Applied') => {
        const { captureHistory } = get();
        captureHistory(actionName);

        set((state) => ({
            cvData: {
                ...state.cvData,
                personalInfo: suggestion.personalInfo
                    ? { ...state.cvData.personalInfo, ...suggestion.personalInfo }
                    : state.cvData.personalInfo,
                summary: suggestion.summary ?? state.cvData.summary,
                experiences: suggestion.experiences
                    ? [...suggestion.experiences]
                    : state.cvData.experiences,
                education: suggestion.education
                    ? [...suggestion.education]
                    : state.cvData.education,
                skills: suggestion.skills
                    ? [...suggestion.skills]
                    : state.cvData.skills,
                languages: suggestion.languages
                    ? [...suggestion.languages]
                    : state.cvData.languages,
            }
        }));
    },

    addAISuggestions: (suggestions) => {
        set((state) => ({
            aiSuggestions: [...state.aiSuggestions, ...suggestions]
        }));
    },

    acceptAISuggestion: (id: string) => {
        const suggestion = get().aiSuggestions.find(s => s.id === id);
        if (!suggestion) return;

        get().captureHistory(`AI: Apply ${suggestion.improvementBrief}`);

        set((state) => {
            const newData = { ...state.cvData };

            // Logic to apply based on type
            if (suggestion.type === 'personal' && suggestion.field) {
                newData.personalInfo = {
                    ...newData.personalInfo,
                    [suggestion.field]: suggestion.suggestedContent
                };
            } else if (suggestion.type === 'summary') {
                newData.summary = suggestion.suggestedContent;
            } else if (suggestion.type === 'experience' && suggestion.targetId && suggestion.field) {
                newData.experiences = newData.experiences.map(exp =>
                    exp.id === suggestion.targetId
                        ? { ...exp, [suggestion.field!]: suggestion.suggestedContent }
                        : exp
                );
            } else if (suggestion.type === 'education' && suggestion.targetId && suggestion.field) {
                newData.education = newData.education.map(edu =>
                    edu.id === suggestion.targetId
                        ? { ...edu, [suggestion.field!]: suggestion.suggestedContent }
                        : edu
                );
            } else if (suggestion.type === 'skill' && suggestion.targetId) {
                newData.skills = newData.skills.map(s =>
                    s.id === suggestion.targetId
                        ? { ...s, name: suggestion.suggestedContent }
                        : s
                );
            }

            return {
                cvData: newData,
                aiSuggestions: state.aiSuggestions.filter(s => s.id !== id)
            };
        });
    },

    acceptAllSuggestions: () => {
        const suggestions = get().aiSuggestions;
        if (suggestions.length === 0) return;

        get().captureHistory(`AI: Apply all ${suggestions.length} improvements`);

        set((state) => {
            let newData = { ...state.cvData };

            suggestions.forEach(suggestion => {
                // Logic to apply based on type (Dry-ed logic from acceptAISuggestion)
                if (suggestion.type === 'personal' && suggestion.field) {
                    newData.personalInfo = {
                        ...newData.personalInfo,
                        [suggestion.field]: suggestion.suggestedContent
                    };
                } else if (suggestion.type === 'summary') {
                    newData.summary = suggestion.suggestedContent;
                } else if (suggestion.type === 'experience' && suggestion.targetId && suggestion.field) {
                    newData.experiences = newData.experiences.map(exp =>
                        exp.id === suggestion.targetId
                            ? { ...exp, [suggestion.field!]: suggestion.suggestedContent }
                            : exp
                    );
                } else if (suggestion.type === 'education' && suggestion.targetId && suggestion.field) {
                    newData.education = newData.education.map(edu =>
                        edu.id === suggestion.targetId
                            ? { ...edu, [suggestion.field!]: suggestion.suggestedContent }
                            : edu
                    );
                } else if (suggestion.type === 'skill' && suggestion.targetId) {
                    newData.skills = newData.skills.map(s =>
                        s.id === suggestion.targetId
                            ? { ...s, name: suggestion.suggestedContent }
                            : s
                    );
                }
            });

            return {
                cvData: newData,
                aiSuggestions: []
            };
        });
    },

    rejectAISuggestion: (id: string) => {
        set((state) => ({
            aiSuggestions: state.aiSuggestions.filter(s => s.id !== id)
        }));
    },

    clearAISuggestions: () => {
        set({ aiSuggestions: [] });
    },

    setAIProcessing: (isProcessing) => {
        set({ isAIProcessing: isProcessing });
    },

    // ============ LOGIC WRAPPERS (Pure Logic Delegates to Service) ============
    improveExperienceWithActionVerbs: (experienceId: string) => {
        const { cvData, captureHistory } = get();
        const experience = cvData.experiences.find(e => e.id === experienceId);

        if (!experience) return '';

        captureHistory('Improve Experience with Action Verbs');

        const improvedDescription = CVAIService.addActionVerb(experience.description);

        set((state) => ({
            cvData: {
                ...state.cvData,
                experiences: state.cvData.experiences.map(e =>
                    e.id === experienceId
                        ? { ...e, description: improvedDescription }
                        : e
                )
            }
        }));

        return improvedDescription;
    },

    improveSummaryWithKeywords: (keywords: string[]) => {
        const { cvData, captureHistory } = get();

        if (!cvData.summary) return cvData.summary;

        captureHistory('Improve Summary with Keywords');

        const improvedSummary = CVAIService.improveSummaryWithKeywords(cvData.summary, keywords);

        set((state) => ({
            cvData: {
                ...state.cvData,
                summary: improvedSummary
            }
        }));

        return improvedSummary;
    },

    addQuantifiableMetrics: (experienceId: string, metrics: { metric: string; value: string }[]) => {
        const { cvData, captureHistory } = get();
        const experience = cvData.experiences.find(e => e.id === experienceId);

        if (!experience) return;

        captureHistory('Add Quantifiable Metrics');

        let improvedDesc = experience.description;
        metrics.forEach(({ metric, value }) => {
            if (!improvedDesc.includes(value)) {
                improvedDesc += ` ${metric}: ${value}.`;
            }
        });

        set((state) => ({
            cvData: {
                ...state.cvData,
                experiences: state.cvData.experiences.map(e =>
                    e.id === experienceId
                        ? { ...e, description: improvedDesc }
                        : e
                )
            }
        }));
    },

    autoImproveAll: () => {
        const { cvData, captureHistory } = get();
        captureHistory('Auto Improve All Sections');

        const { improvedData, report } = CVAIService.autoImproveAll(cvData);

        set({
            cvData: improvedData
        });

        return report;
    },

    setTargetJob: (jobDescription: string) =>
        set((state) => ({
            cvData: {
                ...state.cvData,
                targetJob: jobDescription
            }
        })),

    updateCoverLetter: (data: Partial<CoverLetterData>) =>
        set((state) => ({
            cvData: {
                ...state.cvData,
                coverLetter: {
                    ...(state.cvData.coverLetter || { content: '' }),
                    ...data
                }
            }
        })),
});
