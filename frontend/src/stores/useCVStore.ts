import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CVData, AISuggestion } from '@/types/cv';
import { createHistorySlice, HistorySlice } from './cv.history';
import { createCVActionsSlice, CVActionsSlice, defaultCVData } from './cv.actions';
import { createCloudSlice, CloudSlice } from './cv.cloud';
import { createAIStreamingSlice, AIStreamingSlice } from './cv.ai-streaming';

// Combined Store Interface
interface CVStore extends HistorySlice, CVActionsSlice, CloudSlice, AIStreamingSlice {
    cvData: CVData;
    isApplyingTemplate: boolean;
    aiSuggestions: AISuggestion[];
    isAIProcessing: boolean;
}

// Store Definition using Slices
export const useCVStore = create<CVStore>()(
    persist(
        (set, get, api) => ({
            // Wrapper State
            cvData: defaultCVData,
            isApplyingTemplate: false,
            aiSuggestions: [],
            isAIProcessing: false,

            // Slices
            ...createHistorySlice(set, get, api),
            ...createCVActionsSlice(set, get, api),
            ...createCloudSlice(set, get, api),
            ...createAIStreamingSlice(set, get, api),
        }),
        {
            name: 'moncvpro-cv-storage',
            partialize: (state) => ({
                cvData: state.cvData,
                // Persist cloud state? Maybe lastSavedAt, but status should probably reset.
                // Resetting status on reload is safer.
                history: state.history,
                historyIndex: state.historyIndex
            }),
        }
    )
);
