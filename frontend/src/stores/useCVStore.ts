import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
    CVData,
    PersonalInfo,
    Experience,
    Education,
    Skill,
    Language,
    TemplateType
} from '@/types/cv';
import {
    getTemplateSampleCVData,
    mergeSampleDataWithExisting,
    hasMinimalData,
    getTemplateColors,
    getTemplateTypography
} from '@/utils/templateDataConverter';
import { getEnhancedTemplateById } from '@/data/enhanced-templates';
import arTemplates from '@/i18n/locales/templates/ar.json';

// AI Suggestion Types
export interface AISuggestion {
    id: string;
    type: 'summary' | 'experience' | 'skill' | 'improvement';
    section: keyof CVData | 'general';
    originalValue?: string;
    suggestedValue: string;
    reason: string;
    applied: boolean;
    timestamp: number;
}

// History Entry
interface HistoryEntry {
    cvData: CVData;
    timestamp: number;
    action: string;
}

// Default empty state
const defaultCVData: CVData = {
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
    contentLanguage: 'en', // Default content language
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        lastAutoSave: new Date().toISOString()
    }
};

// Action verbs for smart improvements
const ACTION_VERBS = [
    'Led', 'Managed', 'Developed', 'Created', 'Implemented', 'Achieved',
    'Increased', 'Improved', 'Designed', 'Built', 'Delivered', 'Launched',
    'Optimized', 'Streamlined', 'Reduced', 'Generated', 'Transformed',
    'Mentored', 'Coordinated', 'Established', 'Pioneered', 'Spearheaded'
];

const MAX_HISTORY_SIZE = 50;

interface CVStore {
    cvData: CVData;
    isApplyingTemplate: boolean;

    // History
    history: HistoryEntry[];
    historyIndex: number;
    canUndo: boolean;
    canRedo: boolean;

    // AI Suggestions
    aiSuggestions: AISuggestion[];
    isAIProcessing: boolean;

    // PersonalInfo
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

    // Smart Template Actions (new)
    applyTemplateWithSampleData: (templateId: string, fillEmptyOnly?: boolean) => void;
    loadSampleDataForCurrentTemplate: () => void;
    clearSampleData: () => void;

    // Reset
    resetToDefault: () => void;

    // History Actions
    undo: () => void;
    redo: () => void;
    captureHistory: (action: string) => void;
    clearHistory: () => void;

    // AI Actions
    applyAISuggestion: (suggestion: Partial<CVData>, actionName?: string) => void;
    addAISuggestions: (suggestions: AISuggestion[]) => void;
    markSuggestionApplied: (suggestionId: string) => void;
    clearAISuggestions: () => void;
    setAIProcessing: (isProcessing: boolean) => void;

    // Smart Improve Actions
    improveExperienceWithActionVerbs: (experienceId: string) => string;
    improveSummaryWithKeywords: (keywords: string[]) => string;
    addQuantifiableMetrics: (experienceId: string, metrics: { metric: string; value: string }[]) => void;
    autoImproveAll: () => { section: string; improvement: string }[];
}

// Helper for array reordering
function arrayMove<T>(arr: T[], from: number, to: number): T[] {
    const newArr = [...arr];
    const [item] = newArr.splice(from, 1);
    newArr.splice(to, 0, item);
    return newArr;
}

// Helper: Add action verb to description
function addActionVerb(description: string): string {
    const trimmed = description.trim();
    if (!trimmed) return trimmed;

    // Check if already starts with action verb
    const startsWithActionVerb = ACTION_VERBS.some(verb =>
        trimmed.toLowerCase().startsWith(verb.toLowerCase())
    );

    if (startsWithActionVerb) return trimmed;

    // Choose random action verb
    const randomVerb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];

    // Lowercase first letter of original if it exists
    const modifiedDesc = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);

    return `${randomVerb} ${modifiedDesc}`;
}

