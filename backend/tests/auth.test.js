const request = require('supertest');
const app = require('../../src/app');

// Mock mongoose so no real DB connection needed in tests
jest.mock('../../src/config/db', () => jest.fn().mockResolvedValue(true));

// Auth route integration tests using Supertest
describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should return 422 when email is missing', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User', password: 'test123', role: 'user',
      });
      expect(res.status).toBe(422);
    });

    it('should return 422 when password is too short', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test', email: 'test@test.com', password: '123', role: 'user',
      });
      expect(res.status).toBe(422);
    });

    it('should return 422 for invalid role', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test', email: 'test@test.com', password: 'test1234', role: 'superuser',
      });
      expect(res.status).toBe(422);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 422 when email is invalid', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'not-an-email', password: 'pass123', role: 'user',
      });
      expect(res.status).toBe(422);
    });

    it('should return 422 when password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'user@test.com', role: 'user',
      });
      expect(res.status).toBe(422);
    });
  });

  describe('GET /health', () => {
    it('should return 200 with status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
