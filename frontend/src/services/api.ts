import type { CVData } from '@/types/cv';

export async function submitCV(cvData: CVData) {
    // Legacy function, kept for compatibility if needed
    console.log('submitCV called', cvData);
    return { success: true };
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
