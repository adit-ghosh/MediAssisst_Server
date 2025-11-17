const { success } = require('../../common/apiResponse');
const { User } = require('../user/user.model');
const { PatientProfile } = require('./patient.model');

const getMyPatientProfile = async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).select('-passwordHash -refreshTokens');

  let profile = await PatientProfile.findOne({ user: userId });
  if (!profile) {
    profile = await PatientProfile.create({ user: userId });
  }

  return success(res, { user, profile });
};

module.exports = {
  getMyPatientProfile
};
