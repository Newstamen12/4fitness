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
  }
}, { timestamps: true });

// 🧠 2. STATIC SIGNUP METHOD (Handles Username + Secure Salt Hashing)
userSchema.statics.signup = async function(username, email, password) {
  // Field validation
  if (!username || !email || !password) {
    throw Error('All fields must be filled');
  }

  // Check if user already exists
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already in use');
  }

  // Securely hash user password via bcrypt
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Creating the user document
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

  // Cross-examine hashed key with input token
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

// 📦 4. EXPORT COMPILED SCHEMATIC
module.exports = mongoose.model('User', userSchema);