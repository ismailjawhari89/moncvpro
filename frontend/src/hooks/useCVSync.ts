import { useEffect, useCallback, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCVStore } from '@/stores/useCVStore';
import { cvApi } from '@/lib/api/cvApi';

interface SyncStatus {
    status: 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
    lastSynced?: Date;
    error?: string;
}

export const useCVSync = (cvId?: string) => {
    const queryClient = useQueryClient();
    const currentCV = useCVStore((state) => state.cvData);
    const setCurrentCV = useCVStore((state) => state.applyTemplate);

    const [syncStatus, setSyncStatus] = useState<SyncStatus>({ status: 'idle' });
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastDataRef = useRef<string>('');

    // Generate client ID for this session
    const clientId = useRef<string>(`client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    // Query for fetching server data
    const { data: serverData, isLoading: isFetching, refetch } = useQuery({
        queryKey: ['cv', cvId],
        queryFn: () => cvApi.getCV(cvId!),
        enabled: !!cvId && isOnline,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Sync mutation
    const syncMutation = useMutation({
        mutationFn: async (cvData: any) => {
            return cvApi.syncCV({
                cvData,
                lastSync: syncStatus.lastSynced?.toISOString(),
                clientId: clientId.current
            });
        },
        onMutate: () => {
            setSyncStatus(prev => ({ ...prev, status: 'syncing' }));
        },
        onSuccess: (data: any) => {
            if (data.success && data.cv) {
                // Update store with server response if there were merges
                if (data.action === 'merged' || data.action === 'created') {
                    setCurrentCV(data.cv.data);
                }

                setSyncStatus({
                    status: 'synced',
                    lastSynced: new Date(data.timestamp)
                });

                // Invalidate related queries
                queryClient.invalidateQueries({ queryKey: ['cv', data.cv._id] });
            }
        },
        onError: (error: any) => {
            console.error('Sync failed:', error);
            setSyncStatus({
                status: 'error',
                error: error.message || 'Sync failed'
            });

            // Save to offline queue
            if (currentCV) {
                saveToOfflineQueue(currentCV);
            }
        }
    });

    // Save to offline queue
    const saveToOfflineQueue = useCallback((data: any) => {
        try {
            const offlineQueue = JSON.parse(localStorage.getItem('cv_offline_queue') || '[]');
            offlineQueue.push({
                id: data.id || `temp_${Date.now()}`,
                data,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('cv_offline_queue', JSON.stringify(offlineQueue));
        } catch (e) {
            console.error('Failed to save to offline queue:', e);
        }
    }, []);

    // Process offline queue
    const processOfflineQueue = useCallback(async () => {
        const queueStr = localStorage.getItem('cv_offline_queue');
        if (!queueStr) return;

        try {
            const queue = JSON.parse(queueStr);
            if (queue.length === 0) return;

            for (const item of queue) {
                await syncMutation.mutateAsync(item.data);
            }

            // Clear queue on success
            localStorage.removeItem('cv_offline_queue');
        } catch (e) {
            console.error('Failed to process offline queue:', e);
        }
    }, [syncMutation]);

    // Debounced sync function
    const debouncedSync = useCallback(() => {
        if (!currentCV || !isOnline) return;

        // Check if data actually changed
        const currentDataStr = JSON.stringify(currentCV);
        if (currentDataStr === lastDataRef.current) return;

        // Clear existing timeout
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }

        // Set new timeout
        syncTimeoutRef.current = setTimeout(() => {
            lastDataRef.current = currentDataStr;
            syncMutation.mutate(currentCV);
        }, 2000);
    }, [currentCV, isOnline, syncMutation]);

    // Auto-sync on data changes
    useEffect(() => {
        debouncedSync();

        return () => {
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }
        };
    }, [currentCV, debouncedSync]);

    // Periodic sync (every 30 seconds)
    useEffect(() => {
        if (!isOnline) return;

        const interval = setInterval(() => {
            if (currentCV && isOnline) {
                debouncedSync();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [currentCV, isOnline, debouncedSync]);

    // Online/offline detection
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setSyncStatus(prev => ({ ...prev, status: 'idle' }));
            processOfflineQueue();
        };

        const handleOffline = () => {
            setIsOnline(false);
            setSyncStatus(prev => ({ ...prev, status: 'offline' }));
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [processOfflineQueue]);

    // Manual sync function
    const manualSync = useCallback(() => {
        if (currentCV && isOnline) {
            lastDataRef.current = ''; // Force sync
            syncMutation.mutate(currentCV);
        }
    }, [currentCV, isOnline, syncMutation]);

    // Pull latest from server
    const pullFromServer = useCallback(async () => {
        if (cvId && isOnline) {
            const result = await refetch();
            if (result.data?.data) {
                setCurrentCV(result.data.data);
            }
        }
    }, [cvId, isOnline, refetch, setCurrentCV]);

    return {
        // Server data
        serverData,
        isFetching,

        // Sync status
        syncStatus,
        isSyncing: syncMutation.isPending,
        isOnline,

        // Actions
        manualSync,
        pullFromServer,

        // Computed
        hasUnsyncedChanges: lastDataRef.current !== JSON.stringify(currentCV),
        offlineQueueSize: (() => {
            try {
                const queue = JSON.parse(localStorage.getItem('cv_offline_queue') || '[]');
                return queue.length;
            } catch {
                return 0;
            }
        })()
    };
};

export default useCVSync;
