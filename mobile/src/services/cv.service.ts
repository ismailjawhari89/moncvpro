
import api from './api';

export const cvService = {
    listCVs: async () => {
        const response = await api.get('/cvs');
        return response.data;
    },
    getCV: async (id: string) => {
        const response = await api.get(`/cvs/${id}`);
        return response.data;
    },
    createCV: async (data: any) => {
        const response = await api.post('/cvs', data);
        return response.data;
    },
    updateCV: async (id: string, data: any) => {
        const response = await api.put(`/cvs/${id}`, data);
        return response.data;
    },
};
