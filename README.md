# 🌱 NutriGo — Small choices. Better health.

> **NutriGo** is a modern, student-friendly healthy food web application that delivers fresh, weighed portions of sprouts, fruits, and vegetables to campus routines. It features transparent 7-day trials, 26-service-day monthly plans with 1-day advance absence swapping, and a complete operations hub for daily preparation and delivery management.

---

## 🥗 About NutriGo

NutriGo delivers pure, clean, and nutritious morning portions tailored for students, faculty, and campus staff. With clear portions, transparent pricing, and zero auto-debit commitments, NutriGo turns small daily dietary choices into lifelong health habits.

---

## 📦 NutriGo Packages & Transparent Pricing

| Package | Quantity | Daily Rate | 7-Day Trial | 26 Service Days (Monthly) |
| :--- | :--- | :--- | :--- | :--- |
| **🌱 Sprouts** | 150 g | ₹19 / day | **₹133** | **₹494** |
| **🍎 Fruits** | 200 g | ₹29 / day | **₹203** | **₹754** |
| **🥕 Vegetables** | 200 g | ₹26 / day | **₹182** | **₹676** |
| **🌱 + 🍎 Sprouts + Fruits** | 150 g Sprouts + 200 g Fruits | ₹45 / day | **₹315** | **₹1,170** |
| **🌱 + 🥕 Sprouts + Vegetables** | 150 g Sprouts + 200 g Vegetables | ₹40 / day | **₹280** | **₹1,040** |
| **🍎 + 🥕 Fruits + Vegetables** | 200 g Fruits + 200 g Vegetables | ₹45 / day | **₹315** | **₹1,170** |
| **🌱 + 🍎 + 🥕 Sprouts + Fruits + Veggies** | 150 g + 200 g + 200 g | ₹55 / day | **₹385** | **₹1,430** |

> **26 Service Days Guarantee:** Monthly plans calculate actual active service days after excluding official college, workplace, and continuous holidays.

---

## 🛠️ Technology Stack (MERN)

* **MongoDB / Mongoose:** MongoDB Atlas cloud database cluster with schemas for `User`, `Package`, `Delivery`, `Absence`, `Payment`, and `Feedback`.
* **Express.js & Node.js:** High-performance RESTful API backend handling authentication, delivery statuses, absences, payments, and feedback with automatic database seeding.
* **React & Vite:** Single Page Application (SPA) with instant `react-router-dom` navigation (0ms latency, zero page reloads).
* **Tailwind CSS:** Natural, calm aesthetic design system inspired by fresh produce (soft greens `#2D5A27`, warm cream `#FAF9F5`, delicate borders, and clean typography).
* **Lucide Icons & Canvas Confetti:** Clean lightweight SVG iconography and subtle celebration micro-interactions.

---

## ✨ Key Application Features

### 👤 Customer Experience
* **7-Day Trial Checkout (`/trial`):** Displays exact price calculations before payment with instant trial activation and progress tracking (Day 1 of 7).
* **Trial Completion Choice:** After Day 7, prompts the customer with explicit choices (*"Continue with Monthly Subscription"* or *"I Don't Want to Continue"*) — **zero automatic charges or surprise debits**.
* **My NutriGo Dashboard (`/my-nutrigo`):** Live delivery tracking, **"✅ I Received My Package"** one-tap confirmation with timestamps, and full delivery logs.
* **Absence Swapping (1-Day Prior):** Submit absence notice 1 day in advance to receive an extra **🍎 Fruit (200 g)** or **🥕 Veggie (200 g)** replacement portion.
* **Today's Feedback (`/feedback`):** Non-mandatory 1–5 star ratings, optional category tags (*Freshness*, *Taste*, *Quantity*, *Packaging*, *Delivery*), and campus reviews wall.
* **Customer Profile (`/profile`):** Campus ID, department, package info, subscription calendar, payment history, and past feedback.

### 🛡️ Admin Operations Hub (`/admin`)
* **Live Overview:** Real-time statistics on total customers, active trials, monthly subscribers, paid vs. pending payments, and today's deliveries.
* **Kitchen Preparation View:** Morning prep sheet calculating exact portion counts required for campus kiosks and departments.
* **Today's Delivery Management:** Daily delivery roster with filters (`All`, `✅ Received`, `⏳ Pending`, `❌ Not Received`, `🟣 Absent`).
* **Trial & Monthly Management:** Full customer progress tracking, remaining service days, and package distribution.
* **Payment Management:** Segregated *Paid* and *Pending* payment records with one-click reconciliation.
* **Absence & Feedback Management:** Centralized tracking of upcoming item replacements and quality ratings.
* **Conversion Funnel Analytics:** Tracks *Trials Started ➔ Completed ➔ Continued Monthly* with retention charts.

---

## 📁 Project Structure

```text
Nutrio-Go/
├── client/                     # Vite + React Frontend SPA
│   ├── public/                 # Static assets & _redirects (Render SPA rewrite)
│   │   ├── nutrigo-logo.png    # Official NutriGo circular brand logo
│   │   └── _redirects
│   ├── src/
│   │   ├── components/         # Navbar, MobileBottomNav, DemoBar, Footer
│   │   ├── context/            # NutriGoContext (State & API sync)
│   │   ├── data/               # Packages definition & constants
│   │   ├── pages/              # Home, Packages, Trial, MyNutriGo, Profile, Admin, Login
│   │   ├── App.jsx             # React Router routing
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express + MongoDB Backend
│   ├── data/                   # Seed dataset (packages, demo campus accounts)
│   ├── models/                 # Mongoose Models (User, Package, Delivery, Absence, etc.)
│   ├── index.js                # Express API & MongoDB Atlas connection
│   └── package.json
├── render.yaml                 # 1-Click Render Blueprint for dual deployment
├── DEPLOYMENT.md               # Step-by-step Render deployment documentation
└── README.md
```

---

## 💻 Local Development Setup

### 1. Prerequisites
* [Node.js (v18+)](https://nodejs.org/)
* npm (v9+)

### 2. Install Dependencies

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 3. Run Locally

**Start Express Backend Server (Port 5001):**
```bash
cd server
npm start
```

**Start Vite React Frontend (Port 5173 / 3000):**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Deployment on Render

This project is configured for **separate Frontend & Backend deployment** on [Render](https://render.com) connected to **MongoDB Atlas**.

### Quick 1-Click Deployment (Blueprint):
1. Push this repository to GitHub/GitLab.
2. In Render, select **New + ➔ Blueprint** and select this repository.
3. Render reads [`render.yaml`](./render.yaml) and automatically provisions both `nutrigo-backend` and `nutrigo-frontend`.

For detailed step-by-step manual deployment instructions, refer to [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 📄 License

Built for the **NutriGo** daily wellness initiative. All rights reserved.
