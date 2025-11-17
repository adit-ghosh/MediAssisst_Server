const { OTPRequest } = require('./otp.model');
const { AccessRequest } = require('./access.model');
const { AccessSession } = require('./session.model');
const { AuditLog } = require('../audit/audit.model');
const { User } = require('../user/user.model');
const { sendOTPEmail } = require('../../services/email/email.service');
const { success, error } = require('../../common/apiResponse');
const nodemailer = require("nodemailer");
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { patientId } = req.body;

    const access = await AccessRequest.findOne({
      doctor: doctorId,
      patient: patientId,
      status: "approved",
    });

    if (!access) {
      return res.status(403).json({ message: "Access not approved" });
    }

    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    await OTPRequest.create({
      code: otp,
      doctor: doctorId,
      patient: patientId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // send email to patient
    await transporter.sendMail({
      from: `"MediAssist" <${process.env.EMAIL_USER}>`,
      to: patient.email,
      subject: "Your Medical Access OTP",
      text: `Your OTP is: ${otp} (valid for 5 minutes)`,
    });

    console.log("OTP Email sent:", otp);

    return res.json({
      success: true,
      message: "OTP sent to patient email",
    });

  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ error: "OTP send failed" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { otp } = req.body;

    const otpReq = await OTPRequest.findOne({
      doctor: doctorId,
      otp,
      expiresAt: { $gt: new Date() },
      used: false
    });

    if (!otpReq) return error(res, 'Invalid or expired OTP', 400);

    otpReq.used = true;
    await otpReq.save();

    const session = await AccessSession.create({
      doctor: doctorId,
      patient: otpReq.patient,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      graceExpiresAt: new Date(Date.now() + 17 * 60 * 1000)
    });

    await AccessRequest.findOneAndUpdate(
      { doctor: doctorId, patient: otpReq.patient },
      { status: "approved", approvedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    );

    return success(res, { sessionId: session._id }, 'OTP verified, access approved, session active');

  } catch {
    return error(res, 'OTP verification failed', 500);
  }
};

module.exports = { sendOTP, verifyOTP };
