const ParkingLot = require('../models/ParkingLot');
const ParkingSlot = require('../models/ParkingSlot');
const { sendSuccess, sendError } = require('../utils/response');

// @desc   Get all active parking lots (paginated)
// @route  GET /api/lots
const getLots = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const lots = await ParkingLot.find({ isActive: true }).skip(skip).limit(limit).populate('managerId', 'name email');
    const total = await ParkingLot.countDocuments({ isActive: true });

    return sendSuccess(res, { lots, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single parking lot with slot availability
// @route  GET /api/lots/:id
const getLotById = async (req, res, next) => {
  try {
    const lot = await ParkingLot.findById(req.params.id).populate('managerId', 'name email');
    if (!lot) return sendError(res, 'Parking lot not found', 404);

    const slots = await ParkingSlot.find({ lotId: lot._id });
    return sendSuccess(res, { lot, slots });
  } catch (err) {
    next(err);
  }
};

// @desc   Create parking lot (admin only)
// @route  POST /api/lots
const createLot = async (req, res, next) => {
  try {
    const { name, location, address, totalSlots, pricePerHour, managerId, coordinates } = req.body;
    const lot = await ParkingLot.create({
      name, location, address, totalSlots, availableSlots: totalSlots, pricePerHour, managerId, coordinates,
    });

    // Auto-create slot documents
    const slotDocs = [];
    for (let i = 1; i <= totalSlots; i++) {
      slotDocs.push({ lotId: lot._id, slotNumber: `S${String(i).padStart(3, '0')}` });
    }
    await ParkingSlot.insertMany(slotDocs);

    return sendSuccess(res, lot, 'Parking lot created', 201);
  } catch (err) {
    next(err);
  }
};

// @desc   Update parking lot (admin/manager)
// @route  PUT /api/lots/:id
const updateLot = async (req, res, next) => {
  try {
    const lot = await ParkingLot.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lot) return sendError(res, 'Parking lot not found', 404);
    return sendSuccess(res, lot, 'Parking lot updated');
  } catch (err) {
    next(err);
  }
};

// @desc   Delete (deactivate) parking lot (admin only)
// @route  DELETE /api/lots/:id
const deleteLot = async (req, res, next) => {
  try {
    const lot = await ParkingLot.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!lot) return sendError(res, 'Parking lot not found', 404);
    return sendSuccess(res, null, 'Parking lot deactivated');
  } catch (err) {
    next(err);
  }
};

// Fixed: slot availability is now queried per lot using lotId filter
// Lot controller exports
module.exports = { getLots, getLotById, createLot, updateLot, deleteLot };
