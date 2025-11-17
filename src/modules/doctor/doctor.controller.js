const { success } = require('../../common/apiResponse');
const { User } = require('../user/user.model');

const getMyDoctorProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-passwordHash -refreshTokens');
  return success(res, { user });
};

module.exports = {
  getMyDoctorProfile
};
