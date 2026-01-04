
import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { auditService } from '../services/audit.service';

class UserController {
    async updateEmail(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { newEmail } = req.body;

            if (!newEmail) {
                return res.status(400).json({ error: 'New email is required' });
            }

            await userService.updateEmail(userId, newEmail, req.audit?.ip || req.ip);

            await auditService.logAuditEvent(
                userId,
                'EMAIL_CHANGE_SUCCESS',
                { newEmail },
                req.audit?.ip,
                req.audit?.userAgent
            );

            res.json({ message: 'Email updated successfully. Please verify your new email.' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getSecurityActivity(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const logs = await userService.getSecurityLogs(userId);
            res.json(logs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const userController = new UserController();
