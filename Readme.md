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

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (Access + Refresh Tokens)
- **Email Service:** Nodemailer (Gmail)
- **Navigation:** OpenRouteService API
- **Security:** CORS, bcrypt, Role-based Access Control

## Authentication

All protected routes require JWT token:



---

## API Routes

### Authentication Routes (`/api/auth`)

| Method | Endpoint   | Description        | Body Parameters                                  |
|--------|------------|------------------|--------------------------------------------------|
| POST   | /register  | User registration | email, password, firstName, lastName, role       |
| POST   | /login     | User login        | email, password                                  |
| POST   | /refresh   | Refresh tokens    | refreshToken                                     |
| POST   | /logout    | User logout       | refreshToken                                     |

---

### Patient Profile (`/api/patients`)

| Method | Endpoint | Description          | Role Required |
|--------|----------|----------------------|---------------|
| GET    | /me      | Get patient profile  | Patient       |

---

### Doctor Profile (`/api/doctors`)

| Method | Endpoint | Description         | Role Required |
|--------|----------|---------------------|---------------|
| GET    | /me      | Get doctor profile  | Doctor        |

---

### Chemist Profile (`/api/chemists`)

| Method | Endpoint | Description         | Role Required |
|--------|----------|---------------------|---------------|
| GET    | /me      | Get chemist profile | Chemist       |

---

### Prescription Routes (`/api/prescriptions`)

| Method | Endpoint     | Description                | Role Required | Body Parameters |
|--------|--------------|--------------------------|---------------|----------------|
| POST   | /            | Create prescription      | Doctor        | patientId, meds[], notes, validUntil |
| GET    | /doctor/me   | Get doctor’s prescriptions | Doctor        | - |
| GET    | /patient/me  | Get patient’s prescriptions | Patient    | - |
| GET    | /            | Get all prescriptions    | Chemist       | - |

**Example Body**
```json
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
```
---

## API Routes

### Authentication Routes (`/api/auth`)

| Method | Endpoint   | Description        | Body Parameters                                  |
|--------|------------|-------------------|--------------------------------------------------|
| POST   | /register  | User registration | email, password, firstName, lastName, role       |
| POST   | /login     | User login        | email, password                                  |
| POST   | /refresh   | Refresh tokens    | refreshToken                                     |
| POST   | /logout    | User logout       | refreshToken                                     |

---

### Patient Profile (`/api/patients`)

| Method | Endpoint | Description          | Role Required |
|--------|----------|----------------------|---------------|
| GET    | /me      | Get patient profile  | Patient       |

---

### Doctor Profile (`/api/doctors`)

| Method | Endpoint | Description         | Role Required |
|--------|----------|---------------------|---------------|
| GET    | /me      | Get doctor profile  | Doctor        |

---

### Chemist Profile (`/api/chemists`)

| Method | Endpoint | Description         | Role Required |
|--------|----------|---------------------|---------------|
| GET    | /me      | Get chemist profile | Chemist       |

---

### Prescription Routes (`/api/prescriptions`)

| Method | Endpoint     | Description                   | Role Required | Body Parameters |
|--------|--------------|------------------------------|---------------|----------------|
| POST   | /            | Create prescription           | Doctor        | patientId, meds[], notes, validUntil |
| GET    | /doctor/me   | Get doctor’s prescriptions    | Doctor        | - |
| GET    | /patient/me  | Get patient’s prescriptions   | Patient       | - |
| GET    | /            | Get all prescriptions         | Chemist       | - |

**Example Body**
```json
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
```

#### Read api docs at route /api-docs
#### Further information contact developer at (`aditghosh5112005@gmail.com`)