
import { emailService } from './email.service';
import { renderEmailTemplate } from './email-templates';
import { logger } from '../lib/logger';

export interface SecurityAlert {
    type:
    | 'BRUTE_FORCE_ATTEMPT'
    | 'ACCOUNT_LOCKED'
    | '2FA_DISABLED'
    | '2FA_ENABLED'
    | 'PASSWORD_CHANGED'
    | 'EMAIL_CHANGED'
    | 'NEW_DEVICE_LOGIN'
    | 'UNUSUAL_LOCATION_LOGIN'
    | 'VERIFICATION_REQUIRED';
    userId: string;
    email: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}

class AlertService {
    private async sendAlert(alert: SecurityAlert) {
        try {
            const templateMap: Record<string, string> = {
                'BRUTE_FORCE_ATTEMPT': 'brute-force-attempt',
                'ACCOUNT_LOCKED': 'account-locked',
                '2FA_DISABLED': '2fa-disabled',
                '2FA_ENABLED': '2fa-enabled',
                'PASSWORD_CHANGED': 'password-changed',
                'EMAIL_CHANGED': 'email-changed',
                'NEW_DEVICE_LOGIN': 'new-device-login',
                'VERIFICATION_REQUIRED': 'verification-required'
            };

            const templateName = templateMap[alert.type];
            if (!templateName) {
                logger.warn(`No email template found for alert type: ${alert.type}`);
                return;
            }

            const { subject, html } = renderEmailTemplate(templateName, {
                ...alert.metadata,
                email: alert.email,
                ipAddress: alert.ipAddress,
                userAgent: alert.userAgent,
                timestamp: new Date().toISOString()
            });

            await emailService.send({
                to: alert.email,
                subject,
                html
            });

            logger.info(`Security alert [${alert.type}] sent to ${alert.email}`);
        } catch (error: any) {
            logger.error(`Failed to send security alert [${alert.type}] to ${alert.email}: ${error.message}`);
            // Don't throw error to avoid breaking auth flow
        }
    }

    async sendBruteForceAlert(userId: string, email: string, ipAddress: string) {
        await this.sendAlert({
            type: 'BRUTE_FORCE_ATTEMPT',
            userId,
            email,
            ipAddress
        });
    }

    async sendAccountLockedAlert(userId: string, email: string, ipAddress: string) {
        await this.sendAlert({
            type: 'ACCOUNT_LOCKED',
            userId,
            email,
            ipAddress
        });
    }

    async send2FADisabledAlert(userId: string, email: string) {
        await this.sendAlert({
            type: '2FA_DISABLED',
            userId,
            email
        });
    }

    async send2FAEnabledAlert(userId: string, email: string) {
        await this.sendAlert({
            type: '2FA_ENABLED',
            userId,
            email
        });
    }

    async sendPasswordChangedAlert(userId: string, email: string, ipAddress: string, userAgent?: string) {
        await this.sendAlert({
            type: 'PASSWORD_CHANGED',
            userId,
            email,
            ipAddress,
            userAgent
        });
    }

    async sendNewDeviceLoginAlert(userId: string, email: string, ipAddress: string, userAgent: string) {
        await this.sendAlert({
            type: 'NEW_DEVICE_LOGIN',
            userId,
            email,
            ipAddress,
            userAgent
        });
    }

    async sendVerificationEmailAlert(userId: string, email: string) {
        await this.sendAlert({
            type: 'VERIFICATION_REQUIRED',
            userId,
            email
        });
    }

    async sendEmailChangedAlert(userId: string, oldEmail: string, newEmail: string, ipAddress?: string) {
        // Alert old email
        await this.sendAlert({
            type: 'EMAIL_CHANGED',
            userId,
            email: oldEmail,
            ipAddress,
            metadata: {
                isOldEmail: true,
                newEmail
            }
        });

        // Alert new email
        await this.sendAlert({
            type: 'EMAIL_CHANGED',
            userId,
            email: newEmail,
            ipAddress,
            metadata: {
                isOldEmail: false,
                oldEmail
            }
        });
    }
}

export const alertService = new AlertService();
