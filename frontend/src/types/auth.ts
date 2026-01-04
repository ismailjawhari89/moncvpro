export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    isAdmin?: boolean;
    emailVerified?: boolean;
    avatarUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface RefreshResponse {
    accessToken: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}
