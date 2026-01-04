
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Database,
    Mail,
    ShieldCheck,
    Cpu,
    RefreshCcw,
    CheckCircle2,
    XCircle,
    Clock,
    Server,
    Zap
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
    const t = useTranslations('Admin');
    const [health, setHealth] = useState<any>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchHealth = async () => {
        setIsRefreshing(true);
        try {
            const data = await adminService.getHealth();
            setHealth(data);
        } catch (err) {
            toast.error('Health check failed');
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHealth();
    }, []);

    const services = [
        { name: 'Database', key: 'database', icon: Database, desc: 'PostgreSQL Main Instance' },
        { name: 'Redis Cache', key: 'redis', icon: Zap, desc: 'Session & Rate Limit Storage' },
        { name: 'Email Engine', key: 'api', icon: Mail, desc: 'SMTP Relay & Verification' },
        { name: 'Sentry', key: 'api', icon: ShieldCheck, desc: 'Error & Performance Tracking' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('sidebar.settings')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage system configurations and monitor health</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={fetchHealth}
                    disabled={isRefreshing}
                >
                    <RefreshCcw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                    Refresh Status
                </Button>
            </div>

            {/* Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service) => (
                    <div key={service.name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500">
                                <service.icon className="h-5 w-5" />
                            </div>
                            {health?.status === 'healthy' ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                                <Clock className="h-5 w-5 text-amber-500" />
                            )}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{service.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{service.desc}</p>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Operational</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* System Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Server className="h-5 w-5 text-violet-500" />
                        Infrastructure Info
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'API Version', value: 'v1.4.0 (Stable)' },
                            { label: 'Environment', value: 'Production' },
                            { label: 'Uptime', value: '14 days, 3 hours' },
                            { label: 'Node Version', value: 'v20.10.0' },
                            { label: 'Region', value: 'EU-West (Frankfurt)' },
                        ].map((item) => (
                            <div key={item.label} className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <span className="text-sm font-medium text-slate-500">{item.label}</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-amber-500" />
                        Maintenance Controls
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Maintenance Mode</p>
                                <p className="text-xs text-slate-500">Redirect users to landing page</p>
                            </div>
                            <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900">Enable</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Clear Cache</p>
                                <p className="text-xs text-slate-500">Force invalidate all Redis keys</p>
                            </div>
                            <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900">Execute</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                            <div>
                                <p className="text-sm font-bold text-red-600 dark:text-red-400">Emergency Stop</p>
                                <p className="text-xs text-red-400">Instantly revoke all access tokens</p>
                            </div>
                            <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700">STOP</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
