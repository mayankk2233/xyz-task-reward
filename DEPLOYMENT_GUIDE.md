# Production Deployment Guide

This guide provides step-by-step instructions to deploy the Task and Reward platform to Vercel (Frontend) and Render (Backend).

## Prerequisites
1. You need a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. You need a free account on [Render](https://render.com).
3. You need a free account on [Vercel](https://vercel.com).
4. Have your code pushed to a GitHub repository.

---

## 1. Database Setup (MongoDB Atlas)
1. Log in to MongoDB Atlas and create a new cluster.
2. Under "Database Access", create a new database user and save the password.
3. Under "Network Access", click "Add IP Address" and hit "Allow Access from Anywhere" (`0.0.0.0/0`).
4. Click "Connect" -> Drivers -> Node.js and copy the Connection String.
   It should look something like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
5. Replace `<password>` with the password you made. Write `task-reward` before the `?` in the URL to name your database.

---

## 2. Backend Deployment (Render)
1. Go to your Render Dashboard and create a **New Web Service**.
2. Connect your GitHub repository containing this project.
3. Use the following configuration:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (Notice: Ensure your `backend/package.json` has `"start": "node server.js"`).
4. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `[Your MongoDB Atlas Connection String from Step 1]`
   - `JWT_SECRET`: `[Make up a long random password, e.g., s98dnv7y238fbv]`
   - `FRONTEND_URL`: `[Leave blank for now, we will add the Vercel URL later]`
5. Click **Deploy Web Service**.
6. Render will give you a domain like `https://my-backend-app.onrender.com`. Copy this URL.

---

## 3. Frontend Deployment (Vercel)
1. Go to your Vercel Dashboard and click **Add New Project**.
2. Import the same GitHub repository.
3. Use the following configuration:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
4. Add the following **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `[Your Render URL from Step 2]/api` (e.g., `https://my-backend-app.onrender.com/api`)
5. Click **Deploy**.
6. Vercel will give you a domain like `https://my-frontend-app.vercel.app`. Copy this URL.

---

## 4. Finalizing CORS (Very Important!)
Now that your frontend is deployed, you must whitelist it on the backend.
1. Go back to Render Dashboard -> Select your Backend Web Service.
2. Go to the "Environment" tab.
3. Edit the `FRONTEND_URL` environment variable.
4. Set it to your Vercel domain WITHOUT a trailing slash (e.g., `https://my-frontend-app.vercel.app`).
5. Render will automatically redeploy. Once it finishes, your apps are fully connected!

---

## 5. First Time Admin Access
To make an Admin account on Production:
1. Go to your Vercel frontend URL.
2. Sign up to create your user account.
3. Go into MongoDB Atlas -> Database -> Collections -> Find the `users` collection.
4. Edit your document and change the `role` field from `"user"` to `"admin"`.
5. Refresh your Next.js application, and you will now see the Admin dashboard cog in the navigation bar!

Enjoy your production-ready platform!
