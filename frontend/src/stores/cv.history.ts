import { StateCreator } from 'zustand';
import { CVData } from '@/types/cv';

// History Entry
export interface HistoryEntry {
    cvData: CVData;
    timestamp: number;
    action: string;
}

export interface HistorySlice {
    history: HistoryEntry[];
    historyIndex: number;
    canUndo: boolean;
    canRedo: boolean;
    captureHistory: (action: string) => void;
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
}

// Slice Creator (needs access to full store to get/set cvData)
// We assume the Store has overlapping 'cvData' interface from another slice.
export const createHistorySlice: StateCreator<
    // Combined Store Interface (Defining just enough for this slice)
    HistorySlice & { cvData: CVData },
    [],
    [],
    HistorySlice
> = (set, get) => ({
    history: [],
    historyIndex: -1,
    canUndo: false,
    canRedo: false,

    captureHistory: (action: string) => {
        const { cvData, history, historyIndex } = get();

        // Remove any future history if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);

        // Create a copy without the photo to save storage space
        const cvDataWithoutPhoto = JSON.parse(JSON.stringify(cvData));
        if (cvDataWithoutPhoto.personalInfo?.photoUrl) {
            cvDataWithoutPhoto.personalInfo.photoUrl = '[PHOTO_PLACEHOLDER]'; // Mark that photo exists but don't store it
        }

        // Add current state (without heavy photo data)
        newHistory.push({
            cvData: cvDataWithoutPhoto,
            timestamp: Date.now(),
            action
        });

        // Limit history size - keep only 5 entries max (as requested/suggested in prev code)
        // Previous code said 3, user might want 5. Sticking to manageable size.
        while (newHistory.length > 5) {
            newHistory.shift();
        }

        try {
            set({
                history: newHistory,
                historyIndex: newHistory.length - 1,
                canUndo: newHistory.length > 1,
                canRedo: false
            });
        } catch (error) {
            // If storage quota exceeded, clear localStorage and disable history
            console.warn('[CVStore] Storage quota exceeded, clearing localStorage');
            try {
                localStorage.removeItem('moncvpro-cv-storage');
            } catch (e) {
                // Ignore
            }
            // Set with empty history to avoid further errors
            set({
                history: [],
                historyIndex: -1,
                canUndo: false,
                canRedo: false
            });
        }
    },

    undo: () => {
        const { history, historyIndex, cvData } = get();

        if (historyIndex <= 0) return;

        const newIndex = historyIndex - 1;
        const previousState = history[newIndex];
        const restoredData = JSON.parse(JSON.stringify(previousState.cvData));

        // Smart Restore: unexpected side effect of not storing photos is that undo might restore a placeholder.
        // If history has a placeholder, we try to keep the currently active photo (if it exists and is real).
        // This assumes the user is mostly undoing text changes, not photo removals.
        const currentPhoto = cvData.personalInfo?.photoUrl;
        if (
            restoredData.personalInfo?.photoUrl === '[PHOTO_PLACEHOLDER]' &&
            currentPhoto &&
            currentPhoto.length > 50 // simplistic check for base64 or long url
        ) {
            restoredData.personalInfo.photoUrl = currentPhoto;
        }

        set({
            cvData: restoredData,
            historyIndex: newIndex,
            canUndo: newIndex > 0,
            canRedo: true
        });
    },

    redo: () => {
        const { history, historyIndex, cvData } = get();

        if (historyIndex >= history.length - 1) return;

        const newIndex = historyIndex + 1;
        const nextState = history[newIndex];
        const restoredData = JSON.parse(JSON.stringify(nextState.cvData));

        // Smart Restore for Redo as well
        const currentPhoto = cvData.personalInfo?.photoUrl;
        if (
            restoredData.personalInfo?.photoUrl === '[PHOTO_PLACEHOLDER]' &&
            currentPhoto &&
            currentPhoto.length > 50
        ) {
            restoredData.personalInfo.photoUrl = currentPhoto;
        }

        set({
            cvData: restoredData,
            historyIndex: newIndex,
            canUndo: true,
            canRedo: newIndex < history.length - 1
        });
    },

    clearHistory: () => {
        set({
            history: [],
            historyIndex: -1,
            canUndo: false,
            canRedo: false
        });
    },
});
