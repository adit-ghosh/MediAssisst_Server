const jwt = require('jsonwebtoken');
const { error } = require('../common/apiResponse');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = {
      userId: payload.userId,
      role: payload.role
    };
    next();
  } catch (err) {
    console.error(err);
    return error(res, 'Invalid or expired token', 401);
  }
};

const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, 'Forbidden', 403);
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  requireRole
};
