const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join('; ');
    return sendError(res, messages, 422);
  }
  next();
};

// Request validation middleware
module.exports = { validate };
// reviewed and cleaned up unused imports
