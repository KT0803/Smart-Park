const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema(
  {
    lotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot', required: true },
    slotNumber: { type: String, required: true, trim: true },
    floor: { type: String, default: 'G' },
    type: { type: String, enum: ['regular', 'compact', 'handicapped', 'ev'], default: 'regular' },
    status: { type: String, enum: ['available', 'occupied', 'reserved', 'maintenance'], default: 'available' },
    currentBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  },
  { timestamps: true }
);

parkingSlotSchema.index({ lotId: 1, status: 1 });
parkingSlotSchema.index({ lotId: 1, slotNumber: 1 }, { unique: true });

// Performance: compound indexes on lotId+status and lotId+slotNumber
// ParkingSlot model
module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
