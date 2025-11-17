const { AuditLog } = require('../audit/audit.model');
const { success, error } = require('../../common/apiResponse');
const { AccessRequest } = require('./access.model');
const { OTPRequest } = require('./otp.model');
const { User } = require("../user/user.model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const requestAccess = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { patientId } = req.body;

    if (!patientId || patientId.trim() === "")
      return res.status(400).json({ success: false, message: "Patient ID required" });

    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const accessReq = await AccessRequest.create({
      doctor: doctorId,
      patient: patientId,
      status: "pending",
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTPRequest.create({
      otp,
      doctor: doctorId,
      patient: patientId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const approvalLink = `http://localhost:4000/api/access/approve/${accessReq._id}`;
    const profileUrl = `http://localhost:4000/api/public/doctors/${doctorId}`;

    await transporter.sendMail({
      from: `"MediAssist" <${process.env.EMAIL_USER}>`,
      to: patient.email,
      subject: "MediAssist Access Authorization",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3498db; text-align: center;">${doctor ? 'Doctor' : 'Chemist'} Access Request</h2>
      <p><strong>${(doctor || chemist).name.first} ${(doctor || chemist).name.last}</strong> is requesting access to your ${doctor ? 'medical records' : 'prescription details'}.</p>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c3e50;">Option 1: Approve via Link</h3>
        <a href="${approvalLink}" 
           style="background:#007bff;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin:10px 0;">
            Approve Access Instantly
        </a>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c3e50;">Option 2: Approve via OTP</h3>
        <p>Provide this code to your ${doctor ? 'doctor' : 'chemist'}:</p>
        <div style="background: white; padding: 15px; border: 2px dashed #3498db; text-align: center; margin: 15px 0;">
          <h2 style="letter-spacing: 8px; color: #2c3e50; margin: 0;">${otp}</h2>
        </div>
        <p style="color: #e74c3c; font-size: 14px;">This OTP expires in 5 minutes.</p>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${profileUrl}" style="color: #3498db; text-decoration: none;">
          Verify ${doctor ? 'Doctor' : 'Chemist'} Identity
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 20px 0;">
      <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
        If you did not expect this request, please ignore this email.
      </p>
    </div>
  `,
    });
    return res.json({
      success: true,
      message: "Access request sent (Both link and OTP sent to patient)",
      requestId: accessReq._id,
    });

  } catch (err) {
    console.error("Access Request Error:", err);
    res.status(500).json({ error: "Request failed" });
  }
};

const approveAccess = async (req, res) => {
  try {
    const { requestId } = req.params;
    const accessReq = await AccessRequest.findById(requestId);

    if (!accessReq) return error(res, 'Invalid request', 404);

    accessReq.status = 'approved';
    accessReq.approvedAt = new Date();
    accessReq.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await accessReq.save();

    return success(res, {}, 'Access approved');
  } catch {
    return error(res, 'Server error', 500);
  }
};

const denyAccess = async (req, res) => {
  try {
    const { requestId } = req.params;
    const accessReq = await AccessRequest.findById(requestId);

    if (!accessReq) return error(res, 'Invalid request', 404);

    accessReq.status = 'denied';
    accessReq.deniedAt = new Date();
    await accessReq.save();

    return success(res, {}, 'Access denied');
  } catch {
    return error(res, 'Server error', 500);
  }
};

module.exports = { requestAccess, approveAccess, denyAccess };