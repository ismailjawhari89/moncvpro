
import { aiQueue } from '../queues/aiQueue';
import { callAIService, trackAICost } from '../services/ai.service';
import { AIJobData } from '../jobs/ai-suggestions.job';
import { notifyUser, emitProgress } from '../websocket/websocket.service';

// Mock Database & Notification
const db = {
    aiSuggestion: {
        create: async (data: any) => {
            console.log('[DB] Saving AI Suggestions:', data);
            return { id: 'sugg-123', ...data };
        }
    },
    user: {
        checkRateLimit: async (cvId: string) => {
            // Mock check
            console.log(`[Rate Limit] Checking limit for ${cvId}`);
            return true; // Allowed
        }
    }
};

const emitToUser = (cvId: string, event: string, payload: any) => {
    console.log(`[WebSocket] Emitting to ${cvId}: ${event}`, payload);
};

console.log('AI Worker started...');

aiQueue.process(2, async (job) => {
    try {
        const { cvId, section } = job.data as AIJobData;
        console.log(`Processing AI request for ${cvId} - Section: ${section}`);

        await job.progress(10);
        emitProgress(cvId, 'ai-suggestions', 10);

        // check rate limit
        const allowed = await db.user.checkRateLimit(cvId);
        if (!allowed) {
            throw new Error('Rate limit exceeded (5 requests/hour)');
        }
        await job.progress(20);
        emitProgress(cvId, 'ai-suggestions', 20);

        // Call AI Service
        const suggestions = await callAIService({
            cvId,
            section,
            prompt: `Improve this ${section} section of a CV...`
        });

        await job.progress(80);
        emitProgress(cvId, 'ai-suggestions', 80);

        // Track Costs
        await trackAICost(cvId, 150); // Mock 150 tokens used

        // Save to Database
        await db.aiSuggestion.create({
            cvId,
            section,
            suggestions,
            createdAt: new Date()
        });

        await job.progress(95);
        emitProgress(cvId, 'ai-suggestions', 95);

        // Notify User
        emitToUser(cvId, 'ai-suggestions-ready', { section, suggestions });
        notifyUser(cvId, 'ai-suggestions-ready', { section, suggestions });

        await job.progress(100);
        emitProgress(cvId, 'ai-suggestions', 100);
        return { success: true, count: suggestions.length };

    } catch (error: any) {
        console.error(`AI Job ${job.id} failed:`, error);
        throw new Error(`AI processing failed: ${error.message}`);
    }
});
