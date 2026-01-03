import { CVData } from '@/types/cv';
import { apiPost, apiGet } from '../api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse {
    success: boolean;
    cv?: any;
    error?: string;
}

export interface AnalysisResult {
    success: boolean;
    analysis?: {
        score: number;
        feedback: string[];
        suggestions: string[];
        keywords: string[];
        atsCompatibility: number;
    };
    error?: string;
}

export const cvApi = {
    // Save CV to database
    saveCV: async (cvData: CVData, cvId?: string): Promise<ApiResponse> => {
        const idToUse = cvId || cvData.id;
        const response = await apiPost(`${API_BASE_URL}/cvs/save`, {
            cvId: idToUse,
            data: cvData
        });
        return response.json();
    },

    // Analyze CV with AI
    analyzeCV: async (cvData: CVData): Promise<AnalysisResult> => {
        const response = await apiPost(`${API_BASE_URL}/cvs/analyze`, {
            cvData
        });
        return response.json();
    },

    // Get all user CVs
    getMyCVs: async (): Promise<any[]> => {
        const response = await apiGet(`${API_BASE_URL}/cvs`);
        return response.json();
    },

    // Get a single CV by ID
    getCV: async (cvId: string): Promise<any> => {
        const response = await apiGet(`${API_BASE_URL}/cvs/${cvId}`);
        return response.json();
    },

    // Sync CV with server (bi-directional)
    syncCV: async (params: { cvData: any; lastSync?: string; clientId: string }): Promise<any> => {
        const response = await apiPost(`${API_BASE_URL}/cvs/sync`, params);
        return response.json();
    },

    // Get changes since last sync
    getChanges: async (lastSync: string): Promise<any> => {
        const response = await apiGet(
            `${API_BASE_URL}/cvs/changes?lastSync=${encodeURIComponent(lastSync)}`
        );
        return response.json();
    }
};
