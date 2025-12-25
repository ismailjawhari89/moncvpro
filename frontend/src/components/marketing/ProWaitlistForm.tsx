'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface Props {
    source: string;
    className?: string;
    onSuccess?: () => void;
}

export default function ProWaitlistForm({ source, className = '', onSuccess }: Props) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    // Hidden honeypot field state
    const [honeypot, setHoneypot] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/pro-waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source, honeypot })
            });

            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setMessage(data.message);
                if (onSuccess) {
                    setTimeout(onSuccess, 2000);
                }
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('Failed to join waitlist. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className={`text-center py-4 px-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-in zoom-in-95 ${className}`}>
                <div className="flex flex-col items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle size={32} className="animate-bounce" />
                    <p className="font-bold text-lg">You're on the list!</p>
                    <p className="text-sm opacity-90">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`w-full ${className}`}>
            <div className="relative">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for early access"
                    className="w-full pl-5 pr-14 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={status === 'loading'}
                    required
                />

                {/* Honeypot field - hidden from users */}
                <input
                    type="text"
                    name="website_url_hp"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ position: 'absolute', opacity: 0, zIndex: -1, width: 0, height: 0, pointerEvents: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                />

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    title="Join Waitlist"
                >
                    {status === 'loading' ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <ArrowRight size={20} />
                    )}
                </button>
            </div>

            {status === 'error' && (
                <div className="mt-3 flex items-center gap-2 text-red-600 text-sm animate-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    <span>{message}</span>
                </div>
            )}

            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-1">
                <Sparkles size={12} className="text-purple-500" />
                <span>Join 500+ professionals making better CVs</span>
            </p>
        </form>
    );
}
