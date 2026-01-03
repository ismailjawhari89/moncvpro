const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

let csrfToken: string | null = null;

/**
 * Fetch CSRF token from the backend
 * Caches the token for subsequent requests
 */
export async function getCsrfToken(): Promise<string> {
    if (csrfToken) return csrfToken;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to get CSRF token: ${response.statusText}`);
        }

        const data = await response.json();
        csrfToken = data.csrfToken;
        return csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
}

/**
 * Reset the cached CSRF token
 * Call this after logout or when token becomes invalid
 */
export function resetCsrfToken() {
    csrfToken = null;
}

/**
 * Get the cached CSRF token without fetching
 * Returns null if no token is cached
 */
export function getCachedCsrfToken(): string | null {
    return csrfToken;
}
