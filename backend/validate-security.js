#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔒 Security Implementation Validator\n');
console.log('=' .repeat(60));

let allPassed = true;

const checkFile = (filePath, description) => {
    const fullPath = path.join(__dirname, filePath);
    const exists = fs.existsSync(fullPath);
    console.log(`${exists ? '✅' : '❌'} ${description}`);
    if (!exists) {
        console.log(`   Missing: ${filePath}`);
        allPassed = false;
    }
    return exists;
};

const checkFileContent = (filePath, patterns, description) => {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
        console.log(`❌ ${description} - File not found`);
        allPassed = false;
        return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const allPatternsFound = patterns.every(pattern => {
        const regex = new RegExp(pattern);
        return regex.test(content);
    });
    
    console.log(`${allPatternsFound ? '✅' : '❌'} ${description}`);
    
    if (!allPatternsFound) {
        patterns.forEach(pattern => {
            const regex = new RegExp(pattern);
            if (!regex.test(content)) {
                console.log(`   Missing pattern: ${pattern}`);
            }
        });
        allPassed = false;
    }
    
    return allPatternsFound;
};

console.log('\n📁 Checking Required Files...\n');

checkFile('src/middleware/rateLimitMiddleware.js', 'Rate Limit Middleware');
checkFile('src/middleware/corsMiddleware.js', 'CORS Middleware');
checkFile('src/middleware/securityMiddleware.js', 'Security Middleware');
checkFile('.env.example', 'Environment Template');
checkFile('SECURITY.md', 'Security Documentation');

console.log('\n🔍 Checking Middleware Implementations...\n');

checkFileContent(
    'src/middleware/rateLimitMiddleware.js',
    [
        'RateLimiterMemory',
        'globalRateLimiter',
        'authLoginRateLimiter',
        'authRegisterRateLimiter',
        'uploadRateLimiter',
        'aiGenerateRateLimiter',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'Retry-After',
        'getClientIp',
    ],
    'Rate Limiter has all required features'
);

checkFileContent(
    'src/middleware/corsMiddleware.js',
    [
        'ALLOWED_ORIGINS',
        'credentials.*true',
        'exposedHeaders',
        'X-RateLimit',
    ],
    'CORS has secure configuration'
);

checkFileContent(
    'src/middleware/securityMiddleware.js',
    [
        'helmet',
        'contentSecurityPolicy',
        'hsts',
        'frameguard',
        'express\\.json',
        'express\\.urlencoded',
        'limit',
    ],
    'Security middleware has Helmet and size limits'
);

console.log('\n🔗 Checking Route Integration...\n');

checkFileContent(
    'src/routes/authRoutes.js',
    [
        'authLoginRateLimit',
        'authRegisterRateLimit',
        '/login',
        '/register',
    ],
    'Auth routes have rate limiting'
);

checkFileContent(
    'src/routes/uploadRoutes.js',
    [
        'uploadRateLimit',
    ],
    'Upload route has rate limiting'
);

checkFileContent(
    'src/routes/aiRoutes.js',
    [
        'aiGenerateRateLimit',
    ],
    'AI route has rate limiting'
);

console.log('\n⚙️  Checking Main Application...\n');

checkFileContent(
    'src/index.js',
    [
        'dotenv',
        'corsMiddleware',
        'helmetMiddleware',
        'jsonBodyParser',
        'urlencodedBodyParser',
        'globalRateLimit',
        'securityLogger',
    ],
    'Main app integrates all security middleware'
);

console.log('\n📋 Checking Environment Variables...\n');

checkFileContent(
    '.env.example',
    [
        'RATE_LIMIT_WINDOW_MS',
        'RATE_LIMIT_MAX_REQUESTS',
        'AUTH_LOGIN_ATTEMPTS',
        'AUTH_REGISTER_ATTEMPTS',
        'UPLOAD_REQUESTS_LIMIT',
        'AI_GENERATE_REQUESTS_LIMIT',
        'ALLOWED_ORIGINS',
        'REQUEST_SIZE_LIMIT',
        'NODE_ENV',
        'JWT_SECRET',
    ],
    'Environment template has all variables'
);

console.log('\n📚 Checking Documentation...\n');

checkFile('SECURITY.md', 'Security Documentation');
checkFile('IMPLEMENTATION_SUMMARY.md', 'Implementation Summary');
checkFile('QUICK_REFERENCE.md', 'Quick Reference Guide');
checkFile('../API_SECURITY.md', 'API Security Docs (project root)');
checkFile('../SECURITY_IMPLEMENTATION.md', 'Security Implementation Summary (project root)');

console.log('\n🧪 Checking Middleware Order...\n');

const indexContent = fs.readFileSync(path.join(__dirname, 'src/index.js'), 'utf8');
const middlewareOrder = [
    'securityLogger',
    'corsMiddleware',
    'helmetMiddleware',
    'jsonBodyParser',
    'urlencodedBodyParser',
    'globalRateLimit',
];

let orderCorrect = true;
let lastIndex = -1;

middlewareOrder.forEach((middleware, i) => {
    const pattern = new RegExp(`app\\.use\\(${middleware}\\)`);
    const match = indexContent.match(pattern);
    
    if (!match) {
        console.log(`❌ Middleware "${middleware}" not found in app.use()`);
        orderCorrect = false;
        allPassed = false;
    } else {
        const index = match.index;
        if (index < lastIndex) {
            console.log(`❌ Middleware order incorrect: "${middleware}" appears before previous middleware`);
            orderCorrect = false;
            allPassed = false;
        } else {
            lastIndex = index;
        }
    }
});

if (orderCorrect) {
    console.log('✅ Middleware applied in correct order');
}

console.log('\n' + '='.repeat(60));

if (allPassed) {
    console.log('\n🎉 All Security Features Validated Successfully!\n');
    console.log('Next steps:');
    console.log('  1. Copy .env.example to .env');
    console.log('  2. Configure environment variables');
    console.log('  3. Start the server: npm run dev');
    console.log('  4. Test rate limiting: node test-rate-limit.js');
    console.log('  5. Review SECURITY.md for deployment guide\n');
    process.exit(0);
} else {
    console.log('\n❌ Some security features are missing or incorrect.\n');
    console.log('Please review the errors above and fix them.\n');
    process.exit(1);
}
