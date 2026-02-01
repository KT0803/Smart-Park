const express = require('express');
const { body } = require('express-validator');
const { getLots, getLotById, createLot, updateLot, deleteLot } = require('../controllers/lotController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/', protect, getLots);
router.get('/:id', protect, getLotById);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('totalSlots').isInt({ min: 1 }).withMessage('Total slots must be a positive integer'),
    body('pricePerHour').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  ],
  validate,
  createLot
);

router.put('/:id', protect, authorize('admin', 'manager'), updateLot);
router.delete('/:id', protect, authorize('admin'), deleteLot);

// Lot routes
module.exports = router;
