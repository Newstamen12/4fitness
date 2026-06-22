const Workout = require('../model/workout');
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail');


// FIX: Import the exact class name from the official SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');

// FIX: Use the correct constructor initialization class
const aiEngine = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
// 1. GET ALL WORKOUTS (User Isolated)
// ==========================================
const getallWorkouts = async (req, res) => {
  const user_id = req.user._id;

  try {
    const allWorkouts = await Workout.getAllWorkouts(user_id);
    res.status(200).json(allWorkouts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==========================================
// 2. GET SINGLE WORKOUT (User Isolated)
// ==========================================
const getWorkout = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' });
  }

  try {
    const workout = await Workout.findOne({ _id: id, user_id });

    if (!workout) {
      return res.status(404).json({ error: 'No such workout' });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==========================================
// 3. CREATE WORKOUT (User Isolated)
// ==========================================
const createWorkout = async (req, res) => {
  const { title, reps, load } = req.body;
  const user_id = req.user._id;

  let emptyFields = [];
  if (!title) emptyFields.push('title');
  if (!reps) emptyFields.push('reps');
  if (!load) emptyFields.push('load');

  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: 'Please fill in all fields',
      emptyFields
    });
  }

  try {
    const workout = await Workout.create({ title, reps, load, user_id });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==========================================
// 4. DELETE WORKOUT (User Isolated)
// ==========================================
const deleteWorkout = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout found' });
  }

  try {
    const workout = await Workout.findOneAndDelete({ _id: id, user_id });

    if (!workout) {
      return res.status(404).json({ error: 'No such workout found or unauthorized access' });
    }

    res.status(200).json({ message: 'Workout deleted successfully', deletedWorkout: workout });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==========================================
// 5. UPDATE WORKOUT (User Isolated)
// ==========================================
const updateWorkout = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout found' });
  }

  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: id, user_id }, 
      { ...req.body }, 
      { new: true, runValidators: true } 
    );

    if (!workout) {
      return res.status(404).json({ error: 'No such workout found or unauthorized access' });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove the user exports block and replace it with this:
module.exports = {
  getallWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
};