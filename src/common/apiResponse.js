const success = (res, data = {}, message = 'OK', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const error = (res, message = 'Something went wrong', statusCode = 500, details) => {
  return res.status(statusCode).json({
    success: false,
    message,
    details
  });
};

module.exports = { success, error };
