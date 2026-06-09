import { body, validationResult } from 'express-validator';
import { ValidationError } from './response.js';

/**
 * Validate email
 */
export const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Invalid email format');

/**
 * Validate password
 */
export const validatePassword = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number');

/**
 * Validate name
 */
export const validateName = body('name')
  .trim()
  .isLength({ min: 2, max: 255 })
  .withMessage('Name must be between 2 and 255 characters');

/**
 * Validation error handler middleware
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = {};
    errors.array().forEach((error) => {
      details[error.param] = error.msg;
    });
    throw new ValidationError('Validation failed', details);
  }
  next();
};
