
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import api from '@/lib/axios';
import { format } from 'date-fns';
import {
    Shield,
    ShieldAlert,
    ShieldCheck,
    Clock,
    Globe,
    Monitor,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuditLog {
    id: number;
    action: string;
    actionDetails: any;
    ipAddress: string | null;
    userAgent: string | null;
    status: string;
    createdAt: string;
}

export default function SecurityActivityPage() {
    const t = useTranslations('Security');
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/users/security-activity');
            setLogs(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load security activity');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getEventIcon = (action: string, status: string) => {
        if (status === 'failure') return <ShieldAlert className="h-5 w-5 text-red-500" />;
        if (action.includes('SUCCESS') || action.includes('ENABLED') || action.includes('VERIFIED')) {
            return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
        }
        return <Shield className="h-5 w-5 text-violet-500" />;
    };

    const getEventLabel = (action: string) => {
        return t(`events.${action}`) || action;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchLogs}
                    disabled={isLoading}
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {t('refresh')}
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-3 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-bottom border-gray-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{t('event')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{t('ip')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{t('timestamp')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-slate-800 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 dark:bg-slate-800 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded"></div></td>
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        {t('noActivity')}
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {getEventIcon(log.action, log.status)}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {getEventLabel(log.action)}
                                                    </p>
                                                    {log.userAgent && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                                            {log.userAgent}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <Globe className="h-3.5 w-3.5 opacity-50" />
                                                {log.ipAddress || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.status === 'success'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
