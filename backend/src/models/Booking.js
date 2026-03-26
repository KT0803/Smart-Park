const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
    vehiclePlate: { type: String, required: true, trim: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalAmount: { type: Number, default: 0 },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notes: { type: String },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ slotId: 1, status: 1 });
bookingSchema.index({ lotId: 1, checkIn: -1 });

// Performance: indexes on userId+status, slotId+status, lotId+checkIn
// Booking model
module.exports = mongoose.model('Booking', bookingSchema);