// Helper: Extract key skills from profession
function suggestSkillsForProfession(profession?: string): string[] {
    if (!profession) return [];

    const professionLower = profession.toLowerCase();

    // Tech roles
    if (professionLower.includes('developer') || professionLower.includes('engineer') || professionLower.includes('programmer')) {
        return ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'Agile', 'REST APIs', 'Database Design'];
    }
    if (professionLower.includes('data') && (professionLower.includes('scientist') || professionLower.includes('analyst'))) {
        return ['Python', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistics', 'Tableau', 'R'];
    }
    if (professionLower.includes('devops') || professionLower.includes('cloud')) {
        return ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux', 'Monitoring'];
    }

    // Business roles
    if (professionLower.includes('manager') || professionLower.includes('lead') || professionLower.includes('director')) {
        return ['Leadership', 'Project Management', 'Strategic Planning', 'Team Building', 'Budgeting', 'Stakeholder Management'];
    }
    if (professionLower.includes('product')) {
        return ['Product Strategy', 'User Research', 'Roadmap Planning', 'Agile/Scrum', 'Data Analysis', 'A/B Testing'];
    }

    // Marketing & Creative
    if (professionLower.includes('marketing')) {
        return ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media', 'Email Marketing', 'PPC'];
    }
    if (professionLower.includes('design')) {
        return ['Figma', 'Adobe Creative Suite', 'UI/UX', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems'];
    }
    if (professionLower.includes('content') || professionLower.includes('writer') || professionLower.includes('copywriter')) {
        return ['Content Writing', 'SEO Writing', 'Storytelling', 'Editing', 'Research', 'CMS', 'Social Media'];
    }

    // Sales & Customer
    if (professionLower.includes('sales') || professionLower.includes('account')) {
        return ['Negotiation', 'CRM (Salesforce)', 'Lead Generation', 'Client Relations', 'Presentation', 'Pipeline Management'];
    }
    if (professionLower.includes('customer') || professionLower.includes('support')) {
        return ['Customer Service', 'Problem Resolution', 'Communication', 'Zendesk', 'Conflict Resolution', 'Empathy'];
    }

    // Finance & HR
    if (professionLower.includes('finance') || professionLower.includes('accountant')) {
        return ['Financial Analysis', 'Budgeting', 'Excel', 'Forecasting', 'Reporting', 'QuickBooks', 'Compliance'];
    }
    if (professionLower.includes('hr') || professionLower.includes('recruiter') || professionLower.includes('talent')) {
        return ['Recruiting', 'Employee Relations', 'HRIS', 'Performance Management', 'Onboarding', 'Labor Law'];
    }

    // Default soft skills
    return ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability', 'Critical Thinking'];
}

export const useCVStore = create<CVStore>()(
    persist(
        (set, get) => ({
            cvData: { ...defaultCVData },
            isApplyingTemplate: false,

            // History
            history: [],
            historyIndex: -1,
            canUndo: false,
            canRedo: false,

            // AI
            aiSuggestions: [],
            isAIProcessing: false,

            // ============ HISTORY ACTIONS ============
            captureHistory: (action: string) => {
                const { cvData, history, historyIndex } = get();

                // Remove any future history if we're not at the end
                const newHistory = history.slice(0, historyIndex + 1);

                // Add current state
                newHistory.push({
                    cvData: JSON.parse(JSON.stringify(cvData)),
                    timestamp: Date.now(),
                    action
                });

                // Limit history size
                if (newHistory.length > MAX_HISTORY_SIZE) {
                    newHistory.shift();
                }

                set({
                    history: newHistory,
                    historyIndex: newHistory.length - 1,
                    canUndo: newHistory.length > 1,
                    canRedo: false
                });

                console.log('[CVStore] captureHistory:', action);
            },

            undo: () => {
                const { history, historyIndex } = get();

                if (historyIndex <= 0) return;

                const newIndex = historyIndex - 1;
                const previousState = history[newIndex];

                set({
                    cvData: JSON.parse(JSON.stringify(previousState.cvData)),
                    historyIndex: newIndex,
                    canUndo: newIndex > 0,
                    canRedo: true
                });

                console.log('[CVStore] undo to:', previousState.action);
            },

            redo: () => {
                const { history, historyIndex } = get();

                if (historyIndex >= history.length - 1) return;

                const newIndex = historyIndex + 1;
                const nextState = history[newIndex];

                set({
                    cvData: JSON.parse(JSON.stringify(nextState.cvData)),
                    historyIndex: newIndex,
                    canUndo: true,
                    canRedo: newIndex < history.length - 1
                });

                console.log('[CVStore] redo to:', nextState.action);
            },

            clearHistory: () => {
                set({
                    history: [],
                    historyIndex: -1,
                    canUndo: false,
                    canRedo: false
                });
            },

            // ============ AI ACTIONS ============
            applyAISuggestion: (suggestion: Partial<CVData>, actionName = 'AI Suggestion Applied') => {
                const { captureHistory } = get();

                // Capture current state before applying
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

                console.log('[CVStore] applyAISuggestion:', actionName);
            },

            addAISuggestions: (suggestions: AISuggestion[]) => {
                set((state) => ({
                    aiSuggestions: [...state.aiSuggestions, ...suggestions]
                }));
            },

            markSuggestionApplied: (suggestionId: string) => {
                set((state) => ({
                    aiSuggestions: state.aiSuggestions.map(s =>
                        s.id === suggestionId ? { ...s, applied: true } : s
                    )
                }));
            },

            clearAISuggestions: () => {
                set({ aiSuggestions: [] });
            },

            setAIProcessing: (isProcessing: boolean) => {
                set({ isAIProcessing: isProcessing });
            },

            // ============ SMART IMPROVE ACTIONS ============
            improveExperienceWithActionVerbs: (experienceId: string) => {
                const { cvData, captureHistory } = get();
                const experience = cvData.experiences.find(e => e.id === experienceId);

                if (!experience) return '';

                captureHistory('Improve Experience with Action Verbs');

                const improvedDescription = addActionVerb(experience.description);

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

                // Add keywords if not already present
                let improvedSummary = cvData.summary;
                const missingKeywords = keywords.filter(
                    kw => !cvData.summary.toLowerCase().includes(kw.toLowerCase())
                );

                if (missingKeywords.length > 0) {
                    improvedSummary += ` Key expertise includes: ${missingKeywords.join(', ')}.`;
                }

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
                const improvements: { section: string; improvement: string }[] = [];

                captureHistory('Auto Improve All Sections');

                // 1. Improve experiences with action verbs
                const improvedExperiences = cvData.experiences.map(exp => {
                    const improved = addActionVerb(exp.description);
                    if (improved !== exp.description) {
                        improvements.push({
                            section: `Experience: ${exp.position}`,
                            improvement: 'Added action verb'
                        });
                    }
                    return { ...exp, description: improved };
                });

                // 2. Suggest skills based on profession
                const suggestedSkills = suggestSkillsForProfession(cvData.personalInfo.profession);
                const existingSkillNames = cvData.skills.map(s => s.name.toLowerCase());
                const newSkills = suggestedSkills
                    .filter(s => !existingSkillNames.includes(s.toLowerCase()))
                    .slice(0, 3) // Add max 3 new skills
                    .map((name, index) => ({
                        id: `auto-skill-${Date.now()}-${index}`,
                        name,
                        level: 4,
                        category: 'technical' as const
                    }));

                if (newSkills.length > 0) {
                    improvements.push({
                        section: 'Skills',
                        improvement: `Added ${newSkills.length} relevant skills`
                    });
                }

                // 3. Improve summary length if too short
                let improvedSummary = cvData.summary;
                if (cvData.summary && cvData.summary.length < 100) {
                    improvedSummary += ` Committed to delivering high-quality results and continuous professional development.`;
                    improvements.push({
                        section: 'Summary',
                        improvement: 'Expanded professional summary'
                    });
                }

                set((state) => ({
                    cvData: {
                        ...state.cvData,
                        experiences: improvedExperiences,
                        skills: [...state.cvData.skills, ...newSkills],
                        summary: improvedSummary
                    }
                }));

                console.log('[CVStore] autoImproveAll:', improvements);
                return improvements;
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

                console.log('[CVStore] applyTemplate:', templateData);
            },

            setSelectedTemplate: (templateId) =>
                set((state) => ({
                    cvData: {
                        ...state.cvData,
                        template: templateId,
                        // Reset theme when switching template to avoid incompatible themes? 
                        // Or keep? Better reset or default.
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
            applyTemplateWithSampleData: (templateId: string, fillEmptyOnly: boolean = true) => {
                const { cvData, captureHistory } = get();

                captureHistory('Apply Template with Sample Data');
                set({ isApplyingTemplate: true });

                // Get template info
                const template = getEnhancedTemplateById(templateId);
                if (!template) {
                    console.warn('[CVStore] Template not found:', templateId);
                    set({ isApplyingTemplate: false });
                    return;
                }

                // Get sample data
                const sampleCVData = getTemplateSampleCVData(templateId);

                if (sampleCVData && (fillEmptyOnly ? hasMinimalData(cvData) : true)) {
                    // Merge sample data with existing
                    const mergedData = mergeSampleDataWithExisting(cvData, sampleCVData, fillEmptyOnly);

                    set({
                        cvData: {
                            ...mergedData,
                            template: templateId as TemplateType,
                            theme: undefined, // Reset theme for new template
                            metadata: {
                                ...mergedData.metadata,
                                updatedAt: new Date().toISOString()
                            }
                        },
                        isApplyingTemplate: false
                    });
                } else {
                    // Just apply template styling without sample data
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

                console.log('[CVStore] applyTemplateWithSampleData:', templateId, { fillEmptyOnly });
            },

            loadSampleDataForCurrentTemplate: () => {
                const { cvData, captureHistory } = get();
                const templateId = cvData.template || 'modern';
                const lang = cvData.contentLanguage || 'en';

                captureHistory('Load Sample Data');

                let sampleCVData = null;

                if (lang === 'ar') {
                    // Load Arabic sample data
                    const arTemplate = (arTemplates as Record<string, any>)[templateId];
                    if (arTemplate && arTemplate.sampleData) {
                        // Quick conversion for Arabic data
                        // NOTE: Ideally we should have a helper for this, but doing inline for now to ensure functionality
                        const s = arTemplate.sampleData;
                        // Generate unique IDs
                        const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                        sampleCVData = {
                            personalInfo: {
                                fullName: s.personalInfo.fullName,
                                email: s.personalInfo.email,
                                phone: s.personalInfo.phone,
                                address: s.personalInfo.address,
                                profession: s.personalInfo.profession,
                                linkedin: s.personalInfo.linkedin || '',
                                github: s.personalInfo.github || ''
                            },
                            summary: s.summary,
                            experiences: s.experiences.map((exp: Record<string, any>) => ({
                                id: generateId(),
                                company: exp.company,
                                position: exp.position,
                                startDate: exp.startDate,
                                endDate: exp.endDate,
                                current: exp.current,
                                description: exp.description,
                                achievements: []
                            })),
                            education: s.education.map((edu: Record<string, any>) => ({
                                id: generateId(),
                                institution: edu.institution,
                                degree: edu.degree,
                                field: edu.field,
                                graduationYear: edu.graduationYear,
                                startDate: edu.startDate,
                                endDate: edu.endDate,
                                current: false,
                                description: ''
                            })),
                            skills: s.skills.map((skill: Record<string, any>) => ({
                                id: generateId(),
                                name: skill.name,
                                level: skill.level,
                                category: skill.category
                            })),
                            languages: s.languages.map((l: Record<string, any>) => ({
                                id: generateId(),
                                name: l.name,
                                proficiency: l.proficiency
                            }))
                        };
                    }
                }

                if (!sampleCVData) {
                    // Fallback to default (English/Enhanced)
                    sampleCVData = getTemplateSampleCVData(templateId);
                }
                if (!sampleCVData) {
                    console.warn('[CVStore] No sample data for template:', templateId);
                    return;
                }

                // Force merge (replace empty sections)
                const mergedData = mergeSampleDataWithExisting(cvData, sampleCVData, true);

                set({
                    cvData: {
                        ...mergedData,
                        metadata: {
                            ...mergedData.metadata,
                            updatedAt: new Date().toISOString()
                        }
                    }
                });

                console.log('[CVStore] loadSampleDataForCurrentTemplate:', templateId);
            },

            clearSampleData: () => {
                const { captureHistory } = get();
                captureHistory('Clear Sample Data');

                set((state) => ({
                    cvData: {
                        ...state.cvData,
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
                        metadata: {
                            ...state.cvData.metadata,
                            updatedAt: new Date().toISOString()
                        }
                    }
                }));

                console.log('[CVStore] clearSampleData');
            },

            // ============ RESET ============
            resetToDefault: () => {
                get().captureHistory('Reset to Default');
                set({ cvData: { ...defaultCVData } });
                console.log('[CVStore] resetToDefault');
            }
        }),
        {
            name: 'moncvpro-cv-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                cvData: state.cvData,
                history: state.history.slice(-10), // Keep last 10 history entries
                historyIndex: Math.min(state.historyIndex, 9)
            })
        }
    )
);

// Export default CV data for external use
export { defaultCVData };
