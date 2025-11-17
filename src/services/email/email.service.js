const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS
  }
});

const sendAccessEmail = async ({ patientEmail, doctorName, approveUrl, denyUrl, profileUrl }) => {
  const html = `
    <h3>Doctor Access Request</h3>
    <p>Dr. ${doctorName} wants to access your medical records.</p>
    <p><a href="${profileUrl}">Verify Doctor Identity</a></p>
    <p>
      <a href="${approveUrl}">Approve Access</a> | 
      <a href="${denyUrl}">Deny</a>
    </p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: patientEmail,
    subject: 'Doctor Access Request - MediAssist',
    html
  });
};

const sendOTPEmail = async ({ patientEmail, otp, doctorName }) => {
  const html = `
    <h3>OTP for Doctor Access</h3>
    <p>Doctor: ${doctorName} wants access to your medical profile.</p>
    <p>Your OTP: <b>${otp}</b></p>
    <p>This OTP expires in 5 minutes.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: patientEmail,
    subject: 'MediAssist OTP Verification',
    html
  });
};


module.exports = {
  sendAccessEmail,
  sendOTPEmail
};
