# Deployment Guide

This guide walks you through deploying the full project for free using:
- **MongoDB Atlas** for the database
- **Render** for the backend (Node/Express API)
- **Vercel** for the frontend (React app)

Follow the steps in order — the database needs to exist before the backend can connect to it, and the backend needs to be live before the frontend can call it.

---

## Part 1: MongoDB Atlas (Database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **"Build a Database"** and choose the **free M0 tier**.
3. Pick any cloud provider and the region closest to you, then click **Create**.
4. When prompted to create a database user:
   - Set a username (e.g. `ngo_admin`)
   - Set a password and **save it somewhere safe** — you'll need it for the connection string
5. Under **Network Access**, click **"Add IP Address"** and choose **"Allow Access from Anywhere"** (`0.0.0.0/0`). This is fine for a portfolio project; production apps would restrict this further.
6. Once the cluster is created, click **"Connect"** → **"Drivers"** → select **Node.js**.
7. Copy the connection string. It looks like this:
   ```
   mongodb+srv://ngo_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual database user password, and add your database name before the `?`, like this:
   ```
   mongodb+srv://ngo_admin:yourpassword@cluster0.xxxxx.mongodb.net/ngo-management?retryWrites=true&w=majority
   ```
   This full string is your `MONGO_URI`. Keep it handy — you'll paste it into Render's environment variables in Part 2.

---

## Part 2: Backend Deployment on Render

1. Push your project to a GitHub repository if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/ngo-management.git
   git push -u origin main
   ```
2. Go to [render.com](https://render.com) and sign up (you can sign up with GitHub directly).
3. Click **"New +"** → **"Web Service"**.
4. Connect your GitHub account and select your repository.
5. Configure the service:
   - **Name:** `ngo-management-backend` (or anything you like)
   - **Root Directory:** `backend` (important — this tells Render to only build the backend folder)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
6. Scroll to **Environment Variables** and add the following (same values as your local `backend/.env` file):
   | Key | Value |
   |---|---|
   | MONGO_URI | your MongoDB Atlas connection string from Part 1 |
   | JWT_SECRET | any long random string (e.g. generate one at randomkeygen.com) |
   | ADMIN_EMAIL | the email you want to log in with |
   | ADMIN_PASSWORD | the password you want to log in with |
   | CLIENT_URL | leave this blank for now — you'll fill it in after deploying the frontend in Part 3 |
7. Click **"Create Web Service"**. Render will install dependencies and start your server. This takes a few minutes the first time.
8. Once deployed, Render gives you a URL like:
   ```
   https://ngo-management-backend.onrender.com
   ```
   Visit it in your browser — you should see `{"message":"NGO Management API is running"}`. This confirms your backend is live.
9. **Seed the admin account.** Render's free tier doesn't give you a persistent shell easily, so the simplest way is to run the seed script locally pointing at your Atlas database:
   - In your local `backend/.env`, make sure `MONGO_URI` is set to the same Atlas connection string you used in Render.
   - Run:
     ```bash
     npm run seed
     ```
   - This creates the one admin account directly in your Atlas database, which your live backend also reads from. You only need to do this once.

---

## Part 3: Frontend Deployment on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (GitHub sign-in is easiest).
2. Click **"Add New..."** → **"Project"**.
3. Import the same GitHub repository.
4. Configure the project:
   - **Root Directory:** `frontend` (important — tells Vercel to only build the frontend folder)
   - **Framework Preset:** Vite (should be auto-detected)
   - **Build Command:** `npm run build` (default, no change needed)
   - **Output Directory:** `dist` (default, no change needed)
5. Add an environment variable:
   | Key | Value |
   |---|---|
   | VITE_API_URL | `https://ngo-management-backend.onrender.com/api` (use YOUR Render backend URL from Part 2, with `/api` at the end) |
6. Click **"Deploy"**. Vercel will build and deploy your React app, giving you a URL like:
   ```
   https://ngo-management.vercel.app
   ```

---

## Part 4: Connect Frontend and Backend (CORS)

Your backend needs to know it's allowed to accept requests from your live frontend URL.

1. Go back to your **Render** dashboard → your backend service → **Environment**.
2. Update the `CLIENT_URL` variable to your Vercel URL:
   ```
   CLIENT_URL=https://ngo-management.vercel.app
   ```
3. Save changes. Render will automatically redeploy the backend with the updated setting.

---

## Part 5: Final Test

1. Visit your Vercel frontend URL.
2. Log in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in Part 2.
3. Try adding a volunteer and a donor to confirm the full flow (frontend → backend → MongoDB Atlas) works end to end.

If login fails or you see network errors in the browser console:
- Double-check `VITE_API_URL` in Vercel matches your Render URL exactly, including `/api` at the end and no trailing slash.
- Double-check `CLIENT_URL` in Render matches your Vercel URL exactly, with no trailing slash.
- Remember Render's free tier sleeps after inactivity — the first request can take up to a minute.

---

## Updating Your Deployment Later

Both Render and Vercel automatically redeploy whenever you push new commits to your connected GitHub branch. Just `git push` your changes and both platforms will rebuild automatically — no manual redeploy needed.
