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

interface SyncStatusProps {
    cvId?: string;
    className?: string;
}

export const SyncStatus = ({ cvId, className = '' }: SyncStatusProps) => {
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
        if (!isOnline) return 'Hors ligne';
        if (isSyncing) return 'Synchronisation...';

        switch (syncStatus.status) {
            case 'synced': return 'Synchronisé';
            case 'error': return 'Erreur de sync';
            default: return hasUnsyncedChanges ? 'Modifications non sync.' : 'À jour';
        }
    };

    const formatTime = (date?: Date) => {
        if (!date) return 'Jamais';
        return new Date(date).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
            {/* Main status button */}
            <button
                onClick={() => setShowDetails(!showDetails)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm
                    text-white transition-all duration-300 hover:scale-105
                    ${getStatusColor()}
                `}
            >
                {getStatusIcon()}
                <span className="text-sm font-medium">{getStatusText()}</span>

                {/* Offline queue indicator */}
                {offlineQueueSize > 0 && (
                    <span className="ml-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                        {offlineQueueSize}
                    </span>
                )}
            </button>

            {/* Expanded details */}
            {showDetails && (
                <div className="absolute bottom-14 left-0 w-72 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl p-4 border border-gray-700">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        État de synchronisation
                    </h4>

                    <div className="space-y-2 text-sm">
                        {/* Connection status */}
                        <div className="flex items-center justify-between text-gray-300">
                            <span>Connexion:</span>
                            <span className={`flex items-center gap-1 ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                                {isOnline ? 'En ligne' : 'Hors ligne'}
                            </span>
                        </div>

                        {/* Last sync time */}
                        <div className="flex items-center justify-between text-gray-300">
                            <span>Dernière sync:</span>
                            <span className="text-gray-400">
                                {formatTime(syncStatus.lastSynced)}
                            </span>
                        </div>

                        {/* Pending changes */}
                        <div className="flex items-center justify-between text-gray-300">
                            <span>En attente:</span>
                            <span className={offlineQueueSize > 0 ? 'text-yellow-400' : 'text-gray-400'}>
                                {offlineQueueSize} élément(s)
                            </span>
                        </div>

                        {/* Error message */}
                        {syncStatus.error && (
                            <div className="mt-2 p-2 bg-red-500/20 rounded-lg text-red-300 text-xs">
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
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                        >
                            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                            Sync maintenant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SyncStatus;
