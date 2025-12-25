import type { CVData } from '@/types/cv';
import { supabase } from '@/lib/supabase';

export async function submitCV(cvData: CVData) {
    // Legacy function, kept for compatibility if needed
    return { success: true };
}

export async function saveCV(content: CVData, id?: string) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User must be logged in to save');
    }

    const res = await fetch('/api/cv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ content, id }),
    });

    if (!res.ok) {
        throw new Error('Failed to save CV');
    }

    return await res.json();
}

export async function loadCVs() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User must be logged in to load CVs');
    }

    const res = await fetch('/api/cv', {
        headers: {
            'Authorization': `Bearer ${session.access_token}`
        }
    });

    if (!res.ok) {
        throw new Error('Failed to load CVs');
    }

    return await res.json();
}

export async function generateCVContent(jobTitle: string, currentData: CVData) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://moncvpro-backend.ismailhouwa123.workers.dev';

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobTitle,
                currentData,
                language: 'fr' // Default to French for now, could be dynamic
            }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to generate content');
        }

        return await res.json();
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
}
