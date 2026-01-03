#!/usr/bin/env node

import logger from './src/utils/logger.js';
import { 
    ValidationError, 
    AuthenticationError, 
    NotFoundError,
    RateLimitError 
} from './src/utils/errors.js';

console.log('🧪 Testing Unified Logging System\n');
console.log('=' .repeat(60));

console.log('\n📝 Testing Log Levels...\n');

logger.info('Testing INFO level', { test: true, component: 'logger-test' });
logger.warn('Testing WARN level', { warning: 'This is a test warning' });
logger.debug('Testing DEBUG level', { debug: true });
logger.security('Testing SECURITY level', { 
    type: 'TEST',
    ip: '127.0.0.1',
    action: 'test_security_log'
});

console.log('\n🚨 Testing Error Logging...\n');

try {
    throw new Error('Test error');
} catch (error) {
    logger.error('Testing ERROR level', error, {
        context: 'test-script',
        operation: 'error-test'
    });
}

console.log('\n🎯 Testing Custom Errors...\n');

const testErrors = [
    new ValidationError('Invalid email format', [
        { field: 'email', message: 'Must be valid email' }
    ]),
    new AuthenticationError('Invalid credentials'),
    new NotFoundError('User not found'),
    new RateLimitError('Too many requests', 900),
];

testErrors.forEach(error => {
    console.log(`  - ${error.name}: ${error.message} (Status: ${error.statusCode})`);
    logger.warn(`Testing ${error.name}`, {
        error: error.message,
        statusCode: error.statusCode,
        isOperational: error.isOperational
    });
});

console.log('\n🔍 Testing Specialized Logging...\n');

logger.rateLimit('192.168.1.100', 'Auth Login', 900);
logger.authFailure('LOGIN', 'test@example.com', '192.168.1.100', 'Invalid password');
logger.corsViolation('http://malicious-site.com', '192.168.1.200');
logger.suspiciousActivity('BRUTE_FORCE', '192.168.1.300', {
    attempts: 10,
    route: '/api/auth/login'
});

console.log('\n' + '=' .repeat(60));
console.log('\n✅ Logging Test Complete!\n');
console.log('📁 Check the logs directory for output files:');
console.log('   - logs/YYYY-MM-DD.log (all logs)');
console.log('   - logs/YYYY-MM-DD-errors.log (errors and security)\n');
