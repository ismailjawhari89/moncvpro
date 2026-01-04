
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Bell, Shield, Info, CheckCircle2, History as HistoryIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { emailService } from '@/services/emailService';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function EmailPreferencesPage() {
    const t = useTranslations('Dashboard'); // Using Dashboard as base, might need refinement
    const [preferences, setPreferences] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [prefs, hist] = await Promise.all([
                    emailService.getPreferences(),
                    emailService.getHistory()
                ]);
                setPreferences(prefs);
                setHistory(hist);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load email settings');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleToggle = async (key: string) => {
        const newPrefs = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPrefs);

        try {
            await emailService.updatePreferences(newPrefs);
            toast.success('Preferences updated');
        } catch (err) {
            toast.error('Failed to update preferences');
            // Revert on failure
            setPreferences(preferences);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
            </div>
        );
    }

    const categories = [
        {
            id: 'securityAlerts',
            title: 'Security & Account',
            description: 'Critical alerts about your account security, password changes, and login attempts.',
            icon: Shield,
            fixed: true
        },
        {
            id: 'onboardingEmails',
            title: 'Getting Started',
            description: 'Tips and tricks to help you get the most out of MonCVPro during your first week.',
            icon: Bell,
            fixed: false
        },
        {
            id: 'productUpdates',
            title: 'Product Updates',
            description: 'Stay informed about new features, improvements, and major changes.',
            icon: Info,
            fixed: false
        },
        {
            id: 'newsletters',
            title: 'Tips & Newsletters',
            description: 'Curated career advice, resume writing tips, and industry trends.',
            icon: Mail,
            fixed: false
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Email Preferences</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Control how and when we communicate with you.</p>
            </div>

            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Bell className="h-5 w-5 text-violet-500" />
                        Notification Categories
                    </h2>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categories.map((cat) => (
                        <div key={cat.id} className="p-8 flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex gap-4">
                                <div className="mt-1 p-2 rounded-xl bg-violet-50 dark:bg-violet-900/10 text-violet-600">
                                    <cat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{cat.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">{cat.description}</p>
                                    {cat.fixed && (
                                        <span className="inline-block mt-2 text-[10px] uppercase font-black tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-900/10 px-2 py-0.5 rounded">Required for security</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <button
                                    disabled={cat.fixed}
                                    onClick={() => handleToggle(cat.id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${preferences[cat.id] || cat.fixed ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'
                                        } ${cat.fixed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <span
                                        className={`${preferences[cat.id] || cat.fixed ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <HistoryIcon className="h-5 w-5 text-violet-500" />
                        Recent Emails
                    </h2>
                    <Button variant="ghost" size="sm" className="text-violet-500">View Archive</Button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    {history.length === 0 ? (
                        <div className="p-12 text-center">
                            <Mail className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500">No email history found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Subject</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {history.map((email) => (
                                    <tr key={email.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {(email.metadata as any)?.subject || email.templateId}
                                            </p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded-full">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Sent
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-slate-500">
                                            {format(new Date(email.createdAt), 'MMM d, h:mm a')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </div>
    );
}
