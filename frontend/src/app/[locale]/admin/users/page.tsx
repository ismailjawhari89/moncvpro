
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Search,
    Filter,
    MoreVertical,
    UserX,
    UserCheck,
    Mail,
    Trash2,
    ShieldAlert,
    ExternalLink,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminUsersPage() {
    const t = useTranslations('Admin');
    const [users, setUsers] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getUsers(page, 10, { search });
            setUsers(data.users);
            setTotal(data.metadata.total);
        } catch (err) {
            toast.error('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handleSuspend = async (userId: string) => {
        try {
            await adminService.suspendUser(userId, 'Administrative action');
            toast.success('User suspended');
            fetchUsers();
        } catch (err) {
            toast.error('Failed to suspend user');
        }
    };

    const handleReactivate = async (userId: string) => {
        try {
            await adminService.reactivateUser(userId);
            toast.success('User reactivated');
            fetchUsers();
        } catch (err) {
            toast.error('Failed to reactivate user');
        }
    };

    const getStatusBadge = (user: any) => {
        if (user.suspendedAt) return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">{t('users.status.suspended')}</span>;
        if (!user.emailVerified) return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">{t('users.status.unverified')}</span>;
        return <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">{t('users.status.active')}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('users.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('users.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-2">
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder={t('users.searchPlaceholder')}
                        className="pl-10 h-10 border-none bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-violet-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t('users.table.email')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t('users.table.name')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t('users.table.status')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t('users.table.joined')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">{t('users.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 flex items-center justify-center font-bold text-xs uppercase">
                                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                                </div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(user)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-violet-500">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                                {user.suspendedAt ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
                                                        onClick={() => handleReactivate(user.id)}
                                                    >
                                                        <UserCheck className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                                                        onClick={() => handleSuspend(user.id)}
                                                    >
                                                        <UserX className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-slate-900 dark:text-white">{users.length}</span> of <span className="text-slate-900 dark:text-white">{total}</span> users
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={users.length < 10}
                            onClick={() => setPage(p => p + 1)}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
