import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/User.js';
import Package from './models/Package.js';
import Delivery from './models/Delivery.js';
import Absence from './models/Absence.js';
import Payment from './models/Payment.js';
import Feedback from './models/Feedback.js';

import { SEED_PACKAGES, SEED_USERS, SEED_DELIVERIES, SEED_ABSENCES, SEED_PAYMENTS, SEED_FEEDBACK } from './data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Default to user's MongoDB connection string if not in process.env
const DEFAULT_MONGODB_URI = 'mongodb+srv://tabraizsmd_db_user:M3EcmHNdVHln8Utf@cluster0.31mtvlo.mongodb.net/nutrigo?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

// CORS setup to allow Render frontend, localhost, or any domain
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// In-Memory Fallback Store (active if DB is connecting or offline)
let isMongoConnected = false;
let memoryStore = {
  packages: [...SEED_PACKAGES],
  users: [...SEED_USERS],
  deliveries: [...SEED_DELIVERIES],
  absences: [...SEED_ABSENCES],
  payments: [...SEED_PAYMENTS],
  feedback: [...SEED_FEEDBACK],
};

// Seed MongoDB Function
async function seedMongoDB() {
  try {
    const pkgCount = await Package.countDocuments();
    if (pkgCount === 0) {
      console.log('🌱 Seeding initial NutriGo packages to MongoDB...');
      await Package.insertMany(SEED_PACKAGES);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial campus users to MongoDB...');
      await User.insertMany(SEED_USERS);
    }

    const delCount = await Delivery.countDocuments();
    if (delCount === 0) {
      console.log('🌱 Seeding initial deliveries to MongoDB...');
      await Delivery.insertMany(SEED_DELIVERIES);
    }

    const absCount = await Absence.countDocuments();
    if (absCount === 0) {
      console.log('🌱 Seeding initial absence requests to MongoDB...');
      await Absence.insertMany(SEED_ABSENCES);
    }

    const payCount = await Payment.countDocuments();
    if (payCount === 0) {
      console.log('🌱 Seeding initial payment records to MongoDB...');
      await Payment.insertMany(SEED_PAYMENTS);
    }

    const fbCount = await Feedback.countDocuments();
    if (fbCount === 0) {
      console.log('🌱 Seeding initial customer feedback to MongoDB...');
      await Feedback.insertMany(SEED_FEEDBACK);
    }

    console.log('✅ MongoDB database verified & seeded.');
  } catch (err) {
    console.error('⚠️ Database seed error:', err.message);
  }
}

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(async () => {
    isMongoConnected = true;
    console.log('🍃 MongoDB Atlas Connected successfully to Cluster0 [nutrigo]');
    await seedMongoDB();
  })
  .catch((err) => {
    isMongoConnected = false;
    console.log('⚡ MongoDB notice:', err.message);
    console.log('⚡ Running in active high-performance memory store mode.');
  });

// --- API ROUTES ---

// Health & Status Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NutriGo MERN API',
    mongoConnected: isMongoConnected,
    timestamp: new Date().toISOString(),
  });
});

// 1. Packages
app.get('/api/packages', async (req, res) => {
  try {
    if (isMongoConnected) {
      const pkgs = await Package.find();
      if (pkgs.length > 0) return res.json({ success: true, data: pkgs });
    }
    res.json({ success: true, data: memoryStore.packages });
  } catch (e) {
    res.json({ success: true, data: memoryStore.packages });
  }
});

// 2. Users & Auth
app.get('/api/users', async (req, res) => {
  try {
    if (isMongoConnected) {
      const users = await User.find();
      if (users.length > 0) return res.json({ success: true, data: users });
    }
    res.json({ success: true, data: memoryStore.users });
  } catch (e) {
    res.json({ success: true, data: memoryStore.users });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ success: false, message: 'Identifier required' });
    const trimmed = identifier.trim().toLowerCase();

    if (isMongoConnected) {
      const user = await User.findOne({
        $or: [
          { email: { $regex: new RegExp(`^${trimmed}$`, 'i') } },
          { rollOrEmpId: { $regex: new RegExp(`^${trimmed}$`, 'i') } },
          { phone: { $regex: new RegExp(`^${trimmed}$`, 'i') } },
        ],
      });
      if (user) return res.json({ success: true, user });
    }

    // Memory fallback
    const memUser = memoryStore.users.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        u.rollOrEmpId.toLowerCase() === trimmed ||
        u.phone.replace(/\s+/g, '') === trimmed.replace(/\s+/g, '')
    );
    if (memUser) return res.json({ success: true, user: memUser });

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const newUser = {
      id: `user_${Date.now()}`,
      name: req.body.name || 'New Customer',
      email: req.body.email || `user_${Date.now()}@nutrigo.com`,
      phone: req.body.phone || '+91 99999 00000',
      rollOrEmpId: req.body.rollOrEmpId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: req.body.department || 'General Studies',
      role: 'customer',
      membershipStatus: 'none',
      trialDay: 0,
      remainingServiceDays: 0,
      paymentStatus: 'paid',
    };

    if (isMongoConnected) {
      try {
        const created = await User.create(newUser);
        return res.json({ success: true, user: created });
      } catch (err) {
        console.error(err);
      }
    }

    memoryStore.users.unshift(newUser);
    res.json({ success: true, user: newUser });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 3. Deliveries
