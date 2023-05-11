const sequelize = require('./connection');
const User = require('../models/user');
const { UserWorkout } = require('../models/userWorkout');
const { Workout } = require('../models/workout');
const { WorkoutExercise } = require('../models/workoutExercise');
const { Exercise } = require('../models/exercise');
const { UserWorkoutExercise } = require('../models/userWorkoutExercise');

// Association definitions
Exercise.belongsToMany(Workout, { through: 'WorkoutExercise' });
Workout.belongsToMany(Exercise, { through: 'WorkoutExercise' });
Workout.hasMany(UserWorkout, { foreignKey: 'workoutId' });
UserWorkout.hasMany(UserWorkoutExercise, { foreignKey: 'userWorkoutId' });
Exercise.hasMany(UserWorkoutExercise, { foreignKey: 'exerciseId' });
User.hasMany(UserWorkout, { foreignKey: 'userId' });

async function initializeDb() {
  await sequelize.sync({ alter: true });
  console.log('Database synchronized');
}

module.exports = { initializeDb };
