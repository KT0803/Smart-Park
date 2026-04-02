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
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/complete', protect, authorize('manager', 'admin'), completeBooking);

// Booking routes
module.exports = router;

