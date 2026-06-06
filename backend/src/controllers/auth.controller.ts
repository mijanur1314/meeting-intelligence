import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const tokens = await authService.register(email, password);
      
      res.status(201).json({
        traceId: req.traceId,
        success: true,
        data: tokens
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const tokens = await authService.login(email, password);
      
      res.status(200).json({
        traceId: req.traceId,
        success: true,
        data: tokens
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refresh(refreshToken);
      
      res.status(200).json({
        traceId: req.traceId,
        success: true,
        data: tokens
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.userId);
      res.status(200).json({
        traceId: req.traceId,
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  }
}
