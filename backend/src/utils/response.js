/**
 * Success Response
 */
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

/**
 * Error Response
 */
export const errorResponse = (res, error, statusCode = 500) => {
  const response = {
    success: false,
    error: error.message || 'Internal Server Error',
    code: error.code || 'INTERNAL_ERROR',
  };
  
  if (error.details) {
    response.details = error.details;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Custom Error Class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error
 */
export class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

/**
 * Unauthorized Error
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * Forbidden Error
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}
