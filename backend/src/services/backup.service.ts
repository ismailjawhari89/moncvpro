import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class BackupService {
    private s3Client: S3Client;
    private bucketName: string;

    constructor() {
        this.bucketName = process.env.AWS_BACKUP_BUCKET || 'moncvpro-backups';
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
            }
        });
    }

    async performBackup(): Promise<void> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup-${timestamp}.sql`;
        const filepath = path.join(process.cwd(), 'temp', filename); // Ensure temp dir exists

        try {
            // Ensure temp directory exists
            if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
                fs.mkdirSync(path.join(process.cwd(), 'temp'));
            }

            logger.info('Starting database backup...', { filename });

            // 1. Dump Database
            // Note: pg_dump must be in PATH or specify full path
            const dbUrl = process.env.DATABASE_URL;
            if (!dbUrl) throw new Error('DATABASE_URL is not defined');

            // Be careful with password in command line logging. 
            // Using PGPASSWORD env var is safer but for simplicity using connection string
            // masking it in logs.
            await execAsync(`pg_dump "${dbUrl}" -f "${filepath}"`);

            logger.info('Database dump created locally', { size: fs.statSync(filepath).size });

            // 2. Upload to S3
            const fileContent = fs.readFileSync(filepath);
            await this.s3Client.send(new PutObjectCommand({
                Bucket: this.bucketName,
                Key: `backups/${filename}`,
                Body: fileContent,
                ServerSideEncryption: 'AES256'
            }));

            logger.info('Backup uploaded to S3 successfully');

            // 3. Clean up
            fs.unlinkSync(filepath);
            logger.info('Local backup file cleaned up');

        } catch (error: any) {
            logger.error('Backup failed', { error: error.message });
            // Cleanup on error if file exists
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
            throw error;
        }
    }
}

export const backupService = new BackupService();
