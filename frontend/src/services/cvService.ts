// CV Database Service
'use client';

import { supabase } from '@/lib/supabase';
import type { CVData } from '@/types/cv';

export interface SavedCV {
    id: string;
    user_id: string;
    title: string;
    data: CVData;
    template: string;
    version: number;
    created_at: string;
    updated_at: string;
}

export interface CVVersion {
    id: string;
    cv_id: string;
    version: number;
    data: CVData;
    created_at: string;
}

export interface UserAnalytics {
    user_id: string;
    cvs_created: number;
    ai_uses: number;
    exports_count: number;
    most_used_template: string;
    created_at: string;
    updated_at: string;
}

class CVService {
    // Save or update CV
    async saveCV(userId: string, title: string, data: CVData, template: string, cvId?: string): Promise<{ data: SavedCV | null; error: Error | null }> {
        try {
            if (cvId) {
                // Update existing CV
                const { data: existingCV, error: fetchError } = await supabase
                    .from('cvs')
                    .select('version')
                    .eq('id', cvId)
                    .single();

                if (fetchError) throw fetchError;

                const newVersion = (existingCV?.version || 0) + 1;

                // Save version history
                await supabase.from('cv_versions').insert({
                    cv_id: cvId,
                    version: existingCV?.version || 1,
                    data: data,
                });

                // Update CV
                const { data: updatedCV, error } = await supabase
                    .from('cvs')
                    .update({
                        title,
                        data,
                        template,
                        version: newVersion,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', cvId)
                    .select()
                    .single();

                if (error) throw error;
                return { data: updatedCV, error: null };
            } else {
                // Create new CV
                const { data: newCV, error } = await supabase
                    .from('cvs')
                    .insert({
                        user_id: userId,
                        title,
                        data,
                        template,
                        version: 1,
                    })
                    .select()
                    .single();

                if (error) throw error;

                // Update analytics
                await this.incrementAnalytics(userId, 'cvs_created');

                return { data: newCV, error: null };
            }
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    // Get all CVs for user
    async getUserCVs(userId: string): Promise<{ data: SavedCV[] | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('cvs')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    // Get single CV
    async getCV(cvId: string): Promise<{ data: SavedCV | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('cvs')
                .select('*')
                .eq('id', cvId)
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    // Get CV version history
    async getCVVersions(cvId: string): Promise<{ data: CVVersion[] | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('cv_versions')
                .select('*')
                .eq('cv_id', cvId)
                .order('version', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    // Delete CV
    async deleteCV(cvId: string): Promise<{ error: Error | null }> {
        try {
            // Delete versions first
            await supabase.from('cv_versions').delete().eq('cv_id', cvId);

            // Delete CV
            const { error } = await supabase.from('cvs').delete().eq('id', cvId);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    }

    // Analytics
    async getUserAnalytics(userId: string): Promise<{ data: UserAnalytics | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('user_analytics')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            // Create analytics if doesn't exist
            if (!data) {
                const { data: newAnalytics, error: createError } = await supabase
                    .from('user_analytics')
                    .insert({
                        user_id: userId,
                        cvs_created: 0,
                        ai_uses: 0,
                        exports_count: 0,
                        most_used_template: 'modern',
                    })
                    .select()
                    .single();

                if (createError) throw createError;
                return { data: newAnalytics, error: null };
            }

            return { data, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async incrementAnalytics(userId: string, field: 'cvs_created' | 'ai_uses' | 'exports_count'): Promise<void> {
        try {
            // Get current analytics
            const { data: analytics } = await this.getUserAnalytics(userId);

            if (analytics) {
                await supabase
                    .from('user_analytics')
                    .update({
                        [field]: (analytics[field] || 0) + 1,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', userId);
            }
        } catch (error) {
            console.error('Error incrementing analytics:', error);
        }
    }

    async updateMostUsedTemplate(userId: string, template: string): Promise<void> {
        try {
            await supabase
                .from('user_analytics')
                .update({
                    most_used_template: template,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId);
        } catch (error) {
            console.error('Error updating template:', error);
        }
    }

    // Cache for AI responses
    private aiCache = new Map<string, { response: unknown; timestamp: number }>();
    private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    getCachedAIResponse(key: string): unknown | null {
        const cached = this.aiCache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.response;
        }
        this.aiCache.delete(key);
        return null;
    }

    setCachedAIResponse(key: string, response: unknown): void {
        this.aiCache.set(key, { response, timestamp: Date.now() });
    }
}

export const cvService = new CVService();
