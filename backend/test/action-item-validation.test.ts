import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';

const token = jwt.sign(
  { userId: '00000000-0000-4000-8000-000000000001' },
  process.env.JWT_SECRET || 'secret'
);

describe('Action item validation', () => {
  it('rejects invalid statuses before accessing the database', async () => {
    const response = await request(app)
      .patch('/api/action-items/00000000-0000-4000-8000-000000000002/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'OVERDUE' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects malformed meeting IDs', async () => {
    const response = await request(app)
      .post('/api/action-items')
      .set('Authorization', `Bearer ${token}`)
      .send({ task: 'Prepare notes', meetingId: 'not-a-uuid' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
