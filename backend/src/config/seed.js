const User = require('../models/User');
const ParkingLot = require('../models/ParkingLot');
const ParkingSlot = require('../models/ParkingSlot');

const LOTS = [
  // Maharashtra
  { name: 'Central Park Garage',     location: 'Downtown, Mumbai',    address: '12 MG Road, Fort, Mumbai',         state: 'Maharashtra', totalSlots: 25, pricePerHour: 60 },
  { name: 'Airport Terminal P1',      location: 'Andheri, Mumbai',     address: 'CSIA Terminal 1, Andheri East',    state: 'Maharashtra', totalSlots: 40, pricePerHour: 90 },
  { name: 'Mall of Mumbai – B2',      location: 'Bandra, Mumbai',      address: 'LBS Marg, Bandra West',             state: 'Maharashtra', totalSlots: 20, pricePerHour: 40 },
  { name: 'Navi Mumbai Sector 7',     location: 'Vashi, Navi Mumbai',  address: 'Sector 7, Vashi',                  state: 'Maharashtra', totalSlots: 30, pricePerHour: 35 },
  { name: 'BKC Corporate Hub',        location: 'BKC, Mumbai',         address: 'G Block, Bandra Kurla Complex',     state: 'Maharashtra', totalSlots: 50, pricePerHour: 100 },
  { name: 'Pune FC Road Basement',    location: 'FC Road, Pune',       address: '5 Ferguson College Rd, Pune',      state: 'Maharashtra', totalSlots: 18, pricePerHour: 30 },

  // Delhi
  { name: 'Connaught Place P1',       location: 'CP, New Delhi',       address: 'Block A, Connaught Place',         state: 'Delhi', totalSlots: 35, pricePerHour: 70 },
  { name: 'South Extension Basement', location: 'South Ex, Delhi',     address: 'South Extension Part 2',           state: 'Delhi', totalSlots: 28, pricePerHour: 50 },
  { name: 'DLF Saket City Mall',      location: 'Saket, Delhi',        address: 'DLF Place, Saket',                 state: 'Delhi', totalSlots: 60, pricePerHour: 80 },
  { name: 'Janakpuri District Centre', location: 'Janakpuri, Delhi',   address: 'District Centre, Janakpuri',       state: 'Delhi', totalSlots: 22, pricePerHour: 40 },
  { name: 'Rajouri Garden Plaza',     location: 'Rajouri Garden, Delhi', address: 'Rajouri Garden Main Market',     state: 'Delhi', totalSlots: 20, pricePerHour: 45 },
  { name: 'Greater Kailash GK1',      location: 'GK-1, Delhi',         address: 'M-Block Market, GK1',              state: 'Delhi', totalSlots: 15, pricePerHour: 55 },

  // Karnataka
  { name: 'MG Road Basement',         location: 'MG Road, Bangalore',  address: 'Brigade Road Junction, MG Road',  state: 'Karnataka', totalSlots: 40, pricePerHour: 60 },
  { name: 'Whitefield IT Park',       location: 'Whitefield, Bangalore', address: 'EPIP Zone, Whitefield',          state: 'Karnataka', totalSlots: 80, pricePerHour: 50 },
  { name: 'Indiranagar 100ft Road',   location: 'Indiranagar, Bangalore', address: '100 Feet Road, Indiranagar',   state: 'Karnataka', totalSlots: 25, pricePerHour: 45 },
  { name: 'Koramangala 5th Block',    location: 'Koramangala, Bangalore', address: '5th Block, Koramangala',        state: 'Karnataka', totalSlots: 30, pricePerHour: 40 },
  { name: 'Jayanagar Shopping Complex', location: 'Jayanagar, Bangalore', address: '4th Block Shopping Complex',    state: 'Karnataka', totalSlots: 20, pricePerHour: 35 },
  { name: 'Electronic City Phase 2',  location: 'Electronic City, Bangalore', address: 'Phase 2, EPIP Area',       state: 'Karnataka', totalSlots: 60, pricePerHour: 30 },

  // Tamil Nadu
  { name: 'Anna Nagar Tower Park',    location: 'Anna Nagar, Chennai', address: 'Tower Park Rd, Anna Nagar',        state: 'Tamil Nadu', totalSlots: 30, pricePerHour: 40 },
  { name: 'T Nagar Pondy Bazaar',     location: 'T Nagar, Chennai',    address: 'Pondy Bazaar, T Nagar',            state: 'Tamil Nadu', totalSlots: 20, pricePerHour: 50 },
  { name: 'Adyar Bus Stand Parking',  location: 'Adyar, Chennai',      address: 'Adyar Bridge Rd, Adyar',           state: 'Tamil Nadu', totalSlots: 18, pricePerHour: 30 },
  { name: 'Velachery Phoenix Mall',   location: 'Velachery, Chennai',  address: 'Phoenix MarketCity, Velachery',    state: 'Tamil Nadu', totalSlots: 50, pricePerHour: 60 },
  { name: 'OMR IT Corridor',          location: 'OMR, Chennai',        address: 'Old Mahabalipuram Rd, Sholinganallur', state: 'Tamil Nadu', totalSlots: 45, pricePerHour: 35 },
  { name: 'Vadapalani AVM Complex',   location: 'Vadapalani, Chennai', address: 'AVM Avenue, Vadapalani',           state: 'Tamil Nadu', totalSlots: 22, pricePerHour: 40 },

  // Gujarat
  { name: 'GIFT City Parking',        location: 'GIFT City, Gandhinagar', address: 'Block 11, GIFT City',           state: 'Gujarat', totalSlots: 60, pricePerHour: 50 },
  { name: 'SG Highway Premium',       location: 'SG Highway, Ahmedabad', address: 'Sindhu Bhavan Rd, Bodakdev',    state: 'Gujarat', totalSlots: 35, pricePerHour: 45 },
  { name: 'Prahlad Nagar Garden',     location: 'Prahlad Nagar, Ahmedabad', address: 'Judges Bungalow Rd',         state: 'Gujarat', totalSlots: 25, pricePerHour: 40 },
  { name: 'CG Road Central Ahmedabad', location: 'CG Road, Ahmedabad', address: 'Commerce House, CG Road',         state: 'Gujarat', totalSlots: 20, pricePerHour: 55 },
  { name: 'Surat Diamond Bourse',     location: 'Surat, Gujarat',      address: 'Khajod, Surat Diamond Bourse',    state: 'Gujarat', totalSlots: 40, pricePerHour: 35 },
  { name: 'Ring Road Mall Surat',     location: 'Ring Road, Surat',    address: 'VR Surat, Ring Road',              state: 'Gujarat', totalSlots: 30, pricePerHour: 40 },

  // Rajasthan
  { name: 'MI Road Jaipur Central',   location: 'MI Road, Jaipur',     address: 'Mirza Ismail Rd, Jaipur',         state: 'Rajasthan', totalSlots: 28, pricePerHour: 30 },
  { name: 'Pink City Mall',           location: 'Bani Park, Jaipur',   address: 'Pink City Mall, Station Rd',      state: 'Rajasthan', totalSlots: 35, pricePerHour: 40 },
  { name: 'Vaishali Nagar Premium',   location: 'Vaishali Nagar, Jaipur', address: '22 Godam Circle, Vaishali',   state: 'Rajasthan', totalSlots: 20, pricePerHour: 25 },
  { name: 'Mansarovar Mall Park',     location: 'Mansarovar, Jaipur',  address: 'Mansarovar Shopping Centre',       state: 'Rajasthan', totalSlots: 25, pricePerHour: 30 },
  { name: 'C-Scheme Underground',     location: 'C-Scheme, Jaipur',    address: 'Ashoka Marg, C-Scheme',            state: 'Rajasthan', totalSlots: 18, pricePerHour: 35 },
  { name: 'Tonk Road Business Hub',   location: 'Tonk Road, Jaipur',   address: 'Shyam Nagar, Tonk Road',          state: 'Rajasthan', totalSlots: 22, pricePerHour: 28 },
];

