
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Users,
    CreditCard,
    BarChart3,
    TrendingUp,
    Activity,
    UserPlus,
    AlertTriangle,
    Mail,
    Shield
} from 'lucide-react';
import { AdminMetricCard } from '@/components/admin/AdminMetricCard';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const dummyChartData = [
    { name: 'Mon', revenue: 4000, users: 2400 },
    { name: 'Tue', revenue: 3000, users: 1398 },
    { name: 'Wed', revenue: 2000, users: 9800 },
    { name: 'Thu', revenue: 2780, users: 3908 },
    { name: 'Fri', revenue: 1890, users: 4800 },
    { name: 'Sat', revenue: 2390, users: 3800 },
    { name: 'Sun', revenue: 3490, users: 4300 },
];

export default function AdminDashboardPage() {
    const t = useTranslations('Admin');
    const [overview, setOverview] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const data = await adminService.getOverview();
                setOverview(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOverview();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('dashboard.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Announcement
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 gap-2 shadow-lg shadow-violet-500/20">
                        <TrendingUp className="h-4 w-4" />
                        Full Report
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminMetricCard
                    title={t('dashboard.totalUsers')}
                    value={overview?.totalUsers || '...'}
                    icon={Users}
                    trend={{ value: 12, isUp: true }}
                    description="Total registered accounts"
                />
                <AdminMetricCard
                    title={t('dashboard.activeSubscriptions')}
                    value={overview?.activeUsersToday || '...'}
                    icon={CreditCard}
                    trend={{ value: 5, isUp: true }}
                    description="Paying customers"
                />
                <AdminMetricCard
                    title={t('dashboard.monthlyRevenue')}
                    value={`$${overview?.mrr || 0}`}
                    icon={BarChart3}
                    trend={{ value: 8, isUp: true }}
                    description="Estimated MRR"
                />
                <AdminMetricCard
                    title={t('dashboard.churnRate')}
                    value={overview?.churnRate || '0%'}
                    icon={Activity}
                    trend={{ value: 1, isUp: false }}
                    description="Last 30 days"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Analysis</h3>
                            <p className="text-sm text-slate-500">Platform earnings over the last 7 days</p>
                        </div>
                        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-violet-500">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dummyChartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Mini-List */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t('dashboard.recentActivity')}</h3>
                    <div className="space-y-6">
                        {[
                            { action: 'New User Signup', user: 'sarah.jones@example.com', time: '2 mins ago', icon: UserPlus, color: 'text-blue-500' },
                            { action: 'Subscription Updated', user: 'mike.ross@pro.com', time: '15 mins ago', icon: CreditCard, color: 'text-emerald-500' },
                            { action: 'Brute Force Alert', user: '192.168.1.1', time: '1 hour ago', icon: AlertTriangle, color: 'text-amber-500' },
                            { action: 'System Backup', user: 'Automated', time: '4 hours ago', icon: Shield, color: 'text-slate-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={cn("p-2 rounded-lg bg-slate-100 dark:bg-slate-800", item.color)}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.action}</p>
                                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[150px]">{item.user}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-6 text-violet-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/10 text-sm font-bold">
                        View All logs
                    </Button>
                </div>
            </div>
        </div>
    );
}
