
import api from '@/lib/axios';

export const adminService = {
    // --- User Management ---
    getUsers: async (page: number = 1, limit: number = 10, filters: any = {}) => {
        const params = { page, limit, ...filters };
        const { data } = await api.get('/admin/users', { params });
        return data;
    },

    getUserDetails: async (id: string) => {
        const { data } = await api.get(`/admin/users/${id}`);
        return data;
    },

    suspendUser: async (id: string, reason: string) => {
        const { data } = await api.post(`/admin/users/${id}/suspend`, { reason });
        return data;
    },

    reactivateUser: async (id: string) => {
        const { data } = await api.post(`/admin/users/${id}/reactivate`);
        return data;
    },

    deleteUser: async (id: string) => {
        const { data } = await api.delete(`/admin/users/${id}`);
        return data;
    },

    sendEmail: async (id: string, subject: string, message: string) => {
        const { data } = await api.post(`/admin/users/${id}/email`, { subject, message });
        return data;
    },

    // --- Analytics ---
    getOverview: async () => {
        const { data } = await api.get('/admin/analytics/overview');
        return data;
    },

    // --- System ---
    getHealth: async () => {
        const { data } = await api.get('/admin/health');
        return data;
    },
};
