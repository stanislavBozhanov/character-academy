const sequelize = require('./connection');
const User = require('../models/user');
const UserWorkout = require('../models/userWorkout');
const { Workout } = require('../models/workout');
const WorkoutExercise = require('../models/workoutExercise');
const { Exercise } = require('../models/exercise');

// Association definitions
Exercise.belongsToMany(Workout, { through: 'WorkoutExercise' });
UserWorkout.hasMany(WorkoutExercise, { foreignKey: 'userWorkoutId' });
Workout.belongsToMany(Exercise, { through: 'WorkoutExercise' });
User.hasMany(UserWorkout, { foreignKey: 'userId' });
Workout.hasMany(UserWorkout, { foreignKey: 'workoutId' });

async function initializeDb() {
  await sequelize.sync({ alter: true });
  console.log('Database synchronized');
}

module.exports = { initializeDb };
