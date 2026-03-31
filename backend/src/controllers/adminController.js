const User = require('../models/User');
const Booking = require('../models/Booking');
const ParkingLot = require('../models/ParkingLot');
const ParkingSlot = require('../models/ParkingSlot');
const { sendSuccess, sendError } = require('../utils/response');

// @desc   Get all users
// @route  GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    return sendSuccess(res, users);
  } catch (err) { next(err); }
};

// @desc   Get system analytics overview
// @route  GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalManagers, totalLots, totalBookings, activeBookings, revenueResult] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'manager' }),
      ParkingLot.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'active' }),
      Booking.aggregate([
        { $match: { status: 'completed', totalAmount: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    return sendSuccess(res, { totalUsers, totalManagers, totalLots, totalBookings, activeBookings, totalRevenue });
  } catch (err) { next(err); }
};

// @desc   Delete a user (admin only)
// @route  DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, null, 'User deleted');
  } catch (err) { next(err); }
};

// @desc   Create a parking lot (admin)
// @route  POST /api/admin/lots
const createLot = async (req, res, next) => {
  try {
    const { name, location, address, totalSlots, pricePerHour } = req.body;
    const lot = await ParkingLot.create({
      name, location, address,
      totalSlots: Number(totalSlots),
      availableSlots: Number(totalSlots),
      pricePerHour: Number(pricePerHour),
      managerId: req.user._id,
      isActive: true,
    });

    // Auto-generate slots
    const slotDocs = [];
    for (let i = 1; i <= Number(totalSlots); i++) {
      slotDocs.push({ lotId: lot._id, slotNumber: `S${String(i).padStart(3, '0')}`, status: 'available' });
    }
    await ParkingSlot.insertMany(slotDocs);

    return sendSuccess(res, lot, 'Parking lot created', 201);
  } catch (err) { next(err); }
};

// @desc   Revenue & bookings breakdown by state
// @route  GET /api/admin/state-revenue
const getStateRevenue = async (req, res, next) => {
  try {
    const data = await Booking.aggregate([
      { $match: { status: { $in: ['completed', 'cancelled'] }, totalAmount: { $gt: 0 } } },
      {
        $lookup: {
          from: 'parkinglots',
          localField: 'lotId',
          foreignField: '_id',
          as: 'lot',
        },
      },
      { $unwind: '$lot' },
      {
        $group: {
          _id: '$lot.state',
          revenue:  { $sum: '$totalAmount' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $project: { _id: 0, state: '$_id', revenue: 1, bookings: 1 } },
    ]);
    return sendSuccess(res, data);
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, getAnalytics, deleteUser, createLot, getStateRevenue };
