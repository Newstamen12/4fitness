const express = require('express');

const {
  loginUser,
  signupUser,
  verifyEmailCode,
  requestPasswordReset,
  resetPassword,
  gradeClientPerformance,
  gradeUserProfile,
  getUserProfile,
  getAllProfiles,
  generateAutomaticClientFeedback,
  saveClientSwot,
  getClientSwot,
  setClientGoals,
  updateGoalStatus,
  getClientDashboard,
  updateNotificationPreferences
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
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

/* ==============================
   AUTHENTICATED ROUTES
============================== */
router.get('/profile-details', requireAuth, getUserProfile);
router.get('/profiles', requireAuth, getAllProfiles);
router.get('/dashboard/:clientId', requireAuth, getClientDashboard);
router.get('/dashboard', requireAuth, getClientDashboard);
router.put('/notification-preferences', requireAuth, updateNotificationPreferences);

/* ==============================
   ADMIN ROUTES (GOALS & PERFORMANCE)
============================== */
router.post('/grade-performance', requireAuth, requireAdmin, gradeClientPerformance);
router.put('/grade/manual/:id', requireAuth, requireAdmin, gradeUserProfile);
router.post('/auto-feedback', requireAuth, requireAdmin, generateAutomaticClientFeedback);
router.post('/swot', requireAuth, requireAdmin, saveClientSwot);
router.get('/swot/:userId', requireAuth, requireAdmin, getClientSwot);
router.post('/goals/set', requireAuth, requireAdmin, setClientGoals);
router.put('/goals/update-status', requireAuth, requireAdmin, updateGoalStatus);

module.exports = router;
