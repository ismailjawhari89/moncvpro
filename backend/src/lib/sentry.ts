import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { Express } from "express";

export const initSentry = (app: Express) => {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        integrations: [
            nodeProfilingIntegration(),
        ],
        // Tracing
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        // Profiling
        profilesSampleRate: 1.0,

        release: process.env.APP_VERSION || '1.0.0',

        beforeSend(event) {
            // Scrub sensitive data if needed, Sentry does a lot automatically
            if (event.request?.url?.includes('private')) {
                return null;
            }
            return event;
        }
    });
};
