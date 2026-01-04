import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { csrfToken } = useAuthStore.getState();

        // Inject CSRF Token
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }

        // Note: We use httpOnly cookies for Authorization now.
        // The browser automatically attaches them.

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle Email Not Verified
        if (error.response?.status === 403 && (error.response.data as any)?.code === 'EMAIL_NOT_VERIFIED') {
            if (typeof window !== 'undefined') {
                const email = useAuthStore.getState().user?.email;
                if (email) {
                    window.location.href = `/auth/verify-email?email=${encodeURIComponent(email)}&error=unverified`;
                }
            }
            return Promise.reject(error);
        }

        // If 401 error and not originally a retry and not the refresh endpoint itself
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh') &&
            !originalRequest.url?.includes('/auth/login') // Don't retry login failures
        ) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                // The backend will set new cookies automatically
                const { data } = await api.post<{ accessToken?: string }>('/auth/refresh');

                // If backend still sends it (e.g. for native apps), update store
                if (data.accessToken) {
                    useAuthStore.getState().setAccessToken(data.accessToken);
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    }
                }

                // Retry original request (cookies will be attached automatically)
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout and redirect
                useAuthStore.getState().logout();
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
                    window.location.href = '/auth/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
