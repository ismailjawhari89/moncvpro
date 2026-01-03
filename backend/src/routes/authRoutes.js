import express from 'express';
import { check } from 'express-validator';
import { register, login } from '../controllers/authController.js';
import { protectMutations, getCsrfToken } from '../middleware/csrfMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/auth/csrf-token
// @desc    Get CSRF token for protected requests
// @access  Public
router.get('/csrf-token', getCsrfToken);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
    '/register',
    protectMutations,  // ✅ CSRF protection
    [
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Password must be at least 12 characters'
        ).isLength({ min: 12 }),
    ],
    register
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/login',
    protectMutations,  // ✅ CSRF protection
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    login
);

export default router;
