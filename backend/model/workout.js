const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  reps: {
    type: Number,
    required: true,
    min: 1
  },
  load: {
    type: Number,
    required: true,
    min: 0
  },
  user_id: {
    type: String,
    required: true // Securely pins sessions to a specific user token
  }
}, { timestamps: true });

// Static model method to fetch and sort user workout history automatically
workoutSchema.statics.getAllWorkouts = async function(user_id) {
  return await this.find({ user_id }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Workout', workoutSchema);