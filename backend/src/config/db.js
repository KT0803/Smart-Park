const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('127.0.0.1')) {
      // ☁️  Production — use MongoDB Atlas
      console.log('☁️  Connecting to MongoDB Atlas...');
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB Atlas connected');
    } else {
      // 🧠 Local dev — use in-memory MongoDB (zero config)
      const { MongoMemoryServer } = require('mongodb-memory-server');
      console.log('🧠 Starting in-memory MongoDB...');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      console.log('✅ In-memory MongoDB connected');
    }
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

