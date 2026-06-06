import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      traceId: req.traceId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('HTTP Request Error', {
    traceId: req.traceId,
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack
  });
  next(err);
};
