const request = require('supertest');
const app = require('../../src/app');
const Booking = require('../../src/models/Booking');
const ParkingSlot = require('../../src/models/ParkingSlot');
const ParkingLot = require('../../src/models/ParkingLot');
const { generateToken } = require('../../src/utils/jwt');

process.env.JWT_SECRET = 'test_secret';

jest.mock('../../src/models/Booking');
jest.mock('../../src/models/ParkingSlot');
jest.mock('../../src/models/ParkingLot');
jest.mock('../../src/models/User');

const mockUserToken = generateToken({ id: 'user1', role: 'user' });

// Booking route validation tests
describe('Booking Routes', () => {
  describe('POST /api/bookings – validation', () => {
    it('should return 422 when lotId is missing', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${mockUserToken}`)
        .send({ slotId: 'slot1', vehiclePlate: 'MH01AB1234' });
      expect(res.status).toBe(422);
    });

    it('should return 422 when vehiclePlate is missing', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${mockUserToken}`)
        .send({ lotId: 'lot1', slotId: 'slot1' });
      expect(res.status).toBe(422);
    });
  });
});
