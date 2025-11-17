const express = require('express');
const router = express.Router();
const { authenticateJWT, requireRole } = require('../../middlewares/auth.middleware');
const { requestAccess, approveAccess, denyAccess } = require('./access.controller');
const AccessRequest = require("./access.model");

router.get("/approve/:id", async (req, res) => {
  try {
    const accessReq = await AccessRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      },
      { new: true }
    );

    if (!accessReq) {
      return res.status(404).send("<h2>Invalid or expired approval link</h2>");
    }

    res.send(`
      <h2>Access Approved!</h2>
      <p>Your chemist can now access your prescription details securely.</p>
      <p>You may close this page.</p>
    `);
  } catch {
    res.status(500).send("<h2>Server Error</h2>");
  }
});

router.post('/request', authenticateJWT, requireRole(['doctor', 'chemist']), requestAccess);
router.post('/approve/:requestId', approveAccess);
router.post('/deny/:requestId', denyAccess);

module.exports = router;