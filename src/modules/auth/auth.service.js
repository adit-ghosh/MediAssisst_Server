const bcrypt = require('bcrypt');
const { User, USER_ROLES } = require('../user/user.model');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../../core/jwt');

const SALT_ROUNDS = 10;

const registerUser = async ({ email, password, firstName, lastName, role }) => {
  if (!USER_ROLES.includes(role)) {
    throw new Error('Invalid role');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already in use');
    err.statusCode = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    passwordHash,
    name: { first: firstName, last: lastName },
    role,
    isVerified: false // we can add verification later
  });

  const accessToken = generateAccessToken({ userId: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return { user, accessToken, refreshToken };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const accessToken = generateAccessToken({ userId: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return { user, accessToken, refreshToken };
};

const refreshTokens = async (token) => {
  if (!token) {
    const err = new Error('Refresh token required');
    err.statusCode = 401;
    throw err;
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (e) {
    const err = new Error('Invalid refresh token');
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const exists = user.refreshTokens.some((rt) => rt.token === token);
  if (!exists) {
    const err = new Error('Refresh token not recognized');
    err.statusCode = 401;
    throw err;
  }

  const newAccessToken = generateAccessToken({ userId: user._id, role: user.role });
  const newRefreshToken = generateRefreshToken({ userId: user._id, role: user.role });

  user.refreshTokens.push({ token: newRefreshToken });
  await user.save();

  return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logoutUser = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) return;

  user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
  await user.save();
};

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser
};
