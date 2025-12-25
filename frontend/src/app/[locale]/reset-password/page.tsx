'use client';

import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            const { error } = await resetPassword(email);
            if (error) {
                // For security reasons, often we don't want to reveal if email exists, 
                // but Supabase might handle this. We will show a generic message or the error if safe.
                console.error(error);
                setStatus('error');
                setMessage(error.message);
            } else {
                setStatus('success');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                        <p className="text-gray-500 text-sm">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
                            <p className="text-gray-500 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Return to confirmation
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                                    {message}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Sending Link...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/"
                                    className="text-sm text-gray-500 hover:text-gray-700 font-medium inline-flex items-center gap-1"
                                >
                                    <ArrowLeft size={14} />
                                    Back to Home
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
