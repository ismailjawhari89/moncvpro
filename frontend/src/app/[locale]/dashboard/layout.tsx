
'use client';

import React from 'react';
import { Link } from '@/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ShieldCheck, LayoutDashboard, History, Settings, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuthStore();
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Security Activity', href: '/dashboard/security/activity', icon: History },
        { label: 'Email Settings', href: '/dashboard/email-preferences', icon: Mail },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {/* Simple Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/dashboard" className="text-2xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        MonCVPro
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all",
                                pathname.includes(item.href) && !item.href.endsWith('dashboard') || (item.href === '/dashboard' && pathname.endsWith('/dashboard'))
                                    ? "bg-violet-50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}

                    {user?.isAdmin && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                            <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Control</p>
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all border border-transparent hover:border-amber-100 dark:hover:border-amber-900/30"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Admin Panel
                            </Link>
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-2">
                        <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-xs font-bold text-violet-600">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
