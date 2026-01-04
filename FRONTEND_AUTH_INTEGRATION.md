# Frontend Authentication Integration Guide

## Overview

This guide explains how to integrate the advanced authentication system into the MonCVPro frontend.

## Required Frontend Components

### 1. Auth Store (Zustand)

Create `src/stores/useAuthStore.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAccessToken: (token) => set({ accessToken: token }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) throw new Error('Login failed');

          const data = await response.json();
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email, password, firstName, lastName) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, firstName, lastName }),
          });

          if (!response.ok) throw new Error('Registration failed');

          // Optionally auto-login after registration
          await get().login(email, password);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await fetch('/api/v1/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },

      refreshToken: async () => {
        try {
          const response = await fetch('/api/v1/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (!response.ok) throw new Error('Token refresh failed');

          const data = await response.json();
          set({ accessToken: data.accessToken });
        } catch (error) {
          // Refresh failed, logout user
          get().logout();
        }
      },

      verifyEmail: async (token) => {
        const response = await fetch('/api/v1/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error('Email verification failed');
      },

      requestPasswordReset: async (email) => {
        const response = await fetch('/api/v1/auth/request-password-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) throw new Error('Password reset request failed');
      },

      resetPassword: async (token, newPassword) => {
        const response = await fetch('/api/v1/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword }),
        });

        if (!response.ok) throw new Error('Password reset failed');
      },

      googleLogin: async (idToken) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/v1/auth/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ idToken }),
          });

          if (!response.ok) throw new Error('Google login failed');

          const data = await response.json();
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      verify2FA: async (tempToken, otpToken) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/v1/auth/verify-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ tempToken, otpToken }),
          });

          if (!response.ok) throw new Error('2FA verification failed');

          const data = await response.json();
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### 2. Axios Interceptor

Create `src/lib/axios.ts`:

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Request interceptor - Add access token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshToken();
        
        // Retry original request with new token
        const token = useAuthStore.getState().accessToken;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 3. Auth Pages

#### Login Page (`app/[locale]/auth/login/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || t('loginFailed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">{t('login')}</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email')}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('password')}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? t('loading') : t('login')}
        </button>

        <div className="text-center space-y-2">
          <a href="/auth/forgot-password" className="text-blue-600 hover:underline">
            {t('forgotPassword')}
          </a>
          <div>
            {t('noAccount')}{' '}
            <a href="/auth/register" className="text-blue-600 hover:underline">
              {t('register')}
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
```

#### Register Page (`app/[locale]/auth/register/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || t('registrationFailed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">{t('register')}</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder={t('firstName')}
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder={t('lastName')}
            className="px-4 py-2 border rounded"
          />
        </div>

        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={t('email')}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder={t('password')}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder={t('confirmPassword')}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? t('loading') : t('register')}
        </button>

        <div className="text-center">
          {t('haveAccount')}{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            {t('login')}
          </a>
        </div>
      </form>
    </div>
  );
}
```

### 4. Protected Route Middleware

Update `src/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/cv-builder', '/settings'];
const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route)) && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !accessToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 5. Session Management Component

Create `src/components/SessionManager.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface Session {
  id: string;
  deviceName: string;
  ipAddress: string;
  location?: string;
  lastActivityAt: string;
  createdAt: string;
}

export default function SessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await api.get('/api/v1/auth/sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Failed to load sessions', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      await api.delete(`/api/v1/auth/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Failed to revoke session', error);
    }
  };

  const logoutAllDevices = async () => {
    try {
      await api.post('/api/v1/auth/logout-all');
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Failed to logout from all devices', error);
    }
  };

  if (loading) return <div>Loading sessions...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Active Sessions</h2>
        <button
          onClick={logoutAllDevices}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout All Devices
        </button>
      </div>

      <div className="space-y-2">
        {sessions.map((session) => (
          <div key={session.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{session.deviceName}</div>
              <div className="text-sm text-gray-600">
                {session.ipAddress} {session.location && `• ${session.location}`}
              </div>
              <div className="text-xs text-gray-500">
                Last active: {new Date(session.lastActivityAt).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => revokeSession(session.id)}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Revoke
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Translation Keys

Add to `messages/en.json`:

```json
{
  "auth": {
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "firstName": "First Name",
    "lastName": "Last Name",
    "forgotPassword": "Forgot Password?",
    "noAccount": "Don't have an account?",
    "haveAccount": "Already have an account?",
    "loading": "Loading...",
    "loginFailed": "Login failed. Please check your credentials.",
    "registrationFailed": "Registration failed. Please try again.",
    "passwordMismatch": "Passwords do not match"
  }
}
```

## Testing

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Test registration flow
4. Test login flow
5. Test email verification
6. Test password reset
7. Test session management

## Next Steps

1. Implement 2FA (Two-Factor Authentication)
2. Add OAuth providers (Google, LinkedIn)
3. Implement rate limiting
4. Add security headers
5. Set up monitoring and alerts
