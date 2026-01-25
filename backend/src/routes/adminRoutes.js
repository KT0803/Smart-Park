const express = require('express');
const { getAllUsers, approveDriver, getAnalytics, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');

const router = express.Router();

router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/drivers/:id/approve', protect, authorize('admin'), approveDriver);
router.get('/analytics', protect, authorize('admin'), getAnalytics);

module.exports = router;
