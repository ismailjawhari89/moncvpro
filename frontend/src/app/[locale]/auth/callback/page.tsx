'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        // Supabase client automatically handles the hash fragment to set the session.
        // We listen for the SIGNED_IN event to redirect.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || session) {
                // Redirect to the home page (or dashboard)
                // We can use window.location.origin to ensure we go to the root with the correct locale if needed,
                // but router.push('/') relative to the current locale might be tricky if not handled.
                // Since we are in [locale], we might want to preserve it.
                // But for now, let's just push to root, middleware should handle locale?
                // Actually, router.push('/') usually goes to the root of the app.
                // Let's try to grab the locale from the URL or just redirect to '/' and let middleware handle it.
                router.push('/');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Authentification en cours...</h2>
                <p className="text-gray-600 mb-8">Veuillez patienter pendant que nous vous connectons.</p>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            </div>
        </div>
    );
}
