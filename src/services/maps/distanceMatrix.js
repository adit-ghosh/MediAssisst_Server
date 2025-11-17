const axios = require('axios');

const getDistanceAndDuration = async (origin, destination) => {
  try {
    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
      console.error('ORS_API_KEY not set in environment');
      return null;
    }

    const url =
      `https://api.openrouteservice.org/v2/directions/driving-car` +
      `?api_key=${apiKey}` +
      `&start=${origin.lng},${origin.lat}` +
      `&end=${destination.lng},${destination.lat}`;

    const res = await axios.get(url);
    const features = res.data.features;

    if (!features || !features.length) {
      console.error('ORS response missing features');
      return null;
    }

    const segment = features[0].properties.segments[0];

    return {
      distance: (segment.distance / 1000).toFixed(2) + ' km',
      duration: Math.round(segment.duration / 60) + ' mins'
    };
  } catch (err) {
    console.error('ORS Error:', err.response?.data || err.message);
    return null;
  }
};

module.exports = { getDistanceAndDuration };
