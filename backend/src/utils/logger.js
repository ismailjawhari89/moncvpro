import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
    SECURITY: 'SECURITY',
};

const LOG_COLORS = {
    ERROR: '\x1b[31m',
    WARN: '\x1b[33m',
    INFO: '\x1b[36m',
    DEBUG: '\x1b[35m',
    SECURITY: '\x1b[91m',
    RESET: '\x1b[0m',
};

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../../logs');
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            try {
                fs.mkdirSync(this.logDir, { recursive: true });
            } catch (error) {
                console.error('Failed to create log directory:', error);
            }
        }
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
        
        return {
            timestamp,
            level,
            message,
            meta,
            formatted: `[${timestamp}] [${level}] ${message} ${metaStr}`.trim(),
        };
    }

    writeToFile(level, formatted) {
        if (process.env.NODE_ENV === 'test') return;

        try {
            const date = new Date().toISOString().split('T')[0];
            const filename = `${date}.log`;
            const filepath = path.join(this.logDir, filename);
            
            fs.appendFileSync(filepath, formatted + '\n', 'utf8');

            if (level === LOG_LEVELS.ERROR || level === LOG_LEVELS.SECURITY) {
                const errorFile = path.join(this.logDir, `${date}-errors.log`);
                fs.appendFileSync(errorFile, formatted + '\n', 'utf8');
            }
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    log(level, message, meta = {}) {
        const log = this.formatMessage(level, message, meta);
        
        const color = LOG_COLORS[level] || '';
        const reset = LOG_COLORS.RESET;
        console.log(`${color}${log.formatted}${reset}`);

        this.writeToFile(level, log.formatted);

        return log;
    }

    error(message, error = null, meta = {}) {
        const errorMeta = {
            ...meta,
            ...(error && {
                error: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                },
            }),
        };
        
        return this.log(LOG_LEVELS.ERROR, message, errorMeta);
    }

    warn(message, meta = {}) {
        return this.log(LOG_LEVELS.WARN, message, meta);
    }

    info(message, meta = {}) {
        return this.log(LOG_LEVELS.INFO, message, meta);
    }

    debug(message, meta = {}) {
        if (process.env.NODE_ENV !== 'production') {
            return this.log(LOG_LEVELS.DEBUG, message, meta);
        }
    }

    security(message, meta = {}) {
        return this.log(LOG_LEVELS.SECURITY, message, meta);
    }

    http(req, res, duration) {
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
        const method = req.method;
        const url = req.originalUrl || req.url;
        const statusCode = res.statusCode;
        const userAgent = req.headers['user-agent'] || 'unknown';

        const meta = {
            ip,
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            userAgent,
        };

        let level = LOG_LEVELS.INFO;
        if (statusCode >= 500) {
            level = LOG_LEVELS.ERROR;
        } else if (statusCode >= 400) {
            level = LOG_LEVELS.WARN;
        }

        const message = `${method} ${url} ${statusCode} - ${duration}ms - ${ip}`;
        return this.log(level, message, meta);
    }

    rateLimit(ip, route, retryAfter) {
        return this.security('Rate limit exceeded', {
            ip,
            route,
            retryAfter: `${retryAfter}s`,
            type: 'RATE_LIMIT',
        });
    }

    authFailure(type, email, ip, reason) {
        return this.security(`Authentication failed: ${type}`, {
            email,
            ip,
            reason,
            type: 'AUTH_FAILURE',
        });
    }

    corsViolation(origin, ip) {
        return this.security('CORS violation', {
            origin,
            ip,
            type: 'CORS_VIOLATION',
        });
    }

    suspiciousActivity(type, ip, meta = {}) {
        return this.security(`Suspicious activity detected: ${type}`, {
            ip,
            type: 'SUSPICIOUS_ACTIVITY',
            ...meta,
        });
    }
}

const logger = new Logger();

export default logger;
