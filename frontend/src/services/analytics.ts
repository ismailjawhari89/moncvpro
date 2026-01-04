
import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel with safety check for SSR
const MIXPANEL_KEY = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '';

if (typeof window !== 'undefined' && MIXPANEL_KEY) {
    mixpanel.init(MIXPANEL_KEY, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: true,
        persistence: 'localStorage',
    });
}

export const analytics = {
    // User events
    identify: (userId: string, traits: any) => {
        if (typeof window === 'undefined') return;
        mixpanel.identify(userId);
        if (traits) {
            mixpanel.people.set(traits);
        }
    },

    // Page views
    pageView: (page: string) => {
        if (typeof window === 'undefined') return;
        mixpanel.track('Page View', { page });
    },

    // Feature usage
    cvCreated: (template: string) => {
        if (typeof window === 'undefined') return;
        mixpanel.track('CV Created', { template });
    },

    cvExported: (format: string, template: string) => {
        if (typeof window === 'undefined') return;
        mixpanel.track('CV Exported', { format, template });
    },

    aiSuggestionUsed: (section: string) => {
        if (typeof window === 'undefined') return;
        mixpanel.track('AI Suggestion Used', { section });
    },

    sectionCompleted: (section: string) => {
        if (typeof window === 'undefined') return;
        mixpanel.track('Section Completed', { section });
    },

    premiumUpgrade: (plan: string, price: number) => {
        if (typeof window === 'undefined') return;
        mixpanel.track('Premium Upgrade', { plan, price });
    },

    error: (message: string, context: any) => {
        if (typeof window === 'undefined') return;
        mixpanel.track('Error', { message, context });
    }
};
