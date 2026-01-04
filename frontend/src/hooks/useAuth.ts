import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
    const store = useAuthStore();

    return {
        user: store.user,
        isAuthenticated: store.isAuthenticated,
        isLoading: store.isLoading,
        login: store.login,
        logout: store.logout,
        accessToken: store.accessToken
    };
};
