const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, message = 'Server error', statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};

// Response helpers
module.exports = { sendSuccess, sendError };
// services layer documented
// request/response examples added
