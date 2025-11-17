const { success, error } = require('../../common/apiResponse');
const { Appointment } = require('./appointment.model');
const { getDistanceAndDuration } = require('../../services/maps/distanceMatrix');
const { User } = require('../user/user.model');

const getMyAppointmentsWithNavigation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    const filter = role === 'patient'
      ? { patient: userId }
      : { doctor: userId };

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email location')
      .populate('doctor', 'name email location')
      .sort({ scheduledAt: 1 });

    const user = await User.findById(userId);
    const userCoords = user?.location?.coordinates;

    const results = [];

    for (const appt of appointments) {
      const targetCoords = appt.location?.geo?.coordinates;

      if (!targetCoords || !userCoords || userCoords.length < 2) {
        results.push({ appointment: appt, navigation: null, mapsUrl: null });
        continue;
      }

      const origin = {
        lng: userCoords[0],
        lat: userCoords[1]
      };

      const destination = {
        lng: targetCoords[0],
        lat: targetCoords[1]
      };

      const travelData = await getDistanceAndDuration(origin, destination);

      const mapsUrl =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${origin.lat},${origin.lng}` +
        `&destination=${destination.lat},${destination.lng}`;

      results.push({
        appointment: appt,
        navigation: travelData,
        mapsUrl
      });
    }

    return success(res, results);
  } catch (err) {
    console.error(err);
    return error(res, 'Navigation fetch failed', 500);
  }
};

module.exports = { getMyAppointmentsWithNavigation };
