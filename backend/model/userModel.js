const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

// 🏢 1. COMPREHENSIVE USER DATA ARCHITECTURE
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  verificationCode: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'client' // 'client', 'admin', or 'ceo'
  },
  plan: {
    type: String,
    default: 'free' // 'free', 'premium'
  },

  passwordResetCode: {
    type: String,
    default: null
  },
  passwordResetExpiry: {
    type: Date,
    default: null
  },
  
  // 🤖 NESTED AI PERFORMANCE RATINGS & ADVICE FIELDS
  performance: {
    strengthGrade: {
      type: Number,
      default: 0
    },
    weaknessNotes: {
      type: String,
      default: ""
    },
    aiTrainingAdvice: {
      type: String,
      default: ""
    },
    aiDietRecommendation: {
      type: String,
      default: ""
    }
  },

  // 🧠 INTEGRATED ADMINISTRATIVE AI ANALYSIS 
  aiAnalysis: {
    grade: { type: String, default: '' },
    feedback: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now }
  },

  // 📊 GRADE HISTORY FOR PERFORMANCE TRACKING
  gradeHistory: [
    {
      grade: { type: String, required: true },
      feedback: { type: String, default: '' },
      ratedBy: { type: String, default: 'Admin' },
      ratedAt: { type: Date, default: Date.now }
    }
  ],

  // 🎯 FITNESS GOALS SET BY ADMIN
  goals: [
    {
      title: { type: String, required: true },
      description: { type: String, default: '' },
      target: { type: String, default: '' },
      deadline: { type: Date, default: null },
      status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
      setBy: { type: String, default: 'Admin' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }
  ],

  // 📧 CLIENT NOTIFICATION PREFERENCES
  emailNotifications: {
    onGradeUpdate: { type: Boolean, default: true },
    onFeedback: { type: Boolean, default: true },
    onGoalSet: { type: Boolean, default: true }
  }
}, { timestamps: true });

// 🧠 2. STATIC SIGNUP METHOD (Handles Username + Secure Salt Hashing)
userSchema.statics.signup = async function(username, email, password) {
  if (!username || !email || !password) {
    throw Error('All fields must be filled');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ 
    username, 
    email, 
    password: hash 
  });

  return user;
};

// 🔑 3. STATIC LOGIN METHOD
userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

// 📊 4. SWOT MATRIX ARCHITECTURE
const swotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  strengths: { type: String, default: '' },
  weaknesses: { type: String, default: '' },
  opportunities: { type: String, default: '' },
  threats: { type: String, default: '' },
  evaluatedBy: { type: String, default: 'Admin' }
}, { timestamps: true });

// 📦 5. CLEAN SINGLE EXPORT ENTRY FOR BOTH MODELS
const User = mongoose.model('User', userSchema);
const Swot = mongoose.model('Swot', swotSchema);

module.exports = { User, Swot };