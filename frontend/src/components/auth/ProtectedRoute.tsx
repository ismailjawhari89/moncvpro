'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    showLoginModal?: boolean;
    fallbackPath?: string;
}

/**
 * Protected Route Wrapper
 * 
 * Usage:
 * <ProtectedRoute requireAuth showLoginModal>
 *   <YourProtectedComponent />
 * </ProtectedRoute>
 * 
 * Props:
 * - requireAuth: If true, require user to be logged in
 * - showLoginModal: If true, show login modal instead of redirect
 * - fallbackPath: Custom redirect path (default: /)
 */
export default function ProtectedRoute({
    children,
    requireAuth = true,
    showLoginModal = false,
    fallbackPath,
}: ProtectedRouteProps) {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const { user, loading } = useAuth();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!loading && !user && requireAuth) {
            if (showLoginModal) {
                setShowModal(true);
            } else {
                const redirectTo = fallbackPath || `/${locale}`;
                router.replace(redirectTo);
            }
        }
    }, [user, loading, requireAuth, showLoginModal, router, locale, fallbackPath]);

    // Handle modal close - redirect to home
    const handleModalClose = () => {
        setShowModal(false);
        const redirectTo = fallbackPath || `/${locale}`;
        router.replace(redirectTo);
    };

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        );
    }

    // If not authenticated
    if (!user && requireAuth) {
        if (showLoginModal) {
            return (
                <>
                    {/* Blurred background */}
                    <div className="min-h-screen bg-gray-50/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md mx-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="text-blue-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Authentication Required
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Please sign in to access this feature
                            </p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                            >
                                Sign In / Sign Up
                            </button>
                        </div>
                    </div>

                    {/* Auth Modal */}
                    <AuthModal
                        isOpen={showModal}
                        onClose={handleModalClose}
                        defaultMode="signin"
                    />
                </>
            );
        }

        // Redirect happening, show loading
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-gray-500 text-sm">Redirecting...</p>
            </div>
        );
    }

    // User is authenticated, render children
    return <>{children}</>;
}
