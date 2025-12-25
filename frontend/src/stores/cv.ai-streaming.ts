
import { StateCreator } from 'zustand';
import { streamCVImprovements } from '@/lib/ai-streaming-service';
import { CVData, Experience } from '@/types/cv';

export interface StreamingState {
    summary: string;
    experiences: { id: string; description: string }[];
    skills: string[];
    isStreaming: boolean;
    error: string | null;
}

export interface AIStreamingSlice {
    streaming: StreamingState;
    abortController: AbortController | null;
    startSmartFix: (targetRole?: string) => Promise<void>;
    stopStreaming: () => void;
    clearStreaming: () => void;
    applyStreamingResults: () => void;
}

export const createAIStreamingSlice: StateCreator<
    AIStreamingSlice & {
        cvData: CVData;
        updateSummary: (s: string) => void;
        updateExperience: (id: string, field: keyof Experience, val: any) => void;
        addSkill: (skill: any) => void;
        captureHistory: (action: string) => void;
        updateTimestamp: () => void;
    },
    [],
    [],
    AIStreamingSlice
> = (set, get) => ({
    streaming: {
        summary: '',
        experiences: [],
        skills: [],
        isStreaming: false,
        error: null,
    },
    abortController: null,

    startSmartFix: async (targetRole) => {
        const { cvData, stopStreaming } = get();

        // Stop any existing stream
        stopStreaming();

        const controller = new AbortController();
        set({
            abortController: controller,
            streaming: {
                summary: '',
                experiences: [],
                skills: [],
                isStreaming: true,
                error: null,
            }
        });

        try {
            const { partialObjectStream } = await streamCVImprovements(cvData, targetRole, controller.signal);

            for await (const partial of partialObjectStream) {
                set((state) => ({
                    streaming: {
                        ...state.streaming,
                        summary: partial.summary || state.streaming.summary,
                        experiences: (partial.experiences || state.streaming.experiences) as { id: string; description: string }[],
                        skills: (partial.skills || state.streaming.skills).filter((s): s is string => !!s),
                    }
                }));
            }

            set((state) => ({
                streaming: { ...state.streaming, isStreaming: false },
                abortController: null
            }));

        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Streaming aborted by user');
            } else {
                console.error('Streaming error:', err);
                set((state) => ({
                    streaming: { ...state.streaming, isStreaming: false, error: err.message },
                    abortController: null
                }));
            }
        }
    },

    stopStreaming: () => {
        const { abortController } = get();
        if (abortController) {
            abortController.abort();
            set({ abortController: null });
        }
    },

    clearStreaming: () => {
        set({
            streaming: {
                summary: '',
                experiences: [],
                skills: [],
                isStreaming: false,
                error: null,
            }
        });
    },

    applyStreamingResults: () => {
        const { streaming, cvData, captureHistory, clearStreaming, updateTimestamp } = get();

        const newCvData = { ...cvData };

        if (streaming.summary) {
            newCvData.summary = streaming.summary;
        }

        if (streaming.experiences.length > 0) {
            newCvData.experiences = newCvData.experiences.map((exp: Experience) => {
                const improvement = streaming.experiences.find(s => s.id === exp.id);
                if (improvement) {
                    return { ...exp, description: improvement.description };
                }
                return exp;
            });
        }

        if (streaming.skills.length > 0) {
            const newSkills = streaming.skills.map(skillName => ({
                id: `ai-skill-${Date.now()}-${Math.random()}`,
                name: skillName,
                level: 4,
                category: 'technical' as const
            }));
            newCvData.skills = [...newCvData.skills, ...newSkills];
        }

        set({ cvData: newCvData });
        updateTimestamp();
        captureHistory('Apply AI Smart Fix');
        clearStreaming();
    }
});
