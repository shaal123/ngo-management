# Backend - NGO Volunteer & Donor Management System

Express.js REST API with JWT authentication and MongoDB (via Mongoose).

## Setup

```bash
npm install
cp .env.example .env   # then fill in your own values
npm run seed            # creates the one admin account (run once)
npm run dev              # starts server with nodemon (auto-restarts on changes)
```

## Folder Structure

- `config/db.js` – MongoDB connection logic
- `models/` – Mongoose schemas: `Admin`, `Volunteer`, `Donor`
- `controllers/` – Functions that handle the actual logic for each route
- `routes/` – Express routers that map URLs to controller functions
- `middleware/authMiddleware.js` – Verifies JWT tokens, protects private routes
- `middleware/errorMiddleware.js` – Centralized error handling
- `utils/seedAdmin.js` – One-time script to create the admin account

## Why this structure?

Splitting routes, controllers, and models keeps each file focused on one job — this is the standard pattern used in real Express projects and is easy to explain in interviews: "routes define the URL, controllers contain the logic, models define the data shape."
