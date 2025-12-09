/**
 * Cache Strategy with Stale-While-Revalidate pattern
 * Provides intelligent caching for CV data with background refresh
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    staleAt: number;
    expiresAt: number;
}

interface CacheOptions {
    staleTime?: number;      // Time in ms before data is considered stale (default: 1 min)
    maxAge?: number;         // Time in ms before data expires completely (default: 5 min)
}

const DEFAULT_STALE_TIME = 60 * 1000;        // 1 minute
const DEFAULT_MAX_AGE = 5 * 60 * 1000;       // 5 minutes

export class CacheStrategy {
    private cache: Map<string, CacheEntry<any>>;
    private pendingRefreshes: Map<string, Promise<any>>;

    constructor() {
        this.cache = new Map();
        this.pendingRefreshes = new Map();
    }

    /**
     * Get data from cache or fetch fresh data
     * Implements stale-while-revalidate pattern
     */
    async get<T>(
        key: string,
        fetcher: () => Promise<T>,
        options: CacheOptions = {}
    ): Promise<T> {
        const { staleTime = DEFAULT_STALE_TIME, maxAge = DEFAULT_MAX_AGE } = options;
        const now = Date.now();
        const cached = this.cache.get(key);

        // Fresh cache hit
        if (cached && now < cached.staleAt) {
            return cached.data as T;
        }

        // Stale but not expired - return stale data and refresh in background
        if (cached && now < cached.expiresAt) {
            this.refreshInBackground(key, fetcher, options);
            return cached.data as T;
        }

        // Expired or no cache - fetch fresh data
        const freshData = await fetcher();
        this.set(key, freshData, staleTime, maxAge);
        return freshData;
    }

    /**
     * Manually set cache entry
     */
    set<T>(key: string, data: T, staleTime = DEFAULT_STALE_TIME, maxAge = DEFAULT_MAX_AGE): void {
        const now = Date.now();
        this.cache.set(key, {
            data,
            timestamp: now,
            staleAt: now + staleTime,
            expiresAt: now + maxAge
        });
    }

    /**
     * Invalidate cache entry
     */
    invalidate(key: string): void {
        this.cache.delete(key);
        this.pendingRefreshes.delete(key);
    }

    /**
     * Invalidate all entries matching a pattern
     */
    invalidatePattern(pattern: RegExp): void {
        for (const key of this.cache.keys()) {
            if (pattern.test(key)) {
                this.invalidate(key);
            }
        }
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
        this.pendingRefreshes.clear();
    }

    /**
     * Get cache statistics
     */
    getStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }

    /**
     * Check if entry exists and is fresh
     */
    isFresh(key: string): boolean {
        const cached = this.cache.get(key);
        return cached ? Date.now() < cached.staleAt : false;
    }

    /**
     * Check if entry exists (even if stale)
     */
    has(key: string): boolean {
        const cached = this.cache.get(key);
        return cached ? Date.now() < cached.expiresAt : false;
    }

    /**
     * Refresh data in background without blocking
     */
    private async refreshInBackground<T>(
        key: string,
        fetcher: () => Promise<T>,
        options: CacheOptions
    ): Promise<void> {
        // Prevent duplicate refresh requests
        if (this.pendingRefreshes.has(key)) {
            return;
        }

        const refreshPromise = fetcher()
            .then(data => {
                this.set(key, data, options.staleTime, options.maxAge);
            })
            .catch(error => {
                console.warn(`Background refresh failed for key "${key}":`, error);
            })
            .finally(() => {
                this.pendingRefreshes.delete(key);
            });

        this.pendingRefreshes.set(key, refreshPromise);
    }
}

// Singleton instance for app-wide caching
export const cvCache = new CacheStrategy();

/**
 * Cache keys for CV-related data
 */
export const CacheKeys = {
    cv: (id: string) => `cv:${id}`,
    cvList: (userId: string) => `cv-list:${userId}`,
    cvAnalysis: (id: string) => `cv-analysis:${id}`,
    templates: () => 'templates',
    userProfile: (userId: string) => `user:${userId}`,
};

export default CacheStrategy;
