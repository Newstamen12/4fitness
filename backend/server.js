require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('node:dns');
const helmet = require('helmet');

const paymentRoutes = require('./routes/paymentsRoutes');
const workoutRoutes = require('./routes/workout'); 
const userRoutes = require('./routes/user');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// ==========================================
// 1. SECURITY HEADERS & GLOBAL UTILITIES
// ==========================================
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
})); 

app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} request sent to: ${req.path}`);
    next();
});

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://4fitnezz-frontend.vercel.app', // <-- ADD THIS EXACT LINE
    'https://4fitnezz-frontend-oab7caq57-newstamen-david-s-projects.vercel.app',
    'https://4fitnezz-frontend-39rl56qb3-newstamen-david-s-projects.vercel.app',
    'https://4fitnezz-frontend-git-main-newstamen-david-s-projects.vercel.app',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
].filter(Boolean);

console.log('[CORS] Allowed origins:', allowedOrigins);

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ==========================================
// 3. BODY PARSING STRATEGY
// ==========================================
// This single middleware parses JSON globally, but stores the raw buffer 
// onto req.rawBody ONLY when hitting the webhook route.
app.use(express.json({
    verify: (req, res, buf) => {
        if (req.originalUrl.startsWith('/api/payments/webhook')) {
            req.rawBody = buf; // Kept as a Buffer, which Stripe/payment SDKs usually expect
        }
    }
}));

// ==========================================
// 4. ROUTING
// ==========================================
app.use('/api/payments', paymentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);

app.get('/', (req, res) => {
    res.json({ mssg: 'Welcome to the 4 Fitnezz Workout API' });
});

// ==========================================
// 5. DATABASE CONNECTION & LISTENER
// ==========================================
const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 4000;

if (!mongoUri) {
    console.error("FATAL ERROR: MONGO_URI environment variable is not defined.");
    process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB Database');
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });