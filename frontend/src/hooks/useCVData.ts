import { useCVStore } from '@/stores/useCVStore';
import { CVData, PersonalInfo, Experience, Education, Skill, Language } from '@/types/cv';

export const useCVData = () => {
    const store = useCVStore();

    return {
        // Getters
        cvData: store.currentCV,
        isLoading: store.isLoading,

        // Personal Info
        updatePersonalInfo: (info: Partial<PersonalInfo>) => {
            if (!store.currentCV) return;
            store.updateCV({
                personalInfo: { ...store.currentCV.personalInfo, ...info }
            });
        },

        // Experiences
        addExperience: (exp: Experience) => {
            const experiences = [...(store.currentCV?.experiences || []), exp];
            store.updateCV({ experiences });
        },

        updateExperience: (id: string, updates: Partial<Experience>) => {
            const experiences = store.currentCV?.experiences.map(exp =>
                exp.id === id ? { ...exp, ...updates } : exp
            ) || [];
            store.updateCV({ experiences });
        },

        removeExperience: (id: string) => {
            const experiences = store.currentCV?.experiences.filter(exp => exp.id !== id) || [];
            store.updateCV({ experiences });
        },

        reorderExperiences: (startIndex: number, endIndex: number) => {
            const experiences = [...(store.currentCV?.experiences || [])];
            const [removed] = experiences.splice(startIndex, 1);
            experiences.splice(endIndex, 0, removed);
            store.updateCV({ experiences });
        },

        // Education
        addEducation: (edu: Education) => {
            const education = [...(store.currentCV?.education || []), edu];
            store.updateCV({ education });
        },

        updateEducation: (id: string, updates: Partial<Education>) => {
            const education = store.currentCV?.education.map(edu =>
                edu.id === id ? { ...edu, ...updates } : edu
            ) || [];
            store.updateCV({ education });
        },

        removeEducation: (id: string) => {
            const education = store.currentCV?.education.filter(edu => edu.id !== id) || [];
            store.updateCV({ education });
        },

        // Skills
        addSkill: (skill: Skill) => {
            const skills = [...(store.currentCV?.skills || []), skill];
            store.updateCV({ skills });
        },

        updateSkill: (id: string, updates: Partial<Skill>) => {
            const skills = store.currentCV?.skills.map(skill =>
                skill.id === id ? { ...skill, ...updates } : skill
            ) || [];
            store.updateCV({ skills });
        },

        removeSkill: (id: string) => {
            const skills = store.currentCV?.skills.filter(skill => skill.id !== id) || [];
            store.updateCV({ skills });
        },

        // Languages
        addLanguage: (lang: Language) => {
            const languages = [...(store.currentCV?.languages || []), lang];
            store.updateCV({ languages });
        },

        updateLanguage: (id: string, updates: Partial<Language>) => {
            const languages = store.currentCV?.languages.map(lang =>
                lang.id === id ? { ...lang, ...updates } : lang
            ) || [];
            store.updateCV({ languages });
        },

        removeLanguage: (id: string) => {
            const languages = store.currentCV?.languages.filter(lang => lang.id !== id) || [];
            store.updateCV({ languages });
        },

        // Summary
        updateSummary: (summary: string) => {
            store.updateCV({ summary });
        },

        // Template
        changeTemplate: (template: CVData['template']) => {
            store.updateCV({ template });
        },

        // Utilities
        save: store.saveToCloud,
        undo: store.undo,
        redo: store.redo,
        canUndo: store.historyIndex > 0,
        canRedo: store.historyIndex < store.history.length - 1,

        // Full Store Access
        setCurrentCV: store.setCurrentCV,
        loadFromCloud: store.loadFromCloud
    };
};
