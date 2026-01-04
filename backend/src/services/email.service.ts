
import nodemailer from 'nodemailer';
import { logger } from '../lib/logger';
import { templateEngine, TemplateContext } from './templateEngine';
import prisma from '../lib/prisma';

export interface EmailPayload {
    to: string;
    subject: string;
    templateName?: string;
    context?: TemplateContext;
    html?: string;
    userId?: string;
}

const isProd = process.env.NODE_ENV === 'production';

const createTransporter = () => {
    if (isProd && process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: process.env.ETHEREAL_USER || 'test@ethereal.email',
                pass: process.env.ETHEREAL_PASS || 'test',
            },
        });
    }
};

const transporter = createTransporter();

export const emailService = {
    sendEmail: async (payload: EmailPayload): Promise<{ messageId: string }> => {
        const { to, subject, templateName, context, html, userId } = payload;

        try {
            let finalHtml = html || '';

            if (templateName && context) {
                finalHtml = await templateEngine.renderTemplate(templateName, context);
            }

            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM || '"MonCVPro" <noreply@moncvpro.com>',
                to,
                subject,
                html: finalHtml,
            });

            logger.info({ messageId: info.messageId, to }, `Email sent: ${subject}`);

            // Track event if userId is provided
            if (userId) {
                await prisma.emailEvent.create({
                    data: {
                        userId,
                        templateId: templateName || 'custom',
                        eventType: 'sent',
                        metadata: { messageId: info.messageId, subject }
                    }
                });
            }

            return { messageId: info.messageId };
        } catch (error: any) {
            logger.error({ error: error.message, to }, `Failed to send email: ${subject}`);
            throw error;
        }
    }
};
