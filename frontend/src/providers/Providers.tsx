'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/axios';

function AuthInitializer() {
    const { setAccessToken, setUser, logout, setLoading, setCsrfToken } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                // 1. Fetch CSRF Token (Required for all POST requests including refresh)
                const csrfRes = await api.get('/auth/csrf-token');
                if (csrfRes.data.csrfToken) {
                    setCsrfToken(csrfRes.data.csrfToken);
                }

                // 2. Try to silent refresh on app mount
                const { data } = await api.post('/auth/refresh');
                // Access token is returned but primarily set in cookie.
                // We can keep it in memory if needed, or ignore it if we fully trust cookies.
                // But the store expects it.
                setAccessToken(data.accessToken);

                // Fetch fresh user data
                // Assuming /auth/me or /me is the endpoint. 
                // Based on API_AUTH.md provided earlier: "GET /me (Protected)" -> Likely /api/auth/me?
                // The API_AUTH says: "Base URL: /api/auth" ... "Endpoints: ... /me".
                // So full path is /api/auth/me. 
                // My axios base is /api. So I call /auth/me.
                const userRes = await api.get('/auth/me');
                setUser(userRes.data);

            } catch (error) {
                // If refresh fails (401/403), we are strictly logged out.
                logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [setAccessToken, setUser, logout, setLoading]);

    // NOTE: We do not block the UI rendering here (non-blocking initialization).
    // The strict protection is handled by ProtectedRoute or individual pages checking useAuth().isLoading.
    // This allows public pages (Landing, etc.) to load instantly without waiting for the Auth API.
    return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthInitializer />
            {children}
        </>
    );
}
