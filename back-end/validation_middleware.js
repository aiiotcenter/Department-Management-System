const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Login validation rules
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 1 })
        .withMessage('Password is required')
        .isLength({ max: 128 })
        .withMessage('Password is too long'),
    handleValidationErrors
];

// Registration validation rules
const validateRegistration = [
    body('name')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('role')
        .optional()
        .isIn(['student', 'admin', 'professor', 'assistant', 'secretary'])
        .withMessage('Invalid role specified'),
    handleValidationErrors
];

// Password change validation rules
const validatePasswordChange = [
    body('currentPassword')
        .isLength({ min: 1 })
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    handleValidationErrors
];

// Appointment validation rules
const validateAppointment = [
    body('appointment_approver_id')
        .isLength({ min: 1 })
        .withMessage('Appointment approver ID is required'),
    body('visit_purpose')
        .isLength({ min: 5, max: 200 })
        .withMessage('Visit purpose must be between 5 and 200 characters'),
    body('visit_date')
        .isISO8601()
        .withMessage('Please provide a valid date'),
    body('visit_time')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Please provide a valid time in HH:MM format'),
    body('comments')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Comments cannot exceed 500 characters'),
    handleValidationErrors
];

// User management validation rules
const validateUserManagement = [
    body('name')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('role')
        .isIn(['student', 'admin', 'professor', 'assistant', 'secretary'])
        .withMessage('Invalid role specified'),
    handleValidationErrors
];

module.exports = {
    validateLogin,
    validateRegistration,
    validatePasswordChange,
    validateAppointment,
    validateUserManagement,
    handleValidationErrors
}; 