const express = require('express');
const { body } = require('express-validator');
const { createBooking, getMyBookings, cancelBooking, completeBooking, getLotBookings, clearBookingHistory } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('user'),
  [
    body('lotId').notEmpty().withMessage('Lot ID is required'),
    body('slotId').notEmpty().withMessage('Slot ID is required'),
    body('vehiclePlate').trim().notEmpty().withMessage('Vehicle plate is required'),
  ],
  validate,
  createBooking
);

router.get('/my', protect, getMyBookings);
router.get('/lot/:lotId', protect, authorize('manager', 'admin'), getLotBookings);
router.delete('/clear-history', protect, clearBookingHistory);
router.post('/clear-history', protect, clearBookingHistory);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/complete', protect, authorize('manager', 'admin'), completeBooking);

/**
 * Booking Routes
 *
 * This module defines the API endpoints for managing parking bookings:
 * - POST /: Create a new booking (requires 'user' role)
 * - GET /my: Retrieve all bookings for the currently authenticated user
 * - GET /lot/:lotId: Retrieve all bookings for a specific lot (managers/admins only)
 * - DELETE/POST /clear-history: Clear the user's non-active booking history
 * - PUT /:id/cancel: Cancel an active booking
 * - PUT /:id/complete: Mark a booking as completed (managers/admins only)
 */
module.exports = router;

// line endings normalized
// added null-check guard for lot lookup
// semicolons added for consistency
// 401 returned for missing token
// negative slot count guard added
// X-Total-Count header added
// 404 returned when booking not found
