/**
 * Calculate password strength score (0-100)
 */
export const calculatePasswordStrength = (password: string) => {
    let strength = 0;

    // Length
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;
    if (password.length >= 20) strength += 10;

    // Character variety
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/\d/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 20;

    return Math.min(strength, 100);
};

/**
 * Validate password strength
 * Requirements:
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePassword = (password: string) => {
    const errors: string[] = [];

    // Check length
    if (!password || password.length < 12) {
        errors.push('Password must be at least 12 characters long');
    }

    // Check for uppercase
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    // Check for lowercase
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    // Check for numbers
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    // Check for special characters
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    // Check for common weak passwords
    const commonPasswords = [
        'password123', 'qwerty123', 'admin123', '12345678', 'welcome123', 'moncvpro2024'
    ];

    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
        errors.push('This password is too common. Please choose a more unique password.');
    }

    return {
        isValid: errors.length === 0,
        errors,
        strength: calculatePasswordStrength(password)
    };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string) => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
};

export default { validatePassword, validateEmail, calculatePasswordStrength };
