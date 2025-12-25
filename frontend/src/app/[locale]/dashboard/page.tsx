'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Dashboard from '@/components/dashboard/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

/**
 * Protected Dashboard Page
 * Redirects unauthenticated users to home page
 */
export default function DashboardPage() {
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string || 'en';
    const { user, loading } = useAuth();

    useEffect(() => {
        // If not loading and no user, redirect to home
        if (!loading && !user) {
            router.replace(`/${locale}`);
        }
    }, [user, loading, router, locale]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-gray-600 font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    // If no user after loading, show nothing (redirect is happening)
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-gray-500 text-sm">Redirecting to login...</p>
            </div>
        );
    }

    // User is authenticated, show dashboard
    return <Dashboard />;
}
