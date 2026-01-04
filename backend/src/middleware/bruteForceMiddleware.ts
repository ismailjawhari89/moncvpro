
import { alertService } from '../services/alertService';
import { logger } from '../lib/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In-memory store for tracking attempts per IP + Email
// In a distributed production system, this should be moved to Redis
const bruteForceStore = new Map<string, { attempts: number; lastAttempt: number }>();

const THRESHOLD = parseInt(process.env.BRUTE_FORCE_THRESHOLD || '5');
const WINDOW = parseInt(process.env.BRUTE_FORCE_WINDOW || '900') * 1000; // Default 15 mins
const LOCK_DURATION = 30 * 60 * 1000; // 30 minutes lockout

export const bruteForceHandler = {
    /**
     * Records a failed login attempt and checks for brute force thresholds
     */
    async handleFailedAttempt(email: string, ip: string) {
        const key = `${ip}:${email}`;
        const now = Date.now();

        if (!bruteForceStore.has(key)) {
            bruteForceStore.set(key, { attempts: 1, lastAttempt: now });
        } else {
            const entry = bruteForceStore.get(key)!;
            // If the window has passed, reset the counter
            if (now - entry.lastAttempt > WINDOW) {
                entry.attempts = 1;
            } else {
                entry.attempts++;
            }
            entry.lastAttempt = now;
        }

        const entry = bruteForceStore.get(key)!;

        // Fetch user once to check if we should lock or alert
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, isLocked: true }
        });

        if (!user) return; // Don't track non-existent users for account locking

        // If threshold reached, lock account and send alert
        if (entry.attempts >= THRESHOLD) {
            logger.warn({ email, ip, attempts: entry.attempts }, 'Brute force threshold breached');

            // Send alert on the exactly threshold breach
            if (entry.attempts === THRESHOLD) {
                await alertService.sendBruteForceAlert(user.id, user.email, ip);

                // Perform lockout
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        isLocked: true,
                        lockUntil: new Date(now + LOCK_DURATION)
                    }
                });

                await alertService.sendAccountLockedAlert(user.id, user.email, ip);
                logger.info({ userId: user.id, email: user.email }, 'Account locked due to brute force');
            }
        }
    },

    /**
     * Resets the attempt counter for a successful login
     */
    reset(email: string, ip: string) {
        bruteForceStore.delete(`${ip}:${email}`);
    }
};

/**
 * Express middleware to prevent logins if account is locked
 * Note: This can also be used globally to block IPs if needed
 */
export const bruteForceMiddleware = async (req: any, res: any, next: any) => {
    const { email } = req.body;
    if (!email) return next();

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { isLocked: true, lockUntil: true }
        });

        if (user?.isLocked && user.lockUntil && user.lockUntil > new Date()) {
            return res.status(423).json({
                error: 'Account is temporarily locked due to too many failed attempts. Please try again later or reset your password.',
                lockedUntil: user.lockUntil
            });
        }

        // Auto-unlock if lockUntil has passed
        if (user?.isLocked && user.lockUntil && user.lockUntil <= new Date()) {
            await prisma.user.update({
                where: { email },
                data: { isLocked: false, lockUntil: null }
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};
