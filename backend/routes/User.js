const express = require('express');

const {
  loginUser,
  signupUser,
  verifyEmailCode,
  gradeClientPerformance,
  gradeUserProfile,
  getUserProfile,
  getAllProfiles
} = require('../controllers/userController');

const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

/* ==============================
   PUBLIC ROUTES
============================== */
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/verify-otp', verifyEmailCode);

/* ==============================
   AUTHENTICATED ROUTES
============================== */
router.get('/profile-details', requireAuth, getUserProfile);
router.get('/profiles', requireAuth, getAllProfiles);

/* ==============================
   ADMIN ROUTES
============================== */
router.post(
  '/grade-performance',
  requireAuth,
  requireAdmin,
  gradeClientPerformance
);

router.put(
  '/grade/manual/:id',
  requireAuth,
  requireAdmin,
  gradeUserProfile
);

module.exports = router;