
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Laptop, Smartphone, Monitor, Globe, LogOut, Loader2, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Session {
    id: string;
    deviceName: string;
    ipAddress: string;
    lastActivityAt: string;
    userAgent: string;
    createdAt: string;
}

export const SessionManager = () => {
    const t = useTranslations('Sessions');
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [revokingId, setRevokingId] = useState<string | null>(null);

    const fetchSessions = async () => {
        try {
            const data = await authService.getSessions();
            setSessions(data);
        } catch (error) {
            console.error('Failed to fetch sessions', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id: string) => {
        setRevokingId(id);
        try {
            await authService.revokeSession(id);
            toast.success(t('revokedSuccess'));
            setSessions(sessions.filter(s => s.id !== id));
        } catch (error) {
            toast.error('Failed to revoke session');
        } finally {
            setRevokingId(null);
        }
    };

    const handleLogoutAll = async () => {
        if (!confirm('Are you sure you want to log out from all other devices?')) return;
        try {
            await authService.logoutAllDevices();
            toast.success(t('logoutAllSuccess'));
            fetchSessions();
        } catch (error) {
            toast.error('Failed to logout from all devices');
        }
    };

    const getDeviceIcon = (deviceName: string) => {
        if (deviceName.toLowerCase().includes('mobile')) return <Smartphone className="h-5 w-5" />;
        if (deviceName.toLowerCase().includes('chrome')) return <Monitor className="h-5 w-5" />;
        return <Globe className="h-5 w-5" />;
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-violet-600" /></div>;

    return (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500 h-6 w-6" />
                        {t('title')}
                    </h2>
                    <p className="text-sm text-slate-500">{t('subtitle')}</p>
                </div>
                {sessions.length > 1 && (
                    <Button variant="outline" size="sm" onClick={handleLogoutAll} className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50">
                        {t('logoutAllButton')}
                    </Button>
                )}
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sessions.map((session, index) => (
                    <div key={session.id} className="py-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                                {getDeviceIcon(session.deviceName)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{session.deviceName}</span>
                                    {index === 0 && (
                                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full font-bold uppercase">
                                            {t('currentDevice')}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                    <span>{session.ipAddress}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(session.lastActivityAt), { addSuffix: true })}</span>
                                </div>
                            </div>
                        </div>

                        {index !== 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRevoke(session.id)}
                                disabled={revokingId === session.id}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                            >
                                {revokingId === session.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                                <span className="ml-2 text-xs">{t('revokeButton')}</span>
                            </Button>
                        )}
                    </div>
                ))}

                {sessions.length === 0 && (
                    <div className="py-8 text-center text-slate-500 italic">
                        {t('noSessions')}
                    </div>
                )}
            </div>
        </div>
    );
};
