
'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    BarChart3,
    Settings,
    History,
    ExternalLink,
    LogOut,
    Menu,
    X,
    Bell,
    Mail,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const t = useTranslations('Admin');
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
            router.push('/dashboard');
        }
    }, [user, isAuthenticated, isLoading, router]);

    if (isLoading || !user?.isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
        );
    }

    const navItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), href: '/admin' },
        { icon: Users, label: t('sidebar.users'), href: '/admin/users' },
        { icon: CreditCard, label: t('sidebar.subscriptions'), href: '/admin/subscriptions' },
        { icon: BarChart3, label: t('sidebar.analytics'), href: '/admin/analytics' },
        { icon: History, label: t('sidebar.auditLog'), href: '/admin/audit-log' },
        { icon: Mail, label: 'Emails', href: '/admin/emails' },
        { icon: Activity, label: 'Performance', href: '/admin/performance' },
        { icon: Settings, label: t('sidebar.settings'), href: '/admin/settings' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0",
                !isSidebarOpen && "-translate-x-full lg:hidden"
            )}>
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center justify-between">
                        <Link href="/admin" className="text-2xl font-black bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                            MonCVPro <span className="text-[10px] py-0.5 px-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded ml-1 font-bold">ADMIN</span>
                        </Link>
                        <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                            >
                                <item.icon className="h-5 w-5 text-slate-500 group-hover:text-violet-500" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ExternalLink className="h-5 w-5 text-slate-500" />
                            {t('sidebar.backToApp')}
                        </Link>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 px-4 py-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                            onClick={() => {
                                useAuthStore.getState().logout();
                                router.push('/login');
                            }}
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h2 className="text-lg font-semibold lg:block hidden">System Control Center</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </Button>

                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user.firstName} {user.lastName}</p>
                                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">{user.role || 'Super Admin'}</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
