import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';

const userRepository = new UserRepository();

// Note: Ensure env variables are loaded
export class AuthService {
  async register(email: string, password: string) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 409, 'USER_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ email, password: hashedPassword });
    
    return this.generateTokens(user.id);
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    return this.generateTokens(user.id);
  }

  async refresh(refreshToken: string) {
    try {
      const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      return this.generateTokens(user.id);
    } catch (err) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateTokens(userId: string) {
    const JWT_SECRET = process.env.JWT_SECRET || 'secret';
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}
