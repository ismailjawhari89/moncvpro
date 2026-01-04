
import api from '@/lib/axios';

export const emailService = {
    getPreferences: async () => {
        const response = await api.get('/email/preferences');
        return response.data;
    },

    updatePreferences: async (data: any) => {
        const response = await api.patch('/email/preferences', data);
        return response.data;
    },

    getHistory: async () => {
        const response = await api.get('/email/history');
        return response.data;
    }
};
