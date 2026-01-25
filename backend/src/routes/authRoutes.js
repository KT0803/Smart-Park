const express = require('express');
const { body } = require('express-validator');
const { register, login, refresh, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['user', 'driver', 'manager', 'admin']).withMessage('Invalid role'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').isIn(['user', 'driver', 'manager', 'admin']).withMessage('Invalid role'),
  ],
  validate,
  login
);

router.post('/refresh', refresh);
router.get('/me', protect, getMe);

module.exports = router;
