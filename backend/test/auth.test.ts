import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';

beforeAll(async () => {
  // Setup logic if needed
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
  }, 15000);

  it('should reject a password shorter than eight characters', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'short-password@example.com',
      password: 'short'
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
