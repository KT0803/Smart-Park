const User = require('../models/User');
const Booking = require('../models/Booking');
const { sendSuccess, sendError } = require('../utils/response');

// @desc   Get all drivers (manager/admin)
// @route  GET /api/drivers
const getDrivers = async (req, res, next) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('-password');
    return sendSuccess(res, drivers);
  } catch (err) {
    next(err);
  }
};

// @desc   Assign driver to booking (manager)
// @route  PUT /api/drivers/assign/:bookingId
const assignDriver = async (req, res, next) => {
  try {
    const { driverId } = req.body;
    const driver = await User.findOne({ _id: driverId, role: 'driver', isApproved: true });
    if (!driver) return sendError(res, 'Driver not found or not approved', 404);

    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { driverId },
      { new: true }
    ).populate('lotId', 'name').populate('slotId', 'slotNumber');

    if (!booking) return sendError(res, 'Booking not found', 404);
    return sendSuccess(res, booking, 'Driver assigned');
  } catch (err) {
    next(err);
  }
};

// @desc   Get assignments for a driver
// @route  GET /api/drivers/assignments
const getMyAssignments = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ driverId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name phone')
      .populate('lotId', 'name location')
      .populate('slotId', 'slotNumber floor');
    return sendSuccess(res, bookings);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDrivers, assignDriver, getMyAssignments };
