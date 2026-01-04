
import axios from '@/lib/axios';

export const authService = {
    getSessions: async () => {
        const response = await axios.get('/user/sessions');
        return response.data;
    },

    revokeSession: async (sessionId: string) => {
        await axios.delete(`/user/sessions/${sessionId}`);
    },

    logoutAllDevices: async () => {
        await axios.post('/user/sessions/logout-all');
    },

    verify2FA: async (tempToken: string, otpToken: string) => {
        const response = await axios.post('/auth/verify-2fa', { tempToken, otpToken });
        return response.data;
    }
};
