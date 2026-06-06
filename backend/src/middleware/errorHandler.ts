import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const traceId = req.traceId;

  if (err instanceof ZodError) {
    return res.status(400).json({
      traceId,
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: err.errors
      }
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      traceId,
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const statusCode = err.code === 'P2025' ? 404 : err.code === 'P2002' ? 409 : 400;
    const code = err.code === 'P2025' ? 'NOT_FOUND' : err.code === 'P2002'
      ? 'CONFLICT'
      : 'DATABASE_ERROR';
    return res.status(statusCode).json({
      traceId,
      success: false,
      error: {
        code,
        message: err.code === 'P2002'
          ? 'A record with this value already exists'
          : err.code === 'P2025'
            ? 'Requested record was not found'
            : 'The request could not be completed'
      }
    });
  }

  // Default error
  return res.status(500).json({
    traceId,
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};
