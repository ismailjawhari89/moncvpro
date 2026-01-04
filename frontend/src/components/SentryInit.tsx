
'use client';

import * as Sentry from "@sentry/react";
import { useEffect } from "react";

/**
 * Client component to initialize Sentry in a Next.js environment
 */
export default function SentryInit() {
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            environment: process.env.NODE_ENV,
            tracesSampleRate: 0.2,
            // Add standard integrations for browser tracking
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration(),
            ],
            // Session Replay
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
        });
    }, []);

    return null;
}
