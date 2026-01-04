
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Activity, Zap, HardDrive, Cpu, Percent, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function PerformanceDashboard() {
    const t = useTranslations('Admin');
    const [metrics, setMetrics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data for performance metrics
        const mockData = {
            responseTime: [
                { time: '00:00', value: 45 },
                { time: '04:00', value: 38 },
                { time: '08:00', value: 85 },
                { time: '12:00', value: 120 },
                { time: '16:00', value: 95 },
                { time: '20:00', value: 55 },
                { time: '23:59', value: 42 },
            ],
            cacheHitRate: [
                { time: '00:00', value: 82 },
                { time: '04:00', value: 88 },
                { time: '08:00', value: 75 },
                { time: '12:00', value: 68 },
                { time: '16:00', value: 72 },
                { time: '20:00', value: 80 },
                { time: '23:59', value: 85 },
            ],
            resourceUsage: {
                cpu: 18,
                memory: 42,
                storage: 25
            }
        };

        setMetrics(mockData);
        setIsLoading(false);
    }, []);

    if (isLoading) return <div className="p-8 animate-pulse text-slate-500">Optimizing View...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Performance Monitor</h1>
                    <p className="text-slate-500 dark:text-slate-400">Real-time system health and optimization metrics</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh Stats
                </Button>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Fast</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Avg Response</p>
                    <h3 className="text-3xl font-black mt-1">74<span className="text-sm ml-1 text-slate-400">ms</span></h3>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="h-5 w-5 text-violet-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-violet-500">Optimal</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Cache Hit Rate</p>
                    <h3 className="text-3xl font-black mt-1">78.2<span className="text-sm ml-1 text-slate-400">%</span></h3>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <Cpu className="h-5 w-5 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Low Load</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">CPU Usage</p>
                    <h3 className="text-3xl font-black mt-1">{metrics.resourceUsage.cpu}<span className="text-sm ml-1 text-slate-400">%</span></h3>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <HardDrive className="h-5 w-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Stable</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Memory</p>
                    <h3 className="text-3xl font-black mt-1">{metrics.resourceUsage.memory}<span className="text-sm ml-1 text-slate-400">%</span></h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold mb-6">API Latency (24h)</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.responseTime}>
                                <defs>
                                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold mb-6">Cache Performance</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.cacheHitRate}>
                                <defs>
                                    <linearGradient id="colorCache" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCache)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Alerts & Optimization */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-6 rounded-2xl flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5" />
                <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-400">Performance Suggestion</h4>
                    <p className="text-sm text-amber-800 dark:text-amber-500 mt-1">Your cache hit rate dropped between 10 AM and 2 PM. Consider extending the TTL for the Admin Analytics route to 15 minutes during peak hours.</p>
                </div>
            </div>
        </div>
    );
}
