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
const port = process.env.PORT || 4000;

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

// ==========================================
// 6. ROUTE DECLARATIONS
// ==========================================
// 💳 Mount payments with a raw text parser for webhook signature verification
app.use('/api/payments', express.text({ type: 'application/json' }), paymentRoutes);

// 📄 Standard JSON body parsing for other routes
app.use(express.json()); 

app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);

app.get('/', (req, res) => {
    res.json({ mssg: 'Welcome to the 4 Fitness Workout API' });
});

// ==========================================
// 7. CONNECT TO MONGO DB & LISTEN
// ==========================================
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Database');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    // Keep the function alive so Vercel can still respond with 500 errors
    // instead of killing the runtime on startup failure.
  });

module.exports = app;