import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authMiddleware';
import { validate, registerSchema, loginSchema, refreshSchema } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.get('/me', authenticate, authController.getMe);

export default router;
