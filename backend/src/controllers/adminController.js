const User = require('../models/User');
const Booking = require('../models/Booking');
const ParkingLot = require('../models/ParkingLot');
const { sendSuccess, sendError } = require('../utils/response');

// @desc   Get all users
// @route  GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    return sendSuccess(res, users);
  } catch (err) {
    next(err);
  }
};

// @desc   Approve or reject driver
// @route  PUT /api/admin/drivers/:id/approve
const approveDriver = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const driver = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'driver' },
      { isApproved },
      { new: true }
    ).select('-password');
    if (!driver) return sendError(res, 'Driver not found', 404);
    return sendSuccess(res, driver, `Driver ${isApproved ? 'approved' : 'rejected'}`);
  } catch (err) {
    next(err);
  }
};

// @desc   Get system analytics overview
// @route  GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalDrivers, totalLots, totalBookings, activeBookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'driver' }),
      ParkingLot.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'active' }),
    ]);
    return sendSuccess(res, { totalUsers, totalDrivers, totalLots, totalBookings, activeBookings });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete a user (admin only)
// @route  DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, null, 'User deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, approveDriver, getAnalytics, deleteUser };
