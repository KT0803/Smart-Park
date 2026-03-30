# Smart Park – Intelligent Parking Management System
<!-- v1.0.0 – Smart Park production release 2026-03-30 -->
<!-- Finalized: deployment instructions and test credentials added -->
<!-- Updated: API reference table added -->
<!-- Updated: setup instructions refined -->

A full-stack parking management system with separate dashboards for **users**, **drivers**, **managers**, and **admins**.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas)

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 JWT Auth | Secure login with access + refresh tokens |
| 🅿️ Lot Management | Create and manage parking lots with slot auto-generation |
| 📋 Booking System | Real-time slot booking with conflict prevention |
| 🚗 Valet Assignments | Manager assigns drivers to bookings |
| ⚙️ Admin Controls | User management, driver approvals, system analytics |
| 📱 Responsive UI | Mobile-first dark-mode design |

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (Atlas)
- **Auth**: JWT (access + refresh tokens stored in localStorage)

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env          # Fill in your MONGO_URI and JWT secrets
npm run dev                   # Starts on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env          # Set VITE_API_URL=http://localhost:5000/api
npm run dev                   # Starts on http://localhost:5173
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login + get tokens |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| GET | `/api/auth/me` | Any | Get current user |
| GET | `/api/lots` | Any | List parking lots |
| POST | `/api/lots` | Admin | Create parking lot |
| POST | `/api/bookings` | User | Create booking |
| GET | `/api/bookings/my` | User | Get my bookings |
| PUT | `/api/bookings/:id/cancel` | User | Cancel booking |
| GET | `/api/drivers` | Manager/Admin | List drivers |
| PUT | `/api/drivers/assign/:bookingId` | Manager | Assign driver |
| GET | `/api/admin/analytics` | Admin | System stats |
| PUT | `/api/admin/drivers/:id/approve` | Admin | Approve driver |

---

## Authentication Flow

1. User submits email + password + role on login page
2. Backend validates and returns `token` (15min) + `refreshToken` (7d)
3. Both stored in `localStorage` under `sp_token` / `sp_refresh`
4. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
5. On 401, interceptor auto-calls `/api/auth/refresh` and retries the original request
6. On logout, tokens are cleared and user is redirected to `/login`

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| User | `user@demo.com` | `User@123` |
| Manager | `manager@demo.com` | `Manager@123` |
| Driver | `driver@demo.com` | `Driver@123` |
| Admin | `admin@demo.com` | `Admin@123` |

---

## Deployment

### Backend (Render / Vercel)
1. Set environment variables from `.env.example`
2. Set `NODE_ENV=production`
3. Build command: `npm install` · Start command: `node src/server.js`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Build command: `npm run build` · Publish directory: `dist`

---

## Project Structure

```
Smart-Park/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth, RBAC, validation, errors
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routers
│   │   └── utils/         # JWT helpers, response helpers
│   └── tests/             # Jest + Supertest
└── frontend/
    └── src/
        ├── api/           # Axios service layer
        ├── components/    # Shared UI components
        ├── context/       # AuthContext
        └── pages/         # Role-based dashboard pages
```

---

## License

MIT © 2026 Smart Park
