import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Extend Express Request object to include traceId
declare global {
  namespace Express {
    interface Request {
      traceId: string;
    }
  }
}

export const traceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const traceId = req.headers['x-trace-id'] as string || randomUUID();
  req.traceId = traceId;
  res.setHeader('x-trace-id', traceId);
  next();
};