app.get('/api/deliveries', async (req, res) => {
  try {
    if (isMongoConnected) {
      const dels = await Delivery.find().sort({ createdAt: -1 });
      if (dels.length > 0) return res.json({ success: true, data: dels });
    }
    res.json({ success: true, data: memoryStore.deliveries });
  } catch (e) {
    res.json({ success: true, data: memoryStore.deliveries });
  }
});

app.post('/api/deliveries', async (req, res) => {
  try {
    const newDel = { id: `del_${Date.now()}`, ...req.body };
    if (isMongoConnected) {
      try {
        const created = await Delivery.create(newDel);
        return res.json({ success: true, data: created });
      } catch (err) {
        console.error(err);
      }
    }
    memoryStore.deliveries.unshift(newDel);
    res.json({ success: true, data: newDel });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.put('/api/deliveries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const updated = await Delivery.findOneAndUpdate(
        { $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
        req.body,
        { new: true }
      );
      if (updated) return res.json({ success: true, data: updated });
    }

    const idx = memoryStore.deliveries.findIndex((d) => d.id === id);
    if (idx !== -1) {
      memoryStore.deliveries[idx] = { ...memoryStore.deliveries[idx], ...req.body };
      return res.json({ success: true, data: memoryStore.deliveries[idx] });
    }
    res.status(404).json({ success: false, message: 'Delivery not found' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 4. Absences
app.get('/api/absences', async (req, res) => {
  try {
    if (isMongoConnected) {
      const abs = await Absence.find().sort({ createdAt: -1 });
      if (abs.length > 0) return res.json({ success: true, data: abs });
    }
    res.json({ success: true, data: memoryStore.absences });
  } catch (e) {
    res.json({ success: true, data: memoryStore.absences });
  }
});

app.post('/api/absences', async (req, res) => {
  try {
    const newAbs = { id: `abs_${Date.now()}`, ...req.body, status: 'confirmed' };
    if (isMongoConnected) {
      try {
        const created = await Absence.create(newAbs);
        return res.json({ success: true, message: 'Absence Successfully Recorded ✓', data: created });
      } catch (err) {
        console.error(err);
      }
    }
    memoryStore.absences.unshift(newAbs);
    res.json({ success: true, message: 'Absence Successfully Recorded ✓', data: newAbs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 5. Payments
app.get('/api/payments', async (req, res) => {
  try {
    if (isMongoConnected) {
      const pays = await Payment.find().sort({ createdAt: -1 });
      if (pays.length > 0) return res.json({ success: true, data: pays });
    }
    res.json({ success: true, data: memoryStore.payments });
  } catch (e) {
    res.json({ success: true, data: memoryStore.payments });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const newPay = { id: `pay_${Date.now()}`, ...req.body };
    if (isMongoConnected) {
      try {
        const created = await Payment.create(newPay);
        return res.json({ success: true, data: created });
      } catch (err) {
        console.error(err);
      }
    }
    memoryStore.payments.unshift(newPay);
    res.json({ success: true, data: newPay });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.put('/api/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const updated = await Payment.findOneAndUpdate(
        { $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
        req.body,
        { new: true }
      );
      if (updated) return res.json({ success: true, data: updated });
    }

    const idx = memoryStore.payments.findIndex((p) => p.id === id);
    if (idx !== -1) {
      memoryStore.payments[idx] = { ...memoryStore.payments[idx], ...req.body };
      return res.json({ success: true, data: memoryStore.payments[idx] });
    }
    res.status(404).json({ success: false, message: 'Payment not found' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 6. Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    if (isMongoConnected) {
      const fbs = await Feedback.find().sort({ createdAt: -1 });
      if (fbs.length > 0) return res.json({ success: true, data: fbs });
    }
    res.json({ success: true, data: memoryStore.feedback });
  } catch (e) {
    res.json({ success: true, data: memoryStore.feedback });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const newFb = { id: `fb_${Date.now()}`, ...req.body };
    if (isMongoConnected) {
      try {
        const created = await Feedback.create(newFb);
        return res.json({ success: true, data: created });
      } catch (err) {
        console.error(err);
      }
    }
    memoryStore.feedback.unshift(newFb);
    res.json({ success: true, data: newFb });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Optional Static SPA fallback (if serving unified from same server)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 NutriGo MERN Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/packages`);
});
