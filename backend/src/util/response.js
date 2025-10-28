// utils/response.js
exports.successResponse = (res, message, data = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

exports.errorResponse = (res, message, code = 400, errors = null) => {
  return res.status(code).json({
    success: false,
    message,
    errors
  });
};
