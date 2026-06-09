import logger from '../utils/logger.js';
import { errorResponse, AppError } from '../utils/response.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    return errorResponse(res, err, err.statusCode);
  }

  // Prisma validation error
  if (err.code === 'P2002') {
    return errorResponse(
      res,
      {
        message: `${err.meta?.target?.[0] || 'Field'} already exists`,
        code: 'DUPLICATE_ENTRY',
      },
      409
    );
  }

  // Prisma not found error
  if (err.code === 'P2025') {
    return errorResponse(
      res,
      { message: 'Resource not found', code: 'NOT_FOUND' },
      404
    );
  }

  // Default error response
  errorResponse(
    res,
    {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message,
      code: 'INTERNAL_ERROR',
    },
    500
  );
};

/**
 * Async route wrapper to catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
