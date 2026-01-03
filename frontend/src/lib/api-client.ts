import { getCsrfToken, resetCsrfToken } from './csrf';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiCallOptions extends RequestInit {
    skipCsrf?: boolean;
    skipAuth?: boolean;
}

/**
 * Centralized API call function with automatic CSRF token injection
 * and credential handling
 */
export async function apiCall(
    url: string,
    options: ApiCallOptions = {}
): Promise<Response> {
    const { skipCsrf = false, skipAuth = false, ...fetchOptions } = options;
    
    // Prepare headers
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    // Add CSRF token for state-changing requests
    const method = fetchOptions.method?.toUpperCase() || 'GET';
    if (!skipCsrf && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        try {
            const csrfToken = await getCsrfToken();
            (headers as Record<string, string>)['X-CSRF-Token'] = csrfToken;
        } catch (error) {
            console.error('Failed to get CSRF token:', error);
            throw new Error('Unable to secure request - please refresh the page');
        }
    }

    // Add authentication token if not skipped
    if (!skipAuth && typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
    }

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            credentials: 'include', // Send cookies with requests
        });

        // Handle 401 Unauthorized - could implement token refresh here
        if (response.status === 401 && !skipAuth) {
            console.warn('Unauthorized request - token may be expired');
            // Clear auth state
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            resetCsrfToken();
        }

        // Handle 403 Forbidden - likely CSRF token issue
        if (response.status === 403) {
            const text = await response.clone().text();
            if (text.includes('CSRF')) {
                console.warn('CSRF token invalid - resetting');
                resetCsrfToken();
                throw new Error('Security token expired - please try again');
            }
        }

        return response;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network request failed');
    }
}

/**
 * Helper function for GET requests
 */
export async function apiGet(url: string, options?: ApiCallOptions): Promise<Response> {
    return apiCall(url, { ...options, method: 'GET' });
}

/**
 * Helper function for POST requests
 */
export async function apiPost(
    url: string,
    data?: any,
    options?: ApiCallOptions
): Promise<Response> {
    return apiCall(url, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
    });
}

/**
 * Helper function for PUT requests
 */
export async function apiPut(
    url: string,
    data?: any,
    options?: ApiCallOptions
): Promise<Response> {
    return apiCall(url, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
    });
}

/**
 * Helper function for DELETE requests
 */
export async function apiDelete(url: string, options?: ApiCallOptions): Promise<Response> {
    return apiCall(url, { ...options, method: 'DELETE' });
}