const seedDemoData = async () => {
  try {
    const existing = await User.findOne({ email: 'admin@smartpark.in' });
    if (existing) return; // Already seeded

    console.log('🌱 Seeding demo data...');

    // Create all users individually so Mongoose pre-save bcrypt hook fires
    const demoUsers = [
      { name: 'Smart Park User',    email: 'user@smartpark.in',    password: 'User@Smart#2026',    role: 'user',    isApproved: true },
      { name: 'Smart Park Manager', email: 'manager@smartpark.in', password: 'Manager@Smart#2026', role: 'manager', isApproved: true },
      { name: 'Smart Park Admin',   email: 'admin@smartpark.in',   password: 'Admin@Smart#2026',   role: 'admin',   isApproved: true },
    ];
    const users = [];
    for (const u of demoUsers) {
      users.push(await User.create(u));
    }

    const manager = users.find(u => u.role === 'manager');

    // Seed all 36 lots
    for (const lotData of LOTS) {
      const lot = await ParkingLot.create({
        ...lotData,
        availableSlots: lotData.totalSlots,
        managerId: manager._id,
        isActive: true,
      });

      // Create slots
      const slotDocs = [];
      for (let i = 1; i <= lot.totalSlots; i++) {
        slotDocs.push({ lotId: lot._id, slotNumber: `S${String(i).padStart(3, '0')}`, status: 'available' });
      }
      await ParkingSlot.insertMany(slotDocs);
    }

    console.log('✅ Demo data seeded:');
    console.log('   👤 user@smartpark.in / User@Smart#2026');
    console.log('   🏢 manager@smartpark.in / Manager@Smart#2026');
    console.log('   ⚙️  admin@smartpark.in / Admin@Smart#2026');
    console.log(`   🅿️  ${LOTS.length} parking lots across 6 states`);
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seedDemoData;
