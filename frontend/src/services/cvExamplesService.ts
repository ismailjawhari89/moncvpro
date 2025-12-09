import { CVExample } from '@/types/cv-example';
import { CV_EXAMPLES_DATA } from '@/data/cv-examples-data';

export type { CVExample };

export const cvExamplesService = {
    getAllExamples: async (): Promise<CVExample[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return CV_EXAMPLES_DATA;
    },

    getExampleBySlug: async (slug: string): Promise<CVExample | null> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return CV_EXAMPLES_DATA.find(ex => ex.slug === slug) || null;
    },

    getRelatedExamples: async (currentSlug: string, limit: number = 3): Promise<CVExample[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const current = CV_EXAMPLES_DATA.find(ex => ex.slug === currentSlug);

        if (!current) {
            return CV_EXAMPLES_DATA.slice(0, limit);
        }

        // Filter by same industry first, then random
        const related = CV_EXAMPLES_DATA
            .filter(ex => ex.slug !== currentSlug && ex.industry === current.industry)
            .slice(0, limit);

        if (related.length < limit) {
            const others = CV_EXAMPLES_DATA
                .filter(ex => ex.slug !== currentSlug && ex.industry !== current.industry)
                .slice(0, limit - related.length);
            return [...related, ...others];
        }

        return related;
    },

    getExamplesByIndustry: async (industry: string): Promise<CVExample[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (industry === 'All') return CV_EXAMPLES_DATA;
        return CV_EXAMPLES_DATA.filter(ex => ex.industry === industry);
    }
};
