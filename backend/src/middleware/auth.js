const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Not authorized – no token', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return sendError(res, 'User not found', 401);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired', 401);
    }
    return sendError(res, 'Not authorized', 401);
  }
};

// Auth middleware export
module.exports = { protect };
