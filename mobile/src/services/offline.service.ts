
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { cvService } from './cv.service';

/**
 * Service to handle offline actions and sync them when back online
 */
export class OfflineService {
    private queue: any[] = [];
    private isOnline = true;
    private STORAGE_KEY = 'moncvpro_sync_queue';

    constructor() {
        this.setupNetworkListener();
        this.restoreQueue();
    }

    private setupNetworkListener() {
        NetInfo.addEventListener(state => {
            const wasOffline = !this.isOnline;
            this.isOnline = state.isConnected ?? false;

            if (wasOffline && this.isOnline) {
                console.log('[OfflineService] Back online, syncing queue...');
                this.syncQueue();
            }
        });
    }

    async addToQueue(action: string, data: any) {
        const item = {
            id: Date.now(),
            action,
            data,
            timestamp: new Date(),
            retries: 0
        };

        if (this.isOnline) {
            try {
                await this.executeAction(item);
                return; // Success, no need to queue
            } catch (error) {
                console.warn('[OfflineService] Immediate execution failed, adding to queue');
            }
        }

        this.queue.push(item);
        await this.saveQueue();
    }

    private async syncQueue() {
        if (!this.isOnline || this.queue.length === 0) return;

        console.log(`[OfflineService] Syncing ${this.queue.length} items...`);
        const itemsToSync = [...this.queue];

        for (const item of itemsToSync) {
            try {
                await this.executeAction(item);
                this.queue = this.queue.filter(q => q.id !== item.id);
            } catch (error) {
                item.retries++;
                console.error(`[OfflineService] Failed to sync item ${item.id} (Attempt ${item.retries})`, error);
                if (item.retries >= 3) {
                    this.queue = this.queue.filter(q => q.id !== item.id);
                }
            }
        }

        await this.saveQueue();
    }

    private async executeAction(item: any) {
        switch (item.action) {
            case 'UPDATE_CV':
                return await cvService.updateCV(item.data.cvId, item.data.updates);
            case 'CREATE_CV':
                return await cvService.createCV(item.data);
            default:
                console.warn(`[OfflineService] Unknown action: ${item.action}`);
        }
    }

    private async saveQueue() {
        try {
            await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
        } catch (e) {
            console.error('[OfflineService] Failed to save queue', e);
        }
    }

    private async restoreQueue() {
        try {
            const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.queue = JSON.parse(stored);
                if (this.isOnline) this.syncQueue();
            }
        } catch (e) {
            console.error('[OfflineService] Failed to restore queue', e);
        }
    }
}

export const offlineService = new OfflineService();
