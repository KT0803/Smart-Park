// Remove duplicate parking lots (same name + location), keeping the oldest.
// A duplicate is only removed if it has no bookings; its slots go with it.
//
//   MONGO_URI="mongodb+srv://..." node scripts/dedupe-lots.js           (preview only)
//   MONGO_URI="mongodb+srv://..." node scripts/dedupe-lots.js --apply   (delete)
require('dotenv').config();
const mongoose = require('mongoose');
const ParkingLot = require('../src/models/ParkingLot');
const ParkingSlot = require('../src/models/ParkingSlot');
const Booking = require('../src/models/Booking');

const apply = process.argv.includes('--apply');

(async () => {
  if (!process.env.MONGO_URI) {
    console.error('Set MONGO_URI first');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

  const lots = await ParkingLot.find().sort({ createdAt: 1 });
  const seen = new Map();
  const dupes = [];
  for (const lot of lots) {
    const key = `${lot.name}|${lot.location}`;
    if (seen.has(key)) dupes.push({ lot, keep: seen.get(key) });
    else seen.set(key, lot);
  }

  console.log(`${lots.length} lots, ${dupes.length} duplicates`);
  let removed = 0;
  for (const { lot, keep } of dupes) {
    const bookings = await Booking.countDocuments({ lotId: lot._id });
    if (bookings > 0) {
      console.log(`SKIP  ${lot.name} (${lot._id}) has ${bookings} booking(s); keeping ${keep._id}`);
      continue;
    }
    console.log(`${apply ? 'DELETE' : 'would delete'}  ${lot.name} (${lot._id})`);
    if (apply) {
      await ParkingSlot.deleteMany({ lotId: lot._id });
      await ParkingLot.deleteOne({ _id: lot._id });
    }
    removed++;
  }

  console.log(apply ? `Removed ${removed} duplicate lots.` : `Preview only. Run with --apply to remove ${removed}.`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
