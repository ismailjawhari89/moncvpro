import crypto from 'crypto';
import { logger } from '../lib/logger';

class EncryptionService {
    private key: Buffer;
    private algorithm = 'aes-256-gcm';

    constructor() {
        const secret = process.env.ENCRYPTION_KEY;
        if (!secret || secret.length < 32) {
            logger.warn('ENCRYPTION_KEY is missing or too short. Using a fallback (NOT SECURE FOR PRODUCTION).');
            // Fallback for dev only to prevent crash, but this should be fixed in env
            const fallback = 'default-insecure-key-must-be-32-chars-long';
            this.key = crypto.scryptSync(fallback, 'salt', 32);
        } else {
            this.key = crypto.scryptSync(secret, 'salt', 32);
        }
    }

    encrypt(plaintext: string): string {
        try {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

            let encrypted = cipher.update(plaintext, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            const authTag = (cipher as any).getAuthTag();
            return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
        } catch (error: any) {
            logger.error('Encryption failed', { error: error.message });
            throw new Error('Encryption failed');
        }
    }

    decrypt(ciphertext: string): string {
        try {
            const parts = ciphertext.split(':');
            if (parts.length !== 3) {
                // Check if it's legacy/plain JSON (not encrypted)
                // This helps with migration of existing data
                try {
                    JSON.parse(ciphertext);
                    return ciphertext;
                } catch {
                    // Not JSON, and not encrypted format
                    throw new Error('Invalid ciphertext format');
                }
            }

            const [iv, authTag, encrypted] = parts;

            const decipher = crypto.createDecipheriv(
                this.algorithm,
                this.key,
                Buffer.from(iv, 'hex')
            );

            (decipher as any).setAuthTag(Buffer.from(authTag, 'hex'));

            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch (error: any) {
            logger.error('Decryption failed', { error: error.message });
            // If decryption fails, it might be unencrypted data or wrong key.
            // Returning original might be safer than crashing if we assume mixed data, 
            // but for security strictness, we should throw. 
            // Here, we try to return original if it looks like JSON? No, strictly return error.
            throw new Error('Decryption failed');
        }
    }
}

export const encryptionService = new EncryptionService();
