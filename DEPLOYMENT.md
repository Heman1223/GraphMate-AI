# 🚀 GraphMate — Complete Deployment Guide

This guide walks you through deploying **GraphMate** for **100% free** using standard cloud services:
- **Database:** MongoDB Atlas (Free M0 Cluster)
- **AI Microservice:** Render (Docker Web Service)
- **Backend API:** Render (Node.js Web Service)
- **Frontend Client:** Vercel (Global Edge CDN)

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Click **Create Deployment** $\rightarrow$ select the **M0 Free** tier (AWS / any region).
3. Under **Security Quickstart**:
   - Create a database user (e.g., username `graphmate_admin`, choose a strong password).
   - Under **IP Access List**, click **Add IP Address** $\rightarrow$ select **Allow Access from Anywhere (`0.0.0.0/0`)** so your deployed cloud servers can connect.
4. Click **Connect** $\rightarrow$ choose **Drivers (Node.js)**.
5. Copy your connection string. It will look like:
   ```env
   mongodb+srv://graphmate_admin:<password>@cluster0.abcde.mongodb.net/graphmate?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your actual password and ensure `/graphmate` is in the path)*.

---

## Step 2: Push Your Code to GitHub

Commit and push all recent changes to your repository:
```bash
git add .
git commit -m "feat: add production deployment configs and Dockerfiles"
git push origin main
```

---

## Step 3: Deploy Backend & AI Service on Render

### Option A: One-Click Blueprint (Recommended)
1. Go to [render.com](https://render.com) and log in with your GitHub account.
2. Click **New +** $\rightarrow$ select **Blueprint**.
3. Connect your repository: `Heman1223/GraphMate-AI`.
4. Render will read `render.yaml` and configure both:
   - `graphmate-ai-service` (Docker)
   - `graphmate-backend` (Node.js)
5. Under `graphmate-backend` environment variables:
   - Set `MONGODB_URI` to your MongoDB Atlas string from Step 1.
6. Click **Apply**. Render will automatically build and deploy both services!
7. Once deployed, note your backend URL (e.g., `https://graphmate-backend.onrender.com`).

### Option B: Manual Setup on Render

#### 1. AI Service (`ai-service`)
- Click **New +** $\rightarrow$ **Web Service** $\rightarrow$ connect your repo.
- **Root Directory:** `ai-service`
- **Language / Runtime:** `Docker`
- **Instance Type:** `Free`
- Click **Deploy Web Service**.
- Note the service URL (e.g., `https://graphmate-ai-service.onrender.com`).

#### 2. Node Backend (`server`)
- Click **New +** $\rightarrow$ **Web Service** $\rightarrow$ connect your repo.
- **Root Directory:** `server`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `5000`
  - `MONGODB_URI`: your MongoDB Atlas connection string
  - `JWT_SECRET`: any long random string (e.g., `supersecretkey_2026_xyz`)
  - `JWT_EXPIRES_IN`: `7d`
  - `AI_SERVICE_URL`: `https://graphmate-ai-service.onrender.com` (from above)
  - `CLIENT_URL`: `https://your-frontend.vercel.app` (you will get this in Step 4)
- Click **Deploy Web Service**.
- Note your backend URL (e.g., `https://graphmate-backend.onrender.com`).

---

## Step 4: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your `Heman1223/GraphMate-AI` repository.
4. In the configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `client`.
5. Under **Environment Variables**, add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://graphmate-backend.onrender.com/api` *(Your Render backend URL with `/api` appended)*
6. Click **Deploy**.
7. In ~60 seconds, your frontend will be live on a URL like `https://graphmate-ai.vercel.app`!

---

## Step 5: Final Polish

1. Go back to your Render Dashboard $\rightarrow$ `graphmate-backend` $\rightarrow$ **Environment**.
2. Update `CLIENT_URL` to your live Vercel URL (e.g., `https://graphmate-ai.vercel.app`).
3. *(Optional)* Seed demo users to your live database:
   On your local machine, run:
   ```bash
   cd server
   # temporarily set MONGODB_URI in server/.env to your Atlas URI, then run:
   npm run seed
   ```

---

## 🎉 You're Done!
Your full-stack AI platform is now live on the internet and ready to show to recruiters!
