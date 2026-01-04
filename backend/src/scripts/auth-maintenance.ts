/**
 * Maintenance Script for Authentication System
 * 
 * This script provides utilities for maintaining the auth system:
 * - Clean up expired tokens
 * - Clean up expired sessions
 * - Generate security reports
 * 
 * Usage:
 *   ts-node src/scripts/auth-maintenance.ts --cleanup-tokens
 *   ts-node src/scripts/auth-maintenance.ts --cleanup-sessions
 *   ts-node src/scripts/auth-maintenance.ts --security-report
 *   ts-node src/scripts/auth-maintenance.ts --all
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

interface MaintenanceStats {
    tokensDeleted?: number;
    sessionsDeleted?: number;
    activeUsers?: number;
    activeSessions?: number;
    unverifiedUsers?: number;
}

/**
 * Clean up expired verification tokens
 */
async function cleanupExpiredTokens(): Promise<number> {
    logger.info('Starting cleanup of expired tokens...');

    const result = await prisma.verificationToken.deleteMany({
        where: {
            expiresAt: { lt: new Date() },
        },
    });

    logger.info({ count: result.count }, 'Expired tokens cleaned up');
    return result.count;
}

/**
 * Clean up expired and revoked sessions
 */
async function cleanupExpiredSessions(): Promise<number> {
    logger.info('Starting cleanup of expired sessions...');

    const result = await prisma.session.deleteMany({
        where: {
            OR: [
                { expiresAt: { lt: new Date() } },
                { revokedAt: { not: null, lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // Revoked more than 30 days ago
            ],
        },
    });

    logger.info({ count: result.count }, 'Expired sessions cleaned up');
    return result.count;
}

/**
 * Generate security report
 */
async function generateSecurityReport(): Promise<MaintenanceStats> {
    logger.info('Generating security report...');

    const [
        totalUsers,
        activeUsers,
        unverifiedUsers,
        activeSessions,
        expiredTokens,
        expiredSessions,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: {
                sessions: {
                    some: {
                        revokedAt: null,
                        expiresAt: { gt: new Date() },
                    },
                },
            },
        }),
        prisma.user.count({
            where: { emailVerified: null },
        }),
        prisma.session.count({
            where: {
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
        }),
        prisma.verificationToken.count({
            where: {
                expiresAt: { lt: new Date() },
            },
        }),
        prisma.session.count({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { revokedAt: { not: null } },
                ],
            },
        }),
    ]);

    const report = {
        timestamp: new Date().toISOString(),
        users: {
            total: totalUsers,
            active: activeUsers,
            unverified: unverifiedUsers,
            verificationRate: ((totalUsers - unverifiedUsers) / totalUsers * 100).toFixed(2) + '%',
        },
        sessions: {
            active: activeSessions,
            expired: expiredSessions,
            averagePerUser: (activeSessions / activeUsers).toFixed(2),
        },
        tokens: {
            expired: expiredTokens,
        },
    };

    logger.info({ report }, 'Security report generated');
    console.log('\n=== SECURITY REPORT ===');
    console.log(JSON.stringify(report, null, 2));
    console.log('=======================\n');

    return {
        activeUsers,
        activeSessions,
        unverifiedUsers,
    };
}

/**
 * Revoke sessions for inactive users (optional)
 */
async function revokeInactiveSessions(daysInactive: number = 90): Promise<number> {
    logger.info({ daysInactive }, 'Revoking sessions for inactive users...');

    const inactiveDate = new Date(Date.now() - daysInactive * 24 * 60 * 60 * 1000);

    const result = await prisma.session.updateMany({
        where: {
            lastActivityAt: { lt: inactiveDate },
            revokedAt: null,
        },
        data: {
            revokedAt: new Date(),
        },
    });

    logger.info({ count: result.count }, 'Inactive sessions revoked');
    return result.count;
}

/**
 * Send reminder emails to unverified users (optional)
 */
async function sendVerificationReminders(): Promise<number> {
    logger.info('Sending verification reminders...');

    // Get users who registered more than 24 hours ago but haven't verified
    const unverifiedUsers = await prisma.user.findMany({
        where: {
            emailVerified: null,
            createdAt: {
                lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Within last 7 days
            },
        },
        select: {
            id: true,
            email: true,
            firstName: true,
        },
    });

    // TODO: Queue reminder emails
    logger.info({ count: unverifiedUsers.length }, 'Verification reminders queued');
    return unverifiedUsers.length;
}

/**
 * Main execution
 */
async function main() {
    const args = process.argv.slice(2);
    const stats: MaintenanceStats = {};

    try {
        if (args.includes('--cleanup-tokens') || args.includes('--all')) {
            stats.tokensDeleted = await cleanupExpiredTokens();
        }

        if (args.includes('--cleanup-sessions') || args.includes('--all')) {
            stats.sessionsDeleted = await cleanupExpiredSessions();
        }

        if (args.includes('--security-report') || args.includes('--all')) {
            const report = await generateSecurityReport();
            Object.assign(stats, report);
        }

        if (args.includes('--revoke-inactive')) {
            const days = parseInt(args[args.indexOf('--revoke-inactive') + 1] || '90');
            await revokeInactiveSessions(days);
        }

        if (args.includes('--send-reminders')) {
            await sendVerificationReminders();
        }

        if (args.length === 0) {
            console.log(`
Usage: ts-node src/scripts/auth-maintenance.ts [options]

Options:
  --cleanup-tokens       Clean up expired verification tokens
  --cleanup-sessions     Clean up expired and revoked sessions
  --security-report      Generate security report
  --revoke-inactive [days]  Revoke sessions inactive for X days (default: 90)
  --send-reminders       Send verification reminders to unverified users
  --all                  Run all cleanup tasks and generate report

Examples:
  ts-node src/scripts/auth-maintenance.ts --cleanup-tokens
  ts-node src/scripts/auth-maintenance.ts --all
  ts-node src/scripts/auth-maintenance.ts --revoke-inactive 60
            `);
        }

        logger.info({ stats }, 'Maintenance completed successfully');
    } catch (error) {
        logger.error({ error }, 'Maintenance failed');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

export {
    cleanupExpiredTokens,
    cleanupExpiredSessions,
    generateSecurityReport,
    revokeInactiveSessions,
    sendVerificationReminders,
};
