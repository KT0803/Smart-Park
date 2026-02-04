const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const ParkingLot = require('../models/ParkingLot');
const { sendSuccess, sendError } = require('../utils/response');

// Service: Atomically claim a slot and decrement lot counter
const claimSlot = async (slotId, lotId, bookingId) => {
  const slot = await ParkingSlot.findOneAndUpdate(
    { _id: slotId, status: 'available' },
    { status: 'occupied', currentBookingId: bookingId },
    { new: true }
  );
  if (!slot) return null;

  await ParkingLot.findByIdAndUpdate(lotId, { $inc: { availableSlots: -1 } });
  return slot;
};

// Service: Release a slot and increment lot counter
const releaseSlot = async (slotId, lotId) => {
  await ParkingSlot.findByIdAndUpdate(slotId, { status: 'available', currentBookingId: null });
  await ParkingLot.findByIdAndUpdate(lotId, { $inc: { availableSlots: 1 } });
};

// @desc   Create a booking
// @route  POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { lotId, slotId, vehiclePlate, checkIn } = req.body;

    // Prevent duplicate active booking on same slot
    const existing = await Booking.findOne({ slotId, status: { $in: ['pending', 'active'] } });
    if (existing) return sendError(res, 'Slot already booked', 409);

    // Create booking first (to get id for slot reference)
    const booking = await Booking.create({
      userId: req.user._id, lotId, slotId, vehiclePlate,
      checkIn: checkIn || new Date(), status: 'pending',
    });

    const slot = await claimSlot(slotId, lotId, booking._id);
    if (!slot) {
      await Booking.findByIdAndDelete(booking._id);
      return sendError(res, 'Slot is no longer available', 409);
    }

    booking.status = 'active';
    await booking.save();

    return sendSuccess(res, booking, 'Booking created', 201);
  } catch (err) {
    next(err);
  }
};

// @desc   Get user's bookings
// @route  GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('lotId', 'name location')
      .populate('slotId', 'slotNumber floor')
      .populate('driverId', 'name phone');

    const total = await Booking.countDocuments({ userId: req.user._id });
    return sendSuccess(res, { bookings, total, page });
  } catch (err) {
    next(err);
  }
};

// @desc   Cancel a booking
// @route  PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return sendError(res, 'Booking not found', 404);
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role === 'user') {
      return sendError(res, 'Not authorized', 403);
    }
    if (!['pending', 'active'].includes(booking.status)) {
      return sendError(res, 'Cannot cancel a completed or already cancelled booking', 400);
    }

    booking.status = 'cancelled';
    await booking.save();
    await releaseSlot(booking.slotId, booking.lotId);

    return sendSuccess(res, booking, 'Booking cancelled');
  } catch (err) {
    next(err);
  }
};

// @desc   Complete a booking (checkout)
// @route  PUT /api/bookings/:id/complete
const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('lotId');
    if (!booking) return sendError(res, 'Booking not found', 404);
    if (booking.status !== 'active') return sendError(res, 'Booking is not active', 400);

    booking.checkOut = new Date();
    booking.status = 'completed';
    const hours = Math.max(1, Math.ceil((booking.checkOut - booking.checkIn) / 3600000));
    booking.totalAmount = hours * (booking.lotId.pricePerHour || 0);
    await booking.save();
    await releaseSlot(booking.slotId, booking.lotId._id);

    return sendSuccess(res, booking, 'Booking completed');
  } catch (err) {
    next(err);
  }
};

// @desc   Get all bookings for a lot (manager/admin)
// @route  GET /api/bookings/lot/:lotId
const getLotBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ lotId: req.params.lotId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('slotId', 'slotNumber')
      .populate('driverId', 'name');
    return sendSuccess(res, bookings);
  } catch (err) {
    next(err);
  }
};

// Booking controller
module.exports = { createBooking, getMyBookings, cancelBooking, completeBooking, getLotBookings };
