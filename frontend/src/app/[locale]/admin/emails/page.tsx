
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Send, Activity, BarChart3, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/adminService'; // I should check if I need to add email methods to adminService
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminEmailsPage() {
    const t = useTranslations('Admin');
    const [stats, setStats] = useState<any>({ sent: 0, delivered: 0, opened: 0, bounced: 0 });
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data for now as we don't have these admin endpoints yet
        setStats({ sent: 1240, delivered: 1205, opened: 842, bounced: 5 });
        setEvents([
            { id: '1', user: 'john@example.com', template: 'welcome', status: 'delivered', time: new Date() },
            { id: '2', user: 'sarah@test.com', template: 'verify-email', status: 'sent', time: new Date(Date.now() - 5000) },
        ]);
        setIsLoading(false);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Email Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Monitor deliverability and email queue status</p>
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
                    <Send className="h-4 w-4" />
                    Send Campaign
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Sent', value: stats.sent, icon: Send, color: 'text-blue-500' },
                    { label: 'Delivered', value: stats.delivered, icon: Activity, color: 'text-emerald-500' },
                    { label: 'Opened', value: stats.opened, icon: Mail, color: 'text-violet-500' },
                    { label: 'Bounced', value: stats.bounced, icon: AlertCircle, color: 'text-red-500' },
                ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">{s.label}</span>
                            <s.icon className={`h-4 w-4 ${s.color}`} />
                        </div>
                        <h3 className="text-2xl font-black mt-2 text-slate-900 dark:text-white">{s.value.toLocaleString()}</h3>
                    </div>
                ))}
            </div>

            {/* Email Log */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="font-bold">Live Email Log</h2>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Recipient</th>
                                <th className="px-6 py-4">Template</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Process Time</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {events.map((ev) => (
                                <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{ev.user}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                                            {ev.template}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${ev.status === 'delivered' ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50'
                                            }`}>
                                            {ev.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {format(ev.time, 'HH:mm:ss')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button variant="ghost" size="sm" className="text-violet-500">Resend</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
