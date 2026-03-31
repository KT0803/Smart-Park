require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedDemoData = require('./config/seed');

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedDemoData();
  app.listen(PORT, () => {
    console.log(`\n🚀 Smart Park backend running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health\n`);
  });
});
