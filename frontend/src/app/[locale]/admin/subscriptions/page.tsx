
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
    CreditCard,
    Zap,
    Crown,
    Clock,
    History,
    RefreshCcw,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminSubscriptionsPage() {
    const t = useTranslations('Admin');

    const subscriptions = [
        { id: 'sub_1', email: 'pro.user@example.com', plan: 'Pro', amount: '$12/mo', status: 'Active', date: '2025-12-10' },
        { id: 'sub_2', email: 'enterprise@corp.com', plan: 'Premium', amount: '$29/mo', status: 'Active', date: '2025-11-20' },
        { id: 'sub_3', email: 'free.bie@gmail.com', plan: 'Free', amount: '$0/mo', status: 'Expired', date: '2025-10-05' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Subscription Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">View and manage customer billing and plans</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <History className="h-4 w-4" />
                        Billing Logs
                    </Button>
                </div>
            </div>

            {/* Plan Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: 'Active Subscriptions', count: 422, icon: Zap, color: 'text-violet-500' },
                    { name: 'Monthly Revenue', count: '$6,420', icon: CreditCard, color: 'text-emerald-500' },
                    { name: 'Pending Cancellations', count: 12, icon: Clock, color: 'text-amber-500' },
                ].map((item) => (
                    <div key={item.name} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{item.name}</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{item.count}</h3>
                        </div>
                        <item.icon className={cn("h-8 w-8 opacity-20", item.color)} />
                    </div>
                ))}
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/10 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Plan</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {subscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                        {sub.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {sub.plan === 'Premium' ? <Crown className="h-4 w-4 text-amber-500" /> : <Zap className="h-4 w-4 text-violet-500" />}
                                            <span className="text-sm font-bold">{sub.plan}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {sub.amount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                                            sub.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                        )}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {sub.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
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
