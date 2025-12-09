import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCVStore } from '../useCVStore';

// Mock cvApi
vi.mock('@/lib/api/cvApi', () => ({
    cvApi: {
        saveCV: vi.fn().mockResolvedValue({ success: true, cv: { _id: 'test-id' } }),
        getCV: vi.fn().mockResolvedValue({ data: { personalInfo: { fullName: 'Test' } } }),
        syncCV: vi.fn().mockResolvedValue({
            success: true,
            cv: { data: { personalInfo: { fullName: 'Synced' } } },
            action: 'updated',
            timestamp: new Date()
        })
    }
}));

// Reset store before each test
beforeEach(() => {
    const { result } = renderHook(() => useCVStore());
    act(() => {
        result.current.setCurrentCV({
            personalInfo: { fullName: '', email: '', phone: '', address: '' },
            experiences: [],
            education: [],
            skills: [],
            languages: [],
            summary: '',
            template: 'modern',
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: 1,
                lastAutoSave: new Date().toISOString()
            }
        });
    });
});

describe('CV Store - Basic Operations', () => {
    it('should have initial state', () => {
        const { result } = renderHook(() => useCVStore());

        expect(result.current.currentCV).toBeDefined();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isSyncing).toBe(false);
        expect(result.current.syncStatus).toBe('idle');
    });

    it('should update personal info', async () => {
        const { result } = renderHook(() => useCVStore());

        await act(async () => {
            await result.current.updateCV({
                personalInfo: {
                    fullName: 'John Doe',
                    email: 'john@example.com',
                    phone: '123456789',
                    address: 'Paris, France'
                }
            });
        });

        expect(result.current.currentCV?.personalInfo.fullName).toBe('John Doe');
        expect(result.current.currentCV?.personalInfo.email).toBe('john@example.com');
    });

    it('should set current CV', () => {
        const { result } = renderHook(() => useCVStore());

        const newCV = {
            personalInfo: { fullName: 'Jane Doe', email: 'jane@example.com', phone: '', address: '' },
            experiences: [],
            education: [],
            skills: [],
            languages: [],
            summary: 'A great professional',
            template: 'classic' as const,
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: 1,
                lastAutoSave: new Date().toISOString()
            }
        };

        act(() => {
            result.current.setCurrentCV(newCV);
        });

        expect(result.current.currentCV?.personalInfo.fullName).toBe('Jane Doe');
        expect(result.current.currentCV?.summary).toBe('A great professional');
    });
});

describe('CV Store - History (Undo/Redo)', () => {
    it('should capture history on set', () => {
        const { result } = renderHook(() => useCVStore());

        act(() => {
            result.current.setCurrentCV({
                personalInfo: { fullName: 'First', email: '', phone: '', address: '' },
                experiences: [],
                education: [],
                skills: [],
                languages: [],
                summary: '',
                template: 'modern',
                metadata: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1,
                    lastAutoSave: new Date().toISOString()
                }
            });
        });

        expect(result.current.history.length).toBeGreaterThan(0);
    });

    it('should undo changes', async () => {
        const { result } = renderHook(() => useCVStore());

        // Set initial state
        act(() => {
            result.current.setCurrentCV({
                personalInfo: { fullName: 'First', email: '', phone: '', address: '' },
                experiences: [],
                education: [],
                skills: [],
                languages: [],
                summary: '',
                template: 'modern',
                metadata: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1,
                    lastAutoSave: new Date().toISOString()
                }
            });
        });

        // Make a change
        await act(async () => {
            await result.current.updateCV({
                personalInfo: { fullName: 'Second', email: '', phone: '', address: '' }
            });
        });

        expect(result.current.currentCV?.personalInfo.fullName).toBe('Second');

        // Undo
        act(() => {
            result.current.undo();
        });

        expect(result.current.currentCV?.personalInfo.fullName).toBe('First');
    });

    it('should redo changes', async () => {
        const { result } = renderHook(() => useCVStore());

        // Set initial state
        act(() => {
            result.current.setCurrentCV({
                personalInfo: { fullName: 'First', email: '', phone: '', address: '' },
                experiences: [],
                education: [],
                skills: [],
                languages: [],
                summary: '',
                template: 'modern',
                metadata: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1,
                    lastAutoSave: new Date().toISOString()
                }
            });
        });

        // Make a change
        await act(async () => {
            await result.current.updateCV({
                personalInfo: { fullName: 'Second', email: '', phone: '', address: '' }
            });
        });

        // Undo
        act(() => {
            result.current.undo();
        });

        // Redo
        act(() => {
            result.current.redo();
        });

        expect(result.current.currentCV?.personalInfo.fullName).toBe('Second');
    });
});

describe('CV Store - Sync Status', () => {
    it('should have correct initial sync status', () => {
        const { result } = renderHook(() => useCVStore());

        expect(result.current.syncStatus).toBe('idle');
        expect(result.current.isSyncing).toBe(false);
        expect(result.current.lastServerSync).toBeNull();
        expect(result.current.lastSyncError).toBeNull();
    });
});
