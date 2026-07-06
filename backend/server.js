// ==========================================
// 1. INITIALIZE ENVIRONMENT VARIABLES FIRST!
// ==========================================
require('dotenv').config(); 

// ==========================================
// 2. ALL OTHER REQUIRES / IMPORTS
// ==========================================
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('node:dns');
const helmet = require('helmet');

const paymentRoutes = require('./routes/paymentsRoutes');
const workoutRoutes = require('./routes/workout'); 
const userRoutes = require('./routes/User');

// ==========================================
// 3. CONFIGURE DNS
// ==========================================
dns.setServers(['8.8.8.8', '8.8.4.4']);

// ==========================================
// 4. INITIALIZE THE EXPRESS APP
// ==========================================
const app = express();

// ==========================================
// 5. GLOBAL MIDDLEWARE
// ==========================================
// 💡 PRODUCTION TIP: Update origin to your Vercel URL when you deploy
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
})); 

app.use(helmet()); 

app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} request sent to: ${req.path}`);
    next();
});

// 📄 Robust global parser that captures raw body for Stripe signatures
// without blocking standard JSON parsing for your other routes.
app.use(express.json({
    verify: (req, res, buf) => {
        if (req.originalUrl.startsWith('/api/payments/webhook')) {
            req.rawBody = buf.toString();
        }
    }
}));

// ==========================================
// 6. ROUTE DECLARATIONS
// ==========================================
app.use('/api/payments', paymentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);

app.get('/', (req, res) => {
    res.json({ mssg: 'Welcome to the 4 Fitness Workout API' });
});

// ==========================================
// 7. CONNECT TO MONGO DB & LISTEN
// ==========================================
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness';

// Fixed: Removed deprecated useNewUrlParser and useUnifiedTopology options
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB Database');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    // Keep the function alive so Vercel can still respond with 500 errors
    // instead of killing the runtime on startup failure.
  });

module.exports = app;