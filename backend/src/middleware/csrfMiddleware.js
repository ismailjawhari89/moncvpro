import csrf from 'csurf';

// Use cookie-based CSRF tokens
const csrfProtection = csrf({ 
    cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    }
});

export function getCsrfToken(req, res, next) {
    csrfProtection(req, res, (err) => {
        if (err) {
            console.error('CSRF token generation error:', err);
            return res.status(403).json({ msg: 'CSRF token generation failed' });
        }
        res.json({ csrfToken: req.csrfToken() });
    });
}

export function protectMutations(req, res, next) {
    // GET and HEAD requests don't need CSRF protection
    if (req.method === 'GET' || req.method === 'HEAD') {
        return next();
    }

    // POST/PUT/DELETE/PATCH require CSRF token
    csrfProtection(req, res, (err) => {
        if (err) {
            console.error('CSRF validation error:', err.code);
            return res.status(403).json({ msg: 'CSRF token invalid or missing' });
        }
        next();
    });
}
