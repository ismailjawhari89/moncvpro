/**
 * Template Preferences Hook
 * Synchronizes favorites and recent templates across the app
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

// Storage keys
const FAVORITES_KEY = 'moncvpro_favorite_templates';
const RECENT_KEY = 'moncvpro_recent_templates';
const MAX_RECENT = 10;

// Types
export interface TemplatePreferences {
    favorites: string[];
    recent: string[];
}

// Event for cross-component sync
const SYNC_EVENT = 'templatePreferencesChanged';

/**
 * Hook for managing template preferences (favorites and recent)
 * Automatically syncs across components using custom events
 */
export function useTemplatePreferences() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [recent, setRecent] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadPreferences = () => {
            try {
                const savedFavorites = localStorage.getItem(FAVORITES_KEY);
                const savedRecent = localStorage.getItem(RECENT_KEY);

                if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
                if (savedRecent) setRecent(JSON.parse(savedRecent));
            } catch (error) {
                console.warn('[useTemplatePreferences] Failed to load preferences:', error);
            }
            setIsLoaded(true);
        };

        loadPreferences();

        // Listen for sync events from other components
        const handleSync = () => loadPreferences();
        window.addEventListener(SYNC_EVENT, handleSync);

        return () => window.removeEventListener(SYNC_EVENT, handleSync);
    }, []);

    // Broadcast changes to other components
    const broadcastSync = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event(SYNC_EVENT));
        }
    }, []);

    // Toggle favorite
    const toggleFavorite = useCallback((templateId: string) => {
        setFavorites(prev => {
            const updated = prev.includes(templateId)
                ? prev.filter(id => id !== templateId)
                : [...prev, templateId];

            if (typeof window !== 'undefined') {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
                broadcastSync();
            }

            return updated;
        });
    }, [broadcastSync]);

    // Add to favorites
    const addFavorite = useCallback((templateId: string) => {
        setFavorites(prev => {
            if (prev.includes(templateId)) return prev;
            const updated = [...prev, templateId];

            if (typeof window !== 'undefined') {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
                broadcastSync();
            }

            return updated;
        });
    }, [broadcastSync]);

    // Remove from favorites
    const removeFavorite = useCallback((templateId: string) => {
        setFavorites(prev => {
            const updated = prev.filter(id => id !== templateId);

            if (typeof window !== 'undefined') {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
                broadcastSync();
            }

            return updated;
        });
    }, [broadcastSync]);

    // Check if template is favorite
    const isFavorite = useCallback((templateId: string) => {
        return favorites.includes(templateId);
    }, [favorites]);

    // Add to recent
    const addToRecent = useCallback((templateId: string) => {
        setRecent(prev => {
            // Remove if already exists, then add to front
            const filtered = prev.filter(id => id !== templateId);
            const updated = [templateId, ...filtered].slice(0, MAX_RECENT);

            if (typeof window !== 'undefined') {
                localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
                broadcastSync();
            }

            return updated;
        });
    }, [broadcastSync]);

    // Clear all recent
    const clearRecent = useCallback(() => {
        setRecent([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(RECENT_KEY);
            broadcastSync();
        }
    }, [broadcastSync]);

    // Clear all favorites
    const clearFavorites = useCallback(() => {
        setFavorites([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(FAVORITES_KEY);
            broadcastSync();
        }
    }, [broadcastSync]);

    // Counts
    const favoritesCount = useMemo(() => favorites.length, [favorites]);
    const recentCount = useMemo(() => recent.length, [recent]);

    return {
        // State
        favorites,
        recent,
        isLoaded,
        favoritesCount,
        recentCount,

        // Actions
        toggleFavorite,
        addFavorite,
        removeFavorite,
        isFavorite,
        addToRecent,
        clearRecent,
        clearFavorites
    };
}

/**
 * Hook for getting template by preference (favorites/recent)
 */
export function useFilteredTemplates<T extends { id: string }>(
    templates: T[],
    preferences: TemplatePreferences
) {
    const favoriteTemplates = useMemo(() =>
        templates.filter(t => preferences.favorites.includes(t.id)),
        [templates, preferences.favorites]
    );

    const recentTemplates = useMemo(() => {
        const recentMap = new Map(preferences.recent.map((id, index) => [id, index]));
        return templates
            .filter(t => recentMap.has(t.id))
            .sort((a, b) => recentMap.get(a.id)! - recentMap.get(b.id)!);
    }, [templates, preferences.recent]);

    return {
        favoriteTemplates,
        recentTemplates,
        hasFavorites: favoriteTemplates.length > 0,
        hasRecent: recentTemplates.length > 0
    };
}

export default useTemplatePreferences;
