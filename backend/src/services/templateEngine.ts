
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger';

export interface TemplateContext {
    userName?: string;
    userEmail?: string;
    actionUrl?: string;
    expiresIn?: string;
    supportUrl?: string;
    unsubscribeUrl?: string;
    [key: string]: any;
}

class TemplateEngine {
    private templatesDir: string;
    private cache: Map<string, HandlebarsTemplateDelegate> = new Map();

    constructor() {
        this.templatesDir = path.join(__dirname, '..', 'templates', 'emails');
        // Ensure directory exists
        if (!fs.existsSync(this.templatesDir)) {
            fs.mkdirSync(this.templatesDir, { recursive: true });
        }
    }

    public async renderTemplate(templateName: string, context: TemplateContext): Promise<string> {
        try {
            let compiled = this.cache.get(templateName);

            if (!compiled) {
                const filePath = path.join(this.templatesDir, `${templateName}.html`);

                if (!fs.existsSync(filePath)) {
                    logger.warn(`Template ${templateName} not found at ${filePath}. Falling back to default.`);
                    return this.renderFallback(context);
                }

                const source = fs.readFileSync(filePath, 'utf-8');
                compiled = handlebars.compile(source);
                this.cache.set(templateName, compiled);
            }

            return compiled(context);
        } catch (error: any) {
            logger.error(`Error rendering template ${templateName}: ${error.message}`);
            return this.renderFallback(context);
        }
    }

    private renderFallback(context: TemplateContext): string {
        return `
            <div style="font-family: sans-serif; padding: 20px;">
                <h1>Notification from MonCVPro</h1>
                <p>Hello ${context.userName || 'there'},</p>
                <p>You have a new notification. Please check your dashboard for details.</p>
                ${context.actionUrl ? `<a href="${context.actionUrl}">Go to Dashboard</a>` : ''}
            </div>
        `;
    }
}

export const templateEngine = new TemplateEngine();
