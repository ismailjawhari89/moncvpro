
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminMetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    description?: string;
    className?: string;
}

export function AdminMetricCard({
    title,
    value,
    icon: Icon,
    trend,
    description,
    className
}: AdminMetricCardProps) {
    return (
        <div className={cn(
            "p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow",
            className
        )}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-violet-50 dark:bg-violet-900/10 rounded-xl text-violet-500">
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                        trend.isUp
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400"
                            : "bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400"
                    )}>
                        {trend.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {trend.value}%
                    </div>
                )}
            </div>

            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
                {description && (
                    <p className="text-xs text-slate-400 mt-2">{description}</p>
                )}
            </div>
        </div>
    );
}
