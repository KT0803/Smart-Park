require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const lotRoutes = require('./routes/lotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const driverRoutes = require('./routes/driverRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lots', lotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler (must be last)
app.use(errorHandler);

// Cleanup: removed console.log debug statements from middleware
// CORS configured for CLIENT_ORIGIN env variable
// Express app export
module.exports = app;
