
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/apiError';
import config from '../config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.name}: ${err.message}`, { 
    path: req.path,
    method: req.method,
    errorStack: err.stack 
  });
  
  // Check if it's a known API error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      code: err.code
    });
  }
  
  // Handle validation errors (express-validator)
  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Validation Error',
      errors: err.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Default to 500 server error
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: config.isProduction ? 'Internal server error' : err.message,
    code: 'INTERNAL_SERVER_ERROR'
  });
};
