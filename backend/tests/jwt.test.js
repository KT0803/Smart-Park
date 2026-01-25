const { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } = require('../../src/utils/jwt');

process.env.JWT_SECRET = 'test_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

describe('JWT Utilities', () => {
  const payload = { id: 'user123', role: 'user' };

  it('should generate a valid access token', () => {
    const token = generateToken(payload);
    expect(typeof token).toBe('string');
    const decoded = verifyToken(token);
    expect(decoded.id).toBe('user123');
    expect(decoded.role).toBe('user');
  });

  it('should generate a valid refresh token', () => {
    const token = generateRefreshToken(payload);
    expect(typeof token).toBe('string');
    const decoded = verifyRefreshToken(token);
    expect(decoded.id).toBe('user123');
  });

  it('should throw on invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow();
  });

  it('should throw when verifying access token with refresh secret', () => {
    const token = generateToken(payload);
    expect(() => verifyRefreshToken(token)).toThrow();
  });
});
