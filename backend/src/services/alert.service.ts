import { WebClient } from '@slack/web-api';
import nodemailer from 'nodemailer';
import { logger } from '../lib/logger';

// Initialize Slack Client
const slackToken = process.env.SLACK_BOT_TOKEN;
const slackClient = slackToken ? new WebClient(slackToken) : null;

// Initialize Email Transporter (reuse existing config if possible)
const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

type AlertLevel = 'critical' | 'high' | 'medium' | 'low';

interface AlertOptions {
    title: string;
    message: string;
    level: AlertLevel;
    context?: Record<string, any>;
}

export class AlertService {
    private static instance: AlertService;

    private constructor() { }

    public static getInstance(): AlertService {
        if (!AlertService.instance) {
            AlertService.instance = new AlertService();
        }
        return AlertService.instance;
    }

    async sendAlert(options: AlertOptions): Promise<void> {
        const { title, message, level, context } = options;

        logger.error(`[ALERT][${level.toUpperCase()}] ${title}: ${message}`, context);

        try {
            await Promise.all([
                this.sendSlackAlert(options),
                this.sendEmailAlert(options),
            ]);
        } catch (error) {
            logger.error('Failed to dispatch alerts', { error });
        }
    }

    private async sendSlackAlert(options: AlertOptions): Promise<void> {
        if (!slackClient || !process.env.SLACK_ALERT_CHANNEL) return;

        const colorMap = {
            critical: '#ff0000', // Red
            high: '#ffae00',     // Orange
            medium: '#0044ff',   // Blue
            low: '#cccccc',      // Gray
        };

        try {
            await slackClient.chat.postMessage({
                channel: process.env.SLACK_ALERT_CHANNEL,
                attachments: [{
                    color: colorMap[options.level],
                    title: `[${options.level.toUpperCase()}] ${options.title}`,
                    text: options.message,
                    fields: options.context ? Object.entries(options.context).map(([k, v]) => ({
                        title: k,
                        value: String(v),
                        short: true
                    })) : [],
                    ts: (Date.now() / 1000).toString()
                }]
            });
        } catch (error) {
            logger.error('Slack alert failed', { error });
        }
    }

    private async sendEmailAlert(options: AlertOptions): Promise<void> {
        // Only send emails for High and Critical alerts
        if (!['critical', 'high'].includes(options.level)) return;
        if (!process.env.ALERT_EMAIL_RECIPIENTS) return;

        try {
            await emailTransporter.sendMail({
                from: `"MonCVPro Monitor" <${process.env.SMTP_FROM || 'alerts@moncvpro.com'}>`,
                to: process.env.ALERT_EMAIL_RECIPIENTS,
                subject: `[${options.level.toUpperCase()}] ${options.title}`,
                html: `
                    <h2>${options.title}</h2>
                    <p><strong>Level:</strong> ${options.level.toUpperCase()}</p>
                    <p>${options.message}</p>
                    <pre>${JSON.stringify(options.context || {}, null, 2)}</pre>
                    <p>Time: ${new Date().toISOString()}</p>
                `,
            });
        } catch (error) {
            logger.error('Email alert failed', { error });
        }
    }
}

export const alertService = AlertService.getInstance();
