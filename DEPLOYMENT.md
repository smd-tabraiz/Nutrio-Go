# NutriGo — Render Deployment Guide (Separate Frontend & Backend)

This guide walks you through deploying **NutriGo** onto [Render](https://render.com) with the Frontend and Backend separated, connected to your **MongoDB Atlas** database cluster.

---

## 🍃 MongoDB Atlas Configuration

Your connection string has already been configured in `server/index.js` and `render.yaml`:

```text
mongodb+srv://tabraizsmd_db_user:M3EcmHNdVHln8Utf@cluster0.31mtvlo.mongodb.net/nutrigo?retryWrites=true&w=majority&appName=Cluster0
```

> **Important MongoDB Atlas IP Whitelist Step:**
> 1. Go to [MongoDB Atlas](https://cloud.mongodb.com) ➔ **Network Access**.
> 2. Click **Add IP Address** ➔ Select **Allow Access from Anywhere** (`0.0.0.0/0`).
> 3. Save changes. This allows Render's cloud servers to connect to your database.

---

## ⚡ Option 1: Automatic 1-Click Deployment with `render.yaml` (Recommended)

1. Push this repository to **GitHub** or **GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** ➔ **Blueprint**.
4. Select your NutriGo repository.
5. Render will automatically read `render.yaml` and create:
   * **`nutrigo-backend`** (Node.js Express + MongoDB API Web Service)
   * **`nutrigo-frontend`** (Vite + React Static Site SPA)
6. Click **Apply**. Both services will build and go live automatically!

---

## 🛠️ Option 2: Manual Step-by-Step Deployment on Render

### Step 1: Deploy Backend (Web Service)

1. In Render Dashboard, click **New +** ➔ **Web Service**.
2. Connect your Git repository.
3. Configure the service settings:
   * **Name:** `nutrigo-backend`
   * **Region:** Any (e.g., Singapore, Frankfurt, Oregon)
   * **Branch:** `main`
   * **Root Directory:** `server`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node index.js`
   * **Plan:** Free
4. Add **Environment Variables** (under *Advanced*):
   * `NODE_ENV` = `production`
   * `PORT` = `10000`
   * `MONGODB_URI` = `mongodb+srv://tabraizsmd_db_user:M3EcmHNdVHln8Utf@cluster0.31mtvlo.mongodb.net/nutrigo?retryWrites=true&w=majority&appName=Cluster0`
   * `CORS_ORIGIN` = `*`
5. Click **Create Web Service**.
6. Once deployed, copy your backend URL (e.g., `https://nutrigo-backend.onrender.com`).

---

### Step 2: Deploy Frontend (Static Site)

1. In Render Dashboard, click **New +** ➔ **Static Site**.
2. Connect the same Git repository.
3. Configure the frontend settings:
   * **Name:** `nutrigo-frontend`
   * **Branch:** `main`
   * **Root Directory:** `client`
   * **Build Command:** `npm install && npm run build`
   * **Publish Directory:** `dist`
4. Add **Redirects / Rewrites** (or rely on `client/public/_redirects` which is already included):
   * Type: `Rewrite`
   * Source: `/*`
   * Destination: `/index.html`
5. Add **Environment Variables**:
   * `VITE_API_BASE_URL` = `https://your-backend-name.onrender.com/api` (Replace with your actual backend URL from Step 1)
6. Click **Create Static Site**.

---

## 🧪 Verifying Your Deployment

1. **Backend Health Check:**
   Open: `https://nutrigo-backend.onrender.com/api/health`
   Should return:
   ```json
   {
     "status": "ok",
     "service": "NutriGo MERN API",
     "mongoConnected": true,
     "timestamp": "..."
   }
   ```
2. **Database Auto-Seeding:**
   Open: `https://nutrigo-backend.onrender.com/api/packages`
   Should return the 7 NutriGo daily food packages directly from MongoDB.

3. **Frontend Application:**
   Open your frontend URL (e.g., `https://nutrigo-frontend.onrender.com`).
   * Test instant navigation between **Packages**, **7-Day Trial**, **My NutriGo**, **Feedback**, and **Admin Hub**.
   * Test customer registration & package checkout.
