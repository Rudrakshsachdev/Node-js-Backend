//This file contains the validation rules for user registration using express-validator

const { body } = require('express-validator');

const registerValidator = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),

    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),

    body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter').matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter').matches(/[0-9]/).withMessage('Password must contain at least one number').matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character'),
]

module.exports = {
    registerValidator
};