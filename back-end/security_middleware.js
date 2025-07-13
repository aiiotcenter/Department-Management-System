const rateLimit = require('express-rate-limit');

// General rate limiting for API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Maximum 100 requests per IP per window
    message: {
        message: 'Too many requests from this IP, please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Prevent information leakage
    res.removeHeader('X-Powered-By');
    
    next();
};

// Error handling middleware that doesn't leak sensitive information
const errorHandler = (err, req, res, next) => {
    // Log error for internal debugging
    console.error('Error:', err);
    
    // Handle Multer errors (file upload errors)
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            message: 'File too large. Maximum size is 5MB.'
        });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            message: 'Unexpected file upload field.'
        });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation failed',
            errors: err.errors
        });
    }
    
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired'
        });
    }
    
    // Handle database errors without exposing internal details
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            message: 'Duplicate entry. Resource already exists.'
        });
    }
    
    // Default error response - don't expose internal errors
    res.status(500).json({
        message: 'Internal server error'
    });
};

// Request size limiting middleware
const requestSizeLimit = (req, res, next) => {
    const contentLength = req.headers['content-length'];
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    
    if (contentLength && parseInt(contentLength) > maxSize) {
        return res.status(413).json({
            message: 'Request too large'
        });
    }
    
    next();
};

// IP whitelist for admin endpoints (optional - can be configured)
const ipWhitelist = (allowedIPs = []) => {
    return (req, res, next) => {
        if (allowedIPs.length === 0) {
            return next(); // No IP restriction if list is empty
        }
        
        const clientIP = req.ip || req.connection.remoteAddress;
        
        if (allowedIPs.includes(clientIP)) {
            next();
        } else {
            res.status(403).json({
                message: 'Access denied from this IP address'
            });
        }
    };
};

module.exports = {
    apiLimiter,
    securityHeaders,
    errorHandler,
    requestSizeLimit,
    ipWhitelist
}; 