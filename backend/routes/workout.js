const express = require('express');
const {
  getallWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
} = require('../controllers/workoutsControllers');

// Import authentication middleware gatekeeper
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// ==========================================
// PROTECT ALL WORKOUT ROUTES BELOW THIS LINE
// ==========================================
router.use(requireAuth);

// Workout Endpoint Mappings
router.get('/', getallWorkouts);       // GET /api/workouts
router.get('/:id', getWorkout);       // GET /api/workouts/:id
router.post('/', createWorkout);      // POST /api/workouts
router.delete('/:id', deleteWorkout);  // DELETE /api/workouts/:id
router.patch('/:id', updateWorkout);   // PATCH /api/workouts/:id

module.exports = router;