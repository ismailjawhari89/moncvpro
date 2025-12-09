import { useCVStore } from '@/stores/useCVStore';
import { CVData, PersonalInfo, Experience, Education, Skill, Language } from '@/types/cv';

export const useCVData = () => {
    const store = useCVStore();

    return {
        // Getters
        cvData: store.cvData,
        isLoading: false, // isLoading is not managed in this store currently

        // Personal Info
        updatePersonalInfo: store.updatePersonalInfo,

        // Experiences
        addExperience: store.addExperience,
        updateExperience: (id: string, updates: Partial<Experience>) => {
            // Map partial updates to individual field updates or implementation in store needing update?
            // Store has updateExperience(id, field, value). 
            // We can iterate updates.
            Object.entries(updates).forEach(([key, value]) => {
                store.updateExperience(id, key as keyof Experience, value);
            });
        },
        removeExperience: store.removeExperience,
        reorderExperiences: store.reorderExperiences,

        // Education
        addEducation: store.addEducation,
        updateEducation: (id: string, updates: Partial<Education>) => {
            Object.entries(updates).forEach(([key, value]) => {
                store.updateEducation(id, key as keyof Education, value);
            });
        },
        removeEducation: store.removeEducation,

        // Skills
        addSkill: store.addSkill,
        updateSkill: (id: string, updates: Partial<Skill>) => {
            Object.entries(updates).forEach(([key, value]) => {
                store.updateSkill(id, key as keyof Skill, value);
            });
        },
        removeSkill: store.removeSkill,

        // Languages
        addLanguage: store.addLanguage,
        updateLanguage: (id: string, updates: Partial<Language>) => {
            Object.entries(updates).forEach(([key, value]) => {
                store.updateLanguage(id, key as keyof Language, value);
            });
        },
        removeLanguage: store.removeLanguage,

        // Summary
        updateSummary: store.updateSummary,

        // Template
        changeTemplate: store.setSelectedTemplate,

        // Utilities
        save: () => console.log('Save handled by persist middleware'),
        undo: store.undo,
        redo: store.redo,
        canUndo: store.canUndo,
        canRedo: store.canRedo,

        // Full Store Access - Deprecated/Mapped
        setCurrentCV: (data: CVData) => store.applyTemplate(data), // Approximation
        loadFromCloud: () => console.warn('loadFromCloud not implemented in store'),
    };
};
