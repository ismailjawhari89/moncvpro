'use client';

import { useEffect, useState } from 'react';
import { useCVStore } from '@/stores/useCVStore';
import useCVSync from '@/hooks/useCVSync';
import {
    CheckCircle,
    Loader2,
    Cloud,
    CloudOff,
    RefreshCw,
    AlertTriangle,
    Wifi,
    WifiOff
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SyncStatusProps {
    cvId?: string;
    className?: string;
}

export const SyncStatus = ({ cvId, className = '' }: SyncStatusProps) => {
    const t = useTranslations('cvBuilder.sync');
    const {
        syncStatus,
        isSyncing,
        isOnline,
        manualSync,
        offlineQueueSize,
        hasUnsyncedChanges
    } = useCVSync(cvId);

    const [showDetails, setShowDetails] = useState(false);

    const getStatusColor = () => {
        if (!isOnline) return 'bg-gray-600';
        switch (syncStatus.status) {
            case 'synced': return 'bg-green-500';
            case 'syncing': return 'bg-blue-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusIcon = () => {
        if (!isOnline) return <WifiOff className="h-4 w-4" />;
        if (isSyncing) return <Loader2 className="h-4 w-4 animate-spin" />;

        switch (syncStatus.status) {
            case 'synced': return <CheckCircle className="h-4 w-4" />;
            case 'error': return <AlertTriangle className="h-4 w-4" />;
            default: return <Cloud className="h-4 w-4" />;
        }
    };

    const getStatusText = () => {
        if (!isOnline) return t('offline');
        if (isSyncing) return t('syncing');

        switch (syncStatus.status) {
            case 'synced': return t('synced');
            case 'error': return t('error');
            default: return hasUnsyncedChanges ? t('unsynced') : t('upToDate');
        }
    };

    const formatTime = (date?: Date) => {
        if (!date) return t('never');
        return new Date(date).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className={`fixed bottom-4 left-4 z-50 ${className} rtl:left-auto rtl:right-4`}>
            {/* Main status button */}
            <button
                onClick={() => setShowDetails(!showDetails)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm
                    text-white transition-all duration-300 hover:scale-105 active:scale-95
                    ${getStatusColor()}
                `}
            >
                {getStatusIcon()}
                <span className="text-sm font-medium">{getStatusText()}</span>

                {/* Offline queue indicator */}
                {offlineQueueSize > 0 && (
                    <span className="ml-1 rtl:mr-1 rtl:ml-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                        {offlineQueueSize}
                    </span>
                )}
            </button>

            {/* Expanded details */}
            {showDetails && (
                <div className="absolute bottom-14 left-0 rtl:left-auto rtl:right-0 w-72 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl p-4 border border-gray-700 animate-in fade-in slide-in-from-bottom-5 duration-200">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Cloud className="h-4 w-4 text-blue-400" />
                        {t('title')}
                    </h4>

                    <div className="space-y-3 text-sm">
                        {/* Connection status */}
                        <div className="flex items-center justify-between text-gray-300">
                            <span>{t('connection')}</span>
                            <span className={`flex items-center gap-1 font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                                {isOnline ? t('online') : t('offline')}
                            </span>
                        </div>

                        {/* Last sync time */}
                        <div className="flex items-center justify-between text-gray-300">
                            <span>{t('lastSync')}</span>
                            <span className="text-gray-400 font-mono">
                                {formatTime(syncStatus.lastSynced)}
                            </span>
                        </div>

                        {/* Pending changes */}
                        <div className="flex items-center justify-between text-gray-300">
                            <span>{t('pending')}</span>
                            <span className={`font-medium ${offlineQueueSize > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                {t('items', { count: offlineQueueSize })}
                            </span>
                        </div>

                        {/* Error message */}
                        {syncStatus.error && (
                            <div className="mt-2 p-3 bg-red-500/20 rounded-lg text-red-200 text-xs border border-red-500/30">
                                {syncStatus.error}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-gray-700 flex gap-2">
                        <button
                            onClick={() => {
                                manualSync();
                                setShowDetails(false);
                            }}
                            disabled={isSyncing || !isOnline}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all shadow-lg active:scale-95"
                        >
                            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                            {t('syncNow')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SyncStatus;
