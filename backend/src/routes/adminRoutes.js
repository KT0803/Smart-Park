const express = require('express');
const { getAllUsers, getAnalytics, deleteUser, createLot, getStateRevenue } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');

const router = express.Router();

router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/analytics', protect, authorize('admin', 'manager'), getAnalytics);
router.get('/state-revenue', protect, authorize('admin', 'manager'), getStateRevenue);
router.post('/lots', protect, authorize('admin', 'manager'), createLot);

// Admin routes
module.exports = router;
