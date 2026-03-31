const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    state: { type: String, trim: true, index: true },
    totalSlots: { type: Number, required: true, min: 1 },
    availableSlots: { type: Number, required: true, min: 0 },
    pricePerHour: { type: Number, required: true, min: 0 },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

parkingLotSchema.index({ location: 1 });
parkingLotSchema.index({ availableSlots: 1 });

// Performance: indexes on location and availableSlots
// ParkingLot model
module.exports = mongoose.model('ParkingLot', parkingLotSchema);
