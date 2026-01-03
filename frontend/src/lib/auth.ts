import { apiPost } from './api-client';
import { resetCsrfToken } from './csrf';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface RegisterData {
    email: string;
    password: string;
    name?: string;
}

export const authService = {
    login: async (email: string, password: string) => {
        const response = await apiPost(
            `${API_BASE_URL}/auth/login`,
            { email, password },
            { skipAuth: true } // Don't send auth token for login
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || 'Login failed');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        }
        return data;
    },

    register: async (userData: RegisterData) => {
        const response = await apiPost(
            `${API_BASE_URL}/auth/register`,
            userData,
            { skipAuth: true } // Don't send auth token for register
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || 'Registration failed');
        }

        return response.json();
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        resetCsrfToken(); // Clear CSRF token on logout
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};
