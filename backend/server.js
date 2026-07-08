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
// PRODUCTION-ALIGNED CORS MIDDLEWARE
// ==========================================
const isDevelopment = process.env.NODE_ENV !== 'production';

const allowedOrigins = [
    ...(isDevelopment ? ['http://localhost:5173', 'http://127.0.0.1:5173'] : []),
    'https://4fitnezz-frontend-39rl56qb3-newstamen-david-s-projects.vercel.app/',
    '4fitnezz-frontend-git-main-newstamen-david-s-projects.vercel.app',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`[CORS] Blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS restrictions'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));
// ==========================================
// DEBUG: Allowed origins in this environment
console.log('[CORS] Allowed origins:', allowedOrigins);

app.use(helmet()); 

app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} request sent to: ${req.path}`);
    next();
});

app.use(express.json({
    verify: (req, res, buf) => {
        if (req.originalUrl.startsWith('/api/payments/webhook')) {
            req.rawBody = buf.toString();
        }
    }
}));

// Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);

app.get('/', (req, res) => {
    res.json({ mssg: 'Welcome to the 4 Fitness Workout API' });
});

// Database Connection & Server Listener
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