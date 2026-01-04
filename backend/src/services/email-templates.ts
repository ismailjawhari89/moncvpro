
import fs from 'fs';
import path from 'path';

/**
 * Super simple template engine for emails
 */
const compileTemplate = (templateName: string, data: any): string => {
    try {
        const filePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
        let html = fs.readFileSync(filePath, 'utf-8');

        // Replace placeholders {{variable}}
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, data[key]);
        });

        return html;
    } catch (error) {
        console.error(`Error loading template ${templateName}:`, error);
        return `<p>${JSON.stringify(data)}</p>`;
    }
};

export const renderEmailTemplate = (template: string, data: any): { subject: string; html: string } => {
    let subject = '';
    let templateName = template;

    switch (template) {
        case 'email-verification':
            subject = 'Verify Your Email - MonCVPro ✉️';
            break;
        case 'password-reset':
            subject = 'Reset Your Password - MonCVPro 🔐';
            break;
        case 'password-changed':
        case 'password-reset-confirmation':
            subject = 'Password Changed Successfully - MonCVPro ✅';
            templateName = 'password-changed';
            break;
        case 'login-alert':
            subject = 'New Login Alert - MonCVPro 🛡️';
            break;
        case 'suspicious-activity':
            subject = 'Urgent: Suspicious Activity Detected - MonCVPro ⚠️';
            break;
        case '2fa-setup':
            subject = '2FA Setup Confirmation - MonCVPro 🛡️';
            break;
        case '2fa-enabled':
            subject = 'Two-Factor Authentication Enabled - MonCVPro 🛡️';
            break;
        case '2fa-disabled':
            subject = 'Warning: Two-Factor Authentication Disabled - MonCVPro ⚠️';
            break;
        case 'brute-force-attempt':
            subject = 'Security Alert: Multiple Failed Login Attempts - MonCVPro 🛡️';
            break;
        case 'account-locked':
            subject = 'Security Notice: Your Account has been Locked - MonCVPro 🔐';
            break;
        case 'email-changed':
            subject = 'Security Alert: Email Address Changed - MonCVPro 📧';
            break;
        case 'new-device-login':
            subject = 'Security Notice: New Device Login - MonCVPro 📱';
            break;
        case 'verification-required':
            subject = 'Action Required: Please Verify Your Email - MonCVPro ✉️';
            break;
        case 'oauth-login':
            subject = `Login Confirmation: ${data.provider} - MonCVPro ☁️`;
            break;
        default:
            subject = data.subject || 'Notification from MonCVPro';
            return {
                subject,
                html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">${data.message || 'New notification from MonCVPro'}</div>`
            };
    }

    return {
        subject,
        html: compileTemplate(templateName, data),
    };
};
