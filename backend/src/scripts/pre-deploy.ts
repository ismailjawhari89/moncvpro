import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { logger } from '../lib/logger';
import { datasources } from '../../prisma/prisma.config';

const prisma = new PrismaClient({ datasources });

async function preDeployChecks() {
    console.log('🔍 Running pre-deployment checks...\n');

    let hasErrors = false;

    try {
        // 1. Check database connection
        console.log('📊 Checking database connection...');
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database connection OK\n');
    } catch (error: any) {
        console.error('❌ Database connection failed:', error.message);
        hasErrors = true;
    }

    try {
        // 2. Check Redis connection
        console.log('🔴 Checking Redis connection...');
        const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
        await redis.ping();
        console.log('✅ Redis connection OK\n');
        await redis.quit();
    } catch (error: any) {
        console.error('❌ Redis connection failed:', error.message);
        hasErrors = true;
    }

    try {
        // 3. Verify critical tables exist
        console.log('🗄️  Checking database schema...');
        const tables = await prisma.$queryRaw<any[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

        const criticalTables = ['User', 'Session', 'CV', 'AuditLog'];
        const existingTables = tables.map((t: any) => t.table_name);

        for (const table of criticalTables) {
            if (existingTables.includes(table)) {
                console.log(`  ✅ ${table} table exists`);
            } else {
                console.error(`  ❌ ${table} table missing`);
                hasErrors = true;
            }
        }

        console.log(`\n📋 Total tables found: ${tables.length}\n`);
    } catch (error: any) {
        console.error('❌ Schema check failed:', error.message);
        hasErrors = true;
    }

    try {
        // 4. Check environment variables
        console.log('🔐 Checking environment variables...');
        const requiredEnvVars = [
            'DATABASE_URL',
            'REDIS_URL',
            'ACCESS_TOKEN_SECRET',
            'REFRESH_TOKEN_SECRET',
        ];

        for (const envVar of requiredEnvVars) {
            if (process.env[envVar]) {
                console.log(`  ✅ ${envVar} is set`);
            } else {
                console.error(`  ❌ ${envVar} is missing`);
                hasErrors = true;
            }
        }
        console.log();
    } catch (error: any) {
        console.error('❌ Environment check failed:', error.message);
        hasErrors = true;
    }

    // Final result
    if (hasErrors) {
        console.error('\n❌ Pre-deployment checks FAILED. Please fix the issues above before deploying.\n');
        process.exit(1);
    } else {
        console.log('\n✅ All pre-deployment checks PASSED. Ready to deploy!\n');
        process.exit(0);
    }
}

preDeployChecks().catch((error) => {
    console.error('Fatal error during pre-deploy checks:', error);
    process.exit(1);
});
