
import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import { alertService } from './alertService';

const prisma = new PrismaClient();

export class UserService {
    async updateEmail(userId: string, newEmail: string, ipAddress?: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true }
        });

        if (!user) throw new Error('User not found');
        if (user.email === newEmail) return user;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                email: newEmail,
                emailVerified: null // Require re-verification
            }
        });

        // Send alerts to both old and new emails
        await alertService.sendEmailChangedAlert(userId, user.email, newEmail, ipAddress);

        return updatedUser;
    }

    async getSecurityLogs(userId: string, limit = 20) {
        return prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }
}

export const userService = new UserService();
