const express = require('express');
const router = express.Router();
const { User } = require('../user/user.model');

router.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('name role createdAt');
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    return res.json({
      success: true,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        role: doctor.role,
        verified: doctor.isVerified,
        joined: doctor.createdAt
      }
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
