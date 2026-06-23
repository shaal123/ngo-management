# Frontend - NGO Volunteer & Donor Management System

React (Vite) + Tailwind CSS admin dashboard.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev              # starts dev server at localhost:5173
```

## Folder Structure

- `src/components/` - Reusable UI pieces: Sidebar, Navbar, Modal, forms, etc.
- `src/pages/` - Full page components: Login, Dashboard, Volunteers, Donors
- `src/context/AuthContext.jsx` - Manages login state globally using React Context
- `src/services/` - Axios functions grouped by resource (authService, volunteerService, donorService, dashboardService)

## Why this structure?

Keeping API calls inside `services/` (instead of directly inside components) means the UI components stay focused on rendering, and the API logic can be reused or swapped easily. This separation is a common pattern asked about in frontend interviews.
