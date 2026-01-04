import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/auth';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    csrfToken: string | null;

    // Actions
    setCsrfToken: (token: string) => void;
    setAccessToken: (token: string | null) => void;
    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
    login: (user: User, accessToken?: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            csrfToken: null,
            isAuthenticated: false,
            isLoading: true,

            setCsrfToken: (token) => set({ csrfToken: token }),
            setAccessToken: (token) => set({ accessToken: token }),
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setLoading: (loading) => set({ isLoading: loading }),

            login: (user, accessToken = null) => set({
                user,
                accessToken,
                isAuthenticated: true,
                isLoading: false
            }),

            logout: () => set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                // We typically DO NOT persist AccessToken in localStorage for security (XSS).
                // However, the User prompt said "AccessToken: Short-lived... kept in memory/Zustand".
                // If we don't persist it, a page refresh loses the token.
                // Standard secure pattern:
                // 1. Refresh Token in HttpOnly Cookie.
                // 2. Access Token in Memory (Zustand).
                // 3. On Page Load (app init), call /refresh to get a new Access Token.
                //
                // If I don't persist it here, I need an initialization logic in _app or layout.
                // I will NOT persist accessToken here to be secure.
                // I will persist 'user' just for UI flicker avoidance, but really truth is on server.
                // Let's persist User for now.
            }),
        }
    )
);
