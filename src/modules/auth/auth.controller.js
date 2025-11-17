const { success, error } = require('../../common/apiResponse');
const {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser
} = require('./auth.service');

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return error(res, 'Missing required fields', 400);
    }

    const { user, accessToken, refreshToken } = await registerUser({
      email,
      password,
      firstName,
      lastName,
      role
    });

    return success(
      res,
      {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        tokens: { accessToken, refreshToken }
      },
      'User registered',
      201
    );
  } catch (err) {
    console.error(err);
    return error(res, err.message || 'Registration failed', err.statusCode || 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return error(res, 'Email and password required', 400);
    }

    const { user, accessToken, refreshToken } = await loginUser({ email, password });

    return success(res, {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    console.error(err);
    return error(res, err.message || 'Login failed', err.statusCode || 500);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    const { user, accessToken, refreshToken: newRt } = await refreshTokens(token);

    return success(res, {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      tokens: { accessToken, refreshToken: newRt }
    });
  } catch (err) {
    console.error(err);
    return error(res, err.message || 'Could not refresh token', err.statusCode || 500);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken || !req.user) {
      return error(res, 'Missing refresh token', 400);
    }

    await logoutUser(req.user.userId, refreshToken);
    return success(res, {}, 'Logged out');
  } catch (err) {
    console.error(err);
    return error(res, err.message || 'Logout failed', err.statusCode || 500);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout
};
