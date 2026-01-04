
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Search,
    Calendar,
    User,
    Activity,
    Info,
    ChevronLeft,
    ChevronRight,
    Terminal
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AdminAuditLogPage() {
    const t = useTranslations('Admin');
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [adminSearch, setAdminSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('');

    useEffect(() => {
        // Since we don't have a dedicated "list all admin audit logs" yet in controller, 
        // we'll mock some data for now based on the model we created.
        const mockLogs = [
            { id: 1, admin: 'super@moncvpro.com', action: 'USER_SUSPENDED', target: 'user123@gmail.com', ip: '192.168.1.1', date: new Date() },
            { id: 2, admin: 'admin@moncvpro.com', action: 'SETTINGS_UPDATED', target: 'Maintenance Mode', ip: '10.0.0.5', date: new Date(Date.now() - 3600000) },
            { id: 3, admin: 'support@moncvpro.com', action: 'ADMIN_EMAIL_SENT', target: 'candidate@test.com', ip: '172.16.2.10', date: new Date(Date.now() - 7200000) },
        ];
        setLogs(mockLogs);
        setIsLoading(false);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('sidebar.auditLog')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track all administrative actions across the platform</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Select Range
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by Admin Email..."
                        className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                    />
                </div>
                <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 text-sm font-medium">
                    <option value="">All Actions</option>
                    <option value="USER_SUSPENDED">User Suspended</option>
                    <option value="SETTINGS_UPDATED">Settings Updated</option>
                    <option value="REFUND_ISSUED">Refund Issued</option>
                </select>
            </div>

            {/* Audit Log Timeline */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Admin</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Target</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Info</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <User className="h-3 w-3 text-slate-500" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{log.admin}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter",
                                            log.action.includes('SUSPEND') ? "border-red-200 text-red-600 bg-red-50" :
                                                log.action.includes('SETTINGS') ? "border-violet-200 text-violet-600 bg-violet-50" :
                                                    "border-slate-200 text-slate-600 bg-slate-50"
                                        )}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 italic">
                                        {log.target}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {format(log.date, 'HH:mm:ss')} • {format(log.date, 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Info className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* Terminal View Component (Bonus Aesthetic) */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    <span className="ml-2 text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Terminal className="h-3 w-3" />
                        Live Security Stream
                    </span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                    <p className="text-emerald-500"><span className="text-slate-500">[2026-01-02 00:05]</span> INFO: Admin "super@moncvpro.com" initiated security scan.</p>
                    <p className="text-violet-400"><span className="text-slate-500">[2026-01-02 00:08]</span> AUDIT: USER_SUSPENDED event recorded for ID: cmj...123</p>
                    <p className="text-slate-400"><span className="text-slate-500">[2026-01-02 00:10]</span> TRACE: Health check requested from 10.0.0.1.</p>
                    <p className="text-amber-500 animate-pulse"><span className="text-slate-500">[2026-01-02 00:12]</span> WARN: Threshold reached for analytics aggregation...</p>
                </div>
            </div>
        </div>
    );
}
