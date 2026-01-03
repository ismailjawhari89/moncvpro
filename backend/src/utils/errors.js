export class AppError extends Error {
    constructor(message, statusCode, isOperational = true, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        this.timestamp = new Date().toISOString();
        
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors = null) {
        super(message, 400, true, errors);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401, true);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403, true);
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, true);
        this.name = 'NotFoundError';
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409, true);
        this.name = 'ConflictError';
    }
}

export class RateLimitError extends AppError {
    constructor(message = 'Too many requests', retryAfter = null) {
        super(message, 429, true);
        this.name = 'RateLimitError';
        this.retryAfter = retryAfter;
    }
}

export class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, false);
        this.name = 'InternalServerError';
    }
}

export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed', originalError = null) {
        super(message, 500, false);
        this.name = 'DatabaseError';
        this.originalError = originalError;
    }
}

export class ExternalServiceError extends AppError {
    constructor(service, message = 'External service error') {
        super(message, 502, false);
        this.name = 'ExternalServiceError';
        this.service = service;
    }
}
