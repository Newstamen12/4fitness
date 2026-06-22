// ==========================================
// 1. INITIALIZE ENVIRONMENT VARIABLES FIRST!
// ==========================================
require('dotenv').config(); // Load configs into process.env before anything else imports

// ==========================================
// 2. ALL OTHER REQUIRES / IMPORTS
// ==========================================
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('node:dns');
const helmet = require('helmet');
// Change line 14 from './routes/paymentRoutes' to './routes/paymentsRoutes'
const paymentRoutes = require('./routes/paymentsRoutes');

// Routes (Now safely reading your loaded environment keys)
const workoutRoutes = require('./routes/workout'); 
const userRoutes = require('./routes/user');

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
// 5. GLOBAL MIDDLEWARE (Must come before routes!)
// ==========================================
app.use(cors());         // Allows cross-origin requests from your frontend
app.use(helmet());       // Adds security headers to responses

// Global custom logging middleware
app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} request sent to: ${req.path}`);
    next();
});

// ==========================================
// 6. ROUTE DECLARATIONS
// ==========================================
// 💳 Mount payments first with a text parser to pass the exact raw string body to the webhook
app.use('/api/payments', express.text({ type: 'application/json' }), paymentRoutes);

// 📄 Standard JSON body parsing for your user and workout routes
app.use(express.json()); 

app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);

// Base sanity check route
app.get('/', (req, res) => {
    res.json({ mssg: 'Welcome to the 4 Fitness Workout API' });
});

// ==========================================
// 7. CONNECT TO MONGO DB & LISTEN
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Database connection error:', error);
  });

module.exports = app;