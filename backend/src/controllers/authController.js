const User = require('../models/User');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return sendError(res, 'Email already registered', 409);

    const isApproved = role !== 'driver'; // drivers need admin approval
    const user = await User.create({ name, email, password, role, phone, isApproved });

    const token = generateToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

    return sendSuccess(res, { user, token, refreshToken }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendError(res, 'Invalid credentials', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return sendError(res, 'Invalid credentials', 401);

    if (user.role !== role) return sendError(res, 'Role mismatch', 403);
    if (!user.isApproved) return sendError(res, 'Account pending admin approval', 403);

    const token = generateToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

    return sendSuccess(res, { user, token, refreshToken }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token required', 400);

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user) return sendError(res, 'User not found', 401);

    const token = generateToken({ id: user._id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user._id, role: user.role });

    return sendSuccess(res, { token, refreshToken: newRefreshToken }, 'Token refreshed');
  } catch (err) {
    if (err.name === 'TokenExpiredError') return sendError(res, 'Refresh token expired – please login again', 401);
    next(err);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  return sendSuccess(res, req.user, 'User profile fetched');
};

// Refresh endpoint validates refreshToken and issues new token pair
// Auth controller exports
module.exports = { register, login, refresh, getMe };
