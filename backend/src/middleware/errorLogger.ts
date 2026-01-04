import { Request, Response, NextFunction } from "express";
import Sentry from "../lib/sentry";

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
    const log = (req as any).log || console;

    // Log to Pino
    if ((req as any).log) {
        (req as any).log.error({
            err: {
                message: err.message,
                stack: err.stack,
            },
            requestId: (req as any).requestId,
        });
    } else {
        console.error(err);
    }

    // Capture in Sentry
    Sentry.captureException(err, {
        extra: {
            requestId: (req as any).requestId,
            url: req.originalUrl,
            method: req.method,
        }
    });

    res.status(err.status || 500).json({
        error: "Internal Server Error",
        requestId: (req as any).requestId,
    });
};
