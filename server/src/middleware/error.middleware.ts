import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any): AppError => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue?.[field];
  const message = `Duplicate value for '${field}': '${value}'. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Validation failed: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = (): AppError =>
  new AppError('Your token has expired. Please log in again.', 401);

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else {
    error = new AppError(err.message || 'Internal Server Error', 500);
  }

  // Mongoose CastError
  if ((err as any).name === 'CastError') {
    error = handleCastErrorDB(err);
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  // Mongoose validation error
  if ((err as any).name === 'ValidationError') {
    error = handleValidationErrorDB(err);
  }

  // JWT errors
  if ((err as any).name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  if ((err as any).name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 ERROR:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: err.stack,
    });
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
