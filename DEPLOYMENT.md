# 🚀 Smart Queue System — Deployment Guide

## Architecture for Production

```
┌────────────────────┐         ┌────────────────────┐
│   NETLIFY          │         │   RENDER.COM        │
│   (Frontend)       │ ──API──▶│   (Backend)         │
│                    │         │                     │
│  React + Vite      │         │  Express + SQLite   │
│  Static Files      │         │  Socket.IO          │
│  CDN Delivery      │         │  REST API           │
└────────────────────┘         └────────────────────┘
```

**Frontend** → Netlify (free tier, static hosting)  
**Backend** → Render.com (free tier, Node.js server)

---

## STEP 1: Deploy Backend on Render.com

### 1.1 Push Backend to GitHub

Create a **separate GitHub repository** for the backend, OR use a monorepo.

```bash
# Option A: Separate repo for backend
cd backend
git init
git add .
git commit -m "SQMS Backend - initial deploy"
git remote add origin https://github.com/YOUR_USERNAME/sqms-backend.git
git push -u origin main
```

```bash
# Option B: Push entire Smart folder as monorepo
cd "C:\Users\GONE VIVEK SAI\Downloads\Smart"
git init
git add .
git commit -m "SQMS - full project"
git remote add origin https://github.com/YOUR_USERNAME/smart-queue-system.git
git push -u origin main
```

### 1.2 Create Render Web Service

1. Go to [https://render.com](https://render.com) and sign up (free).
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub account and select the repo.
4. Configure:

| Setting            | Value                              |
|--------------------|-------------------------------------|
| **Name**           | `sqms-backend`                     |
| **Root Directory** | `backend` (if monorepo) or leave blank |
| **Runtime**        | `Node`                              |
| **Build Command**  | `npm install`                       |
| **Start Command**  | `node server.js`                    |
| **Plan**           | `Free`                              |

5. Add **Environment Variables**:

| Key             | Value                                  |
|-----------------|----------------------------------------|
| `NODE_ENV`      | `production`                           |
| `PORT`          | `5000`                                 |
| `JWT_SECRET`    | `your_strong_secret_key_here_xyz123`   |
| `FRONTEND_URL`  | `https://your-site-name.netlify.app`   |

6. Click **"Deploy Web Service"**.
7. Wait for deploy to complete. Note your backend URL, e.g.:  
   **`https://sqms-backend.onrender.com`**

---

## STEP 2: Deploy Frontend on Netlify

### 2.1 Push Frontend to GitHub

If using monorepo (recommended), it's already pushed. Otherwise:

```bash
cd frontend
git init
git add .
git commit -m "SQMS Frontend - initial deploy"
git remote add origin https://github.com/YOUR_USERNAME/sqms-frontend.git
git push -u origin main
```

### 2.2 Create Netlify Site

1. Go to [https://app.netlify.com](https://app.netlify.com) and sign up (free).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Connect your GitHub and select the repo.
4. Configure build settings:

| Setting              | Value                                 |
|----------------------|---------------------------------------|
| **Base directory**   | `frontend` (if monorepo) or leave blank |
| **Build command**    | `npm run build`                       |
| **Publish directory**| `frontend/dist` (or `dist` if separate repo) |

5. Click **"Site settings"** → **"Environment variables"** and add:

| Key              | Value                                           |
|------------------|--------------------------------------------------|
| `VITE_API_URL`   | `https://sqms-backend.onrender.com/api`          |

   ⚠️ **Important**: Replace `sqms-backend.onrender.com` with your actual Render URL from Step 1.

6. Click **"Deploy site"**.

### 2.3 Update Render Backend's FRONTEND_URL

Once Netlify deploys and gives you a URL (e.g., `https://smart-queue.netlify.app`):

1. Go back to **Render Dashboard** → your backend service → **Environment**.
2. Update `FRONTEND_URL` to: `https://smart-queue.netlify.app`
3. Click **Save** (Render will auto-redeploy).

---

## STEP 3: Verify Deployment

1. Open your Netlify URL: `https://your-site.netlify.app`
2. You should see the 3D animated home page with your logo.
3. Try logging in:
   - **Admin**: `admin@sqms.com` / `admin123`
   - **User**: `user@sqms.com` / `user123`
4. Book a token, check the queue — everything should work!

---

## ⚠️ Important Notes

### Render Free Tier Limitations
- The free tier server **spins down after 15 minutes of inactivity**.
- First request after sleep takes **~30 seconds** to wake up.
- To avoid this, upgrade to Render's paid plan ($7/month) or use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 14 minutes.

### SQLite on Render
- Render's free tier has an **ephemeral filesystem** — the SQLite database resets on every deploy/restart.
- The seeder re-creates demo data automatically, so the 130 hospitals will always be there.
- For **persistent data in production**, consider:
  - Render PostgreSQL (free tier: 90 days)
  - Supabase (free PostgreSQL)
  - PlanetScale (free MySQL)

### Custom Domain
- **Netlify**: Go to Site settings → Domain management → Add custom domain
- **Render**: Go to your service → Settings → Custom Domains

---

## Quick Reference

| Component  | Service   | URL Pattern                              |
|-----------|-----------|------------------------------------------|
| Frontend  | Netlify   | `https://your-site.netlify.app`          |
| Backend   | Render    | `https://sqms-backend.onrender.com`      |
| API       | Render    | `https://sqms-backend.onrender.com/api`  |
| Health    | Render    | `https://sqms-backend.onrender.com/api/health` |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `404` on page refresh | The `_redirects` file and `netlify.toml` handle this. Make sure they exist in `frontend/public/` and `frontend/` respectively. |
| API calls failing | Check that `VITE_API_URL` is set correctly in Netlify env vars. It must include `/api` at the end. |
| CORS errors | Make sure `FRONTEND_URL` on Render matches your exact Netlify URL (with `https://`). |
| Login not working | Check browser console for API errors. The backend might be sleeping (free tier). Wait 30s and retry. |
| Database resetting | Expected on Render free tier. Seeder recreates data automatically. |
