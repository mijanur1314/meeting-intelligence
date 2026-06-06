import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET || 'secret';

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = decoded;
    next();
  } catch (err) {
    next(new AppError('Invalid token', 401, 'UNAUTHORIZED'));
  }
};
