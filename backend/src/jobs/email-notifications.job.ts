
export interface EmailJobData {
    to: string;
    template: 'welcome' | 'export-ready' | 'ai-suggestions-ready' | 'payment-confirmation' | 'password-reset' | 'premium-expiry-warning';
    data: any;
}

export const EMAIL_JOB_NAME = 'email-notification';
