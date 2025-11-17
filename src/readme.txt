# MediAssist Backend API

A comprehensive healthcare management system backend that facilitates secure medical data sharing between patients, doctors, and chemists with robust consent mechanisms.

## Features

- Multi-role Authentication (Patient, Doctor, Chemist, Admin)
- Secure Consent-based Access Control
- Prescription Management
- Appointment Scheduling with Navigation
- OTP-based Verification System
- Audit Logging for Compliance
- Location-based Services
- Email Notifications

## Technology Stack

- Framework: Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT (Access + Refresh Tokens)
- Email: Nodemailer with Gmail
- Maps: OpenRouteService API
- Security: CORS, bcrypt, role-based access

## Authentication

All protected routes require JWT token in header:
Authorization: Bearer <access_token>

## API Routes

### Authentication Routes (/api/auth)

| Method | Endpoint | Description | Body Parameters |
|--------|----------|-------------|-----------------|
| POST | /register | User registration | email, password, firstName, lastName, role |
| POST | /login | User login | email, password |
| POST | /refresh | Refresh tokens | refreshToken |
| POST | /logout | User logout | refreshToken |

### Patient Profile (/api/patients)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | /me | Get patient profile | Patient |

### Doctor Profile (/api/doctors)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | /me | Get doctor profile | Doctor |

### Chemist Profile (/api/chemists)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | /me | Get chemist profile | Chemist |

### Prescription Routes (/api/prescriptions)

| Method | Endpoint | Description | Role Required | Body Parameters |
|--------|----------|-------------|---------------|-----------------|
| POST | / | Create prescription | Doctor | patientId, meds[], notes, validUntil |
| GET | /doctor/me | Get doctor's prescriptions | Doctor | - |
| GET | /patient/me | Get patient's prescriptions | Patient | - |
| GET | / | Get all prescriptions | Chemist | - |

Prescription Body Example:
{
  "patientId": "507f1f77bcf86cd799439011",
  "meds": [
    {
      "name": "Paracetamol",
      "strength": "500mg",
      "dose": "1 tablet",
      "frequency": "Every 6 hours",
      "route": "Oral",
      "duration": "5 days",
      "instructions": "Take after meals"
    }
  ],
  "notes": "Complete the course",
  "validUntil": "2024-12-31"
}

### Appointment Routes (/api/appointments)

| Method | Endpoint | Description | Role Required | Body Parameters |
|--------|----------|-------------|---------------|-----------------|
| POST | / | Create appointment | Patient, Doctor | patientId, doctorId, scheduledAt, durationMinutes, location, notes |
| GET | /me | Get user's appointments | Patient, Doctor | - |
| GET | /me-navigation | Get appointments with navigation | Patient, Doctor | - |

Appointment Body Example:
{
  "patientId": "507f1f77bcf86cd799439011",
  "doctorId": "507f1f77bcf86cd799439012",
  "scheduledAt": "2024-01-15T10:00:00.000Z",
  "durationMinutes": 30,
  "location": {
    "address": "123 Medical Center, Healthcare City",
    "geo": {
      "type": "Point",
      "coordinates": [77.2090, 28.6139]
    }
  },
  "notes": "Regular checkup"
}

### Access Control Routes (/api/access)

| Method | Endpoint | Description | Role Required | Body Parameters |
|--------|----------|-------------|---------------|-----------------|
| POST | /request | Request access to patient data | Doctor, Chemist | patientId |
| GET | /approve/:id | Approve access via link | Public | - |
| POST | /approve/:requestId | Approve access via API | - | - |
| POST | /deny/:requestId | Deny access | - | - |

### OTP Routes (/api/otp)

| Method | Endpoint | Description | Role Required | Body Parameters |
|--------|----------|-------------|---------------|-----------------|
| POST | /send | Send OTP to patient | Doctor, Chemist | patientId |
| POST | /verify | Verify OTP | Doctor, Chemist | otp |

### Public Routes (/api/public)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | /doctors/:id | Get doctor public profile | id (doctor ID) |

## Consent & Access Flow

1. Access Request: Doctor/Chemist sends access request to patient
2. Patient receives email with approval link and OTP
3. Patient can approve via:
   - Email link: /api/access/approve/:id
   - OTP code: Share with healthcare provider
4. Approved access expires in 30 minutes
5. OTP verification creates 15-minute session
6. All access attempts are logged for audit

## Email System

Email Types:
- Access Requests with approval links and OTP codes
- Identity Verification links
- OTP Notifications

## Getting Started

Prerequisites:
- Node.js (v14 or higher)
- MongoDB
- Gmail account
- OpenRouteService API key

Installation:

1. Clone the repository
git clone <repository-url>
cd mediassist-backend

2. Install dependencies
npm install

3. Create .env file
PORT=4000
MONGODB_URI=mongodb+srv://medi:assist@server.bofjv8u.mongodb.net/?appName=server
JWT_ACCESS_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES=7d
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_app_password
ORS_API_KEY=your_openrouteservice_api_key

4. Start the server
npm run dev  # Development
npm start   # Production

## Example Requests

Create Prescription (Doctor):
curl -X POST http://localhost:4000/api/prescriptions \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "507f1f77bcf86cd799439011",
    "meds": [
      {
        "name": "Paracetamol",
        "strength": "500mg",
        "dose": "1 tablet",
        "frequency": "Every 6 hours",
        "duration": "5 days"
      }
    ],
    "notes": "Take after meals"
  }'

Request Patient Access (Doctor/Chemist):
curl -X POST http://localhost:4000/api/access/request \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "507f1f77bcf86cd799439011"
  }'

## Troubleshooting

Common Issues:

1. MongoDB Connection Error
   - Verify MONGODB_URI in .env
   - Check network connectivity

2. Email Not Sending
   - Verify Gmail app password in EMAIL_PASS
   - Check email configuration

3. JWT Errors
   - Ensure JWT secrets are set
   - Verify token expiration times

4. CORS Errors
   - Check allowed origins in app.js
   - Verify frontend URL is included

## Support

For support, email aditghosh5112005@gmail.com or create an issue in the repository.