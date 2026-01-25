const express = require('express');
const { getDrivers, assignDriver, getMyAssignments } = require('../controllers/driverController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');

const router = express.Router();

router.get('/', protect, authorize('manager', 'admin'), getDrivers);
router.get('/assignments', protect, authorize('driver'), getMyAssignments);
router.put('/assign/:bookingId', protect, authorize('manager', 'admin'), assignDriver);

module.exports = router;
