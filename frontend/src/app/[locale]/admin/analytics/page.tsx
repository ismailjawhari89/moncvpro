
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
    BarChart3,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Calendar,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const planData = [
    { name: 'Free', value: 450, color: '#94a3b8' },
    { name: 'Pro', value: 300, color: '#8b5cf6' },
    { name: 'Premium', value: 120, color: '#6366f1' },
];

const revenueData = [
    { month: 'Jan', revenue: 1200, users: 400 },
    { month: 'Feb', revenue: 1900, users: 550 },
    { month: 'Mar', revenue: 2200, users: 600 },
    { month: 'Apr', revenue: 2600, users: 720 },
    { month: 'May', revenue: 3100, users: 850 },
    { month: 'Jun', revenue: 4200, users: 1100 },
];

export default function AdminAnalyticsPage() {
    const t = useTranslations('Admin');

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('sidebar.analytics')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">Deep dive into platform performance metrics</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Last 6 Months
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                        <Download className="h-4 w-4" />
                        Export Reports
                    </Button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Customer Lifetime Value', value: '$240', trend: '+12%', isUp: true },
                    { label: 'Acquisition Cost', value: '$14.2', trend: '-5%', isUp: true },
                    { label: 'Conversion Rate', value: '4.2%', trend: '+0.8%', isUp: true },
                ].map((item) => (
                    <div key={item.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-sm font-medium text-slate-500">{item.label}</p>
                        <div className="flex items-end justify-between mt-2">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{item.value}</h3>
                            <span className={cn(
                                "text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1",
                                item.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {item.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {item.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Growth Bar Chart */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold mb-8">Revenue & Growth Trend</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="revenue" name="Revenue ($)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="users" name="New Users" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Plan Distribution Pie Chart */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold mb-8">Subscription Distribution</h3>
                    <div className="h-[350px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={planData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {planData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

