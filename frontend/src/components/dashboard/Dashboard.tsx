// User Dashboard Component
'use client';

import React, { useState, useEffect } from 'react';
import {
    FileText,
    Plus,
    Trash2,
    Edit,
    Download,
    TrendingUp,
    Sparkles,
    BarChart3,
    Clock,
    Loader2,
    Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cvService, type SavedCV, type UserAnalytics } from '@/services/cvService';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [cvs, setCVs] = useState<SavedCV[]>([]);
    const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCV, setSelectedCV] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const [cvsResult, analyticsResult] = await Promise.all([
                cvService.getUserCVs(user.id),
                cvService.getUserAnalytics(user.id),
            ]);

            if (cvsResult.data) setCVs(cvsResult.data);
            if (analyticsResult.data) setAnalytics(analyticsResult.data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCV = async (cvId: string) => {
        if (!confirm('Are you sure you want to delete this CV?')) return;

        const { error } = await cvService.deleteCV(cvId);
        if (!error) {
            setCVs(cvs.filter(cv => cv.id !== cvId));
        }
    };

    const handleEditCV = (cvId: string) => {
        router.push(`/cv-builder?id=${cvId}`);
    };

    const handleCreateNew = () => {
        router.push('/cv-builder');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                    <p className="text-gray-600">Manage your CVs and track your progress</p>
                </div>

                {/* Analytics Cards */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <FileText className="text-blue-600" size={24} />
                                <span className="text-2xl font-bold text-gray-900">{analytics.cvs_created}</span>
                            </div>
                            <p className="text-sm text-gray-600">CVs Created</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Sparkles className="text-purple-600" size={24} />
                                <span className="text-2xl font-bold text-gray-900">{analytics.ai_uses}</span>
                            </div>
                            <p className="text-sm text-gray-600">AI Assists</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Download className="text-green-600" size={24} />
                                <span className="text-2xl font-bold text-gray-900">{analytics.exports_count}</span>
                            </div>
                            <p className="text-sm text-gray-600">Exports</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="text-orange-600" size={24} />
                                <span className="text-sm font-bold text-gray-900 capitalize">{analytics.most_used_template}</span>
                            </div>
                            <p className="text-sm text-gray-600">Favorite Template</p>
                        </div>
                    </div>
                )}

                {/* CVs List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">My CVs</h2>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                        >
                            <Plus size={18} />
                            Create New CV
                        </button>
                    </div>

                    {cvs.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No CVs yet</h3>
                            <p className="text-gray-600 mb-6">Create your first professional CV now!</p>
                            <button
                                onClick={handleCreateNew}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                            >
                                <Plus size={20} />
                                Get Started
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cvs.map((cv) => (
                                <div
                                    key={cv.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{cv.title}</h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={12} />
                                                Updated {new Date(cv.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                                            {cv.template}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditCV(cv.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all"
                                        >
                                            <Edit size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setSelectedCV(cv.id)}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-all"
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCV(cv.id)}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {cv.version > 1 && (
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">Version {cv.version}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
