import { StateCreator } from 'zustand';
import { saveCV, loadCVs } from '@/services/api';
import { CVData } from '@/types/cv';

export interface CloudState {
    status: 'idle' | 'saving' | 'saved' | 'error';
    lastSavedAt: string | null;
    error: string | null;
}

export interface CloudSlice {
    cloud: CloudState;
    saveToCloud: () => Promise<void>;
    loadFromCloud: () => Promise<void>;
    syncWithCloud: (remoteData: CVData) => Promise<'updated_local' | 'pushed_remote' | 'already_synced'>;
    resetCloudStatus: () => void;
}

export const createCloudSlice: StateCreator<
    CloudSlice & { cvData: CVData; captureHistory?: (action: string) => void },
    [],
    [],
    CloudSlice
> = (set, get) => ({
    cloud: {
        status: 'idle',
        lastSavedAt: null,
        error: null
    },

    saveToCloud: async () => {
        const { cloud, cvData } = get();

        if (cloud.status === 'saving') return;

        set((state) => ({
            cloud: { ...state.cloud, status: 'saving', error: null }
        }));

        try {
            // Call API
            const result = await saveCV(cvData, cvData.id);

            set((state) => ({
                cloud: {
                    status: 'saved',
                    lastSavedAt: new Date().toISOString(),
                    error: null
                },
                // CRITICAL: Update the ID to prevent future duplicates (New -> Update)
                cvData: {
                    ...state.cvData,
                    id: result.data.id,
                    metadata: {
                        ...state.cvData.metadata,
                        updatedAt: result.data.updated_at
                    }
                }
            }));
        } catch (error: any) {
            console.error('Save failed:', error);

            // Handle Authentication Error specifically
            if (error.message?.includes('User must be logged in') || error.message?.includes('Unauthorized')) {
                set((state) => ({
                    cloud: {
                        ...state.cloud,
                        status: 'error',
                        error: 'UNAUTHORIZED' // Special code for UI to show Auth Modal
                    }
                }));
            } else {
                set((state) => ({
                    cloud: {
                        ...state.cloud,
                        status: 'error',
                        error: error.message || 'Failed to save CV'
                    }
                }));
            }
        }
    },

    loadFromCloud: async () => {
        set((state) => ({
            cloud: { ...state.cloud, status: 'saving', error: null } // Reusing saving status for loading indication
        }));

        try {
            const result = await loadCVs();
            // Assuming result.data is an array of CVs. For this simple version, we might just load the list.
            // Or if we want to load a specific one, we'd need another action.
            // For now, let's assuming we just fetch the list but don't automatically replace state unless user selects one.
            // This method might need refining based on UI, but for now enforcing the contract.

            // NOTE: This merely tests the connection. Actual loading into state should probably be separate 
            // 'loadCV(id)' or handled by UI selecting from the list.

            set((state) => ({
                cloud: {
                    ...state.cloud,
                    status: 'idle', // Back to idle
                    error: null
                }
            }));

            return result.data; // UI can use this

        } catch (error: any) {
            set((state) => ({
                cloud: {
                    ...state.cloud,
                    status: 'error',
                    error: error.message || 'Failed to load CVs'
                }
            }));
            throw error;
        }
    },

    syncWithCloud: async (remoteData: CVData) => {
        const { cvData } = get();
        const localTime = cvData.metadata.lastModified || 0;
        const remoteTime = remoteData.metadata.lastModified || 0;

        if (remoteTime > localTime) {
            // Remote is newer, update local
            set({ cvData: remoteData });
            return 'updated_local';
        } else if (localTime > remoteTime) {
            // Local is newer, push to remote
            await get().saveToCloud();
            return 'pushed_remote';
        }
        return 'already_synced';
    },

    resetCloudStatus: () => {
        set((state) => ({
            cloud: { ...state.cloud, status: 'idle', error: null }
        }));
    }
});
