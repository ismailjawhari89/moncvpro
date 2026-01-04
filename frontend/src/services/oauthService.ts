
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const oauthService = {
    /**
     * Initiate Google OAuth flow by redirecting to the backend
     */
    initiateGoogleOAuth: () => {
        window.location.href = `${BACKEND_URL}/api/v1/auth/google`;
    },

    /**
     * Initiate LinkedIn OAuth flow by redirecting to the backend
     */
    initiateLinkedInOAuth: () => {
        window.location.href = `${BACKEND_URL}/api/v1/auth/linkedin`;
    },

    /**
     * Handle the OAuth callback by exchanging the code/token from URL
     */
    handleOAuthCallback: async (token: string) => {
        // In our current backend implementation for 'initiateGoogle', 
        // it redirects to `${process.env.FRONTEND_URL}/auth/callback?accessToken=${result.accessToken}`
        // So we just need to return the token.
        return { accessToken: token };
    }
};
