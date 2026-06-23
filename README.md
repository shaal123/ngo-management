# NGO Volunteer & Donor Management System

A full-stack MERN application that helps NGOs manage their volunteers and donors from a single admin dashboard. Built as a portfolio project to demonstrate authentication, REST API design, MongoDB integration, and a responsive React frontend.

## Live Demo

- Frontend: `https://your-app-name.vercel.app` (update after deployment)
- Backend API: `https://your-app-name.onrender.com` (update after deployment)

> Note: the backend is hosted on Render's free tier, which "sleeps" after inactivity. The first request after a period of inactivity may take 30-50 seconds to respond while the server wakes up.

## Features

- **Admin Authentication** – Secure login using JWT (JSON Web Tokens) and hashed passwords (bcrypt)
- **Volunteer Management** – Add, edit, delete, and view volunteers with skills, contact info, and status
- **Donor Management** – Add, edit, delete, and view donors along with donation amount, date, and payment mode
- **Dashboard Overview** – Live counts of total volunteers, active volunteers, total donors, and total donation amount collected
- **Search** – Real-time search by name/email across both volunteers and donors
- **Protected Routes** – Both frontend (React Router) and backend (Express middleware) routes are protected; only a logged-in admin can access data
- **Responsive UI** – Works smoothly on mobile, tablet, and desktop using Tailwind CSS

## Tech Stack

**Frontend:** React.js (Vite), Tailwind CSS, React Router DOM, Axios, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JSON Web Tokens (JWT), bcrypt.js

**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project Structure

```
ngo-management/
├── backend/
│   ├── config/          # MongoDB connection setup
│   ├── controllers/     # Business logic for each route
│   ├── middleware/      # Auth protection & error handling
│   ├── models/          # Mongoose schemas (Admin, Volunteer, Donor)
│   ├── routes/          # Express route definitions
│   ├── utils/           # One-time admin seed script
│   └── server.js        # App entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI pieces (forms, modal, sidebar, etc.)
    │   ├── context/     # AuthContext for global login state
    │   ├── pages/        # Login, Dashboard, Volunteers, Donors, NotFound
    │   └── services/    # Axios API call functions, grouped by resource
    └── index.html
```

## Getting Started Locally

### Prerequisites

- Node.js (v18 or higher) installed
- A free MongoDB Atlas account (see deployment guide below for setup)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ngo-management.git
cd ngo-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder (copy from `.env.example`):

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
PORT=5000
ADMIN_EMAIL=admin@ngo.com
ADMIN_PASSWORD=Admin@123
CLIENT_URL=http://localhost:5173
```

Seed the one admin account into the database (run this only once):

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder (copy from `.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app will run at `http://localhost:5173`. Log in using the admin email/password you set in the backend `.env` file.

## API Endpoints

| Method | Endpoint                | Description                  | Protected |
|--------|--------------------------|-------------------------------|-----------|
| POST   | /api/auth/login           | Admin login                   | No        |
| GET    | /api/auth/profile          | Get logged-in admin's profile | Yes       |
| GET    | /api/volunteers             | Get all volunteers (supports `?search=`) | Yes |
| POST   | /api/volunteers             | Add a new volunteer           | Yes       |
| GET    | /api/volunteers/:id         | Get a single volunteer        | Yes       |
| PUT    | /api/volunteers/:id         | Update a volunteer            | Yes       |
| DELETE | /api/volunteers/:id         | Delete a volunteer            | Yes       |
| GET    | /api/donors                | Get all donors (supports `?search=`) | Yes |
| POST   | /api/donors                | Add a new donor               | Yes       |
| GET    | /api/donors/:id             | Get a single donor            | Yes       |
| PUT    | /api/donors/:id             | Update a donor                | Yes       |
| DELETE | /api/donors/:id             | Delete a donor                | Yes       |
| GET    | /api/dashboard/stats         | Get summary statistics        | Yes       |

Protected routes require an `Authorization: Bearer <token>` header, where the token is the one returned from the login endpoint.

## Deployment

Full step-by-step deployment instructions (MongoDB Atlas, Render, Vercel) are in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Future Improvements

A few ideas to extend this project further if you want to keep building on it:

- Email notifications when a new donor contributes
- Export volunteer/donor lists to CSV or PDF
- Pagination for large lists
- Role-based access (multiple admin levels)
- Volunteer attendance tracking for events

## Author

Built by [Your Name] as a portfolio project to demonstrate full-stack MERN development skills.
