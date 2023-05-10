const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');

const workoutDifficultyEnum = {
  Easy: 'Easy',
  Moderate: 'Moderate',
  Hard: 'Hard',
};

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

const Workout = sequelize.define('Workout', {
  id: PK,
  name: DataTypes.STRING,
  load: {
    type: Sequelize.ENUM(workoutDifficultyEnum.Easy, workoutDifficultyEnum.Moderate, workoutDifficultyEnum.Hard),
    allowNull: false,
    defaultValue: workoutDifficultyEnum.Easy,
  },
  notes: DataTypes.STRING,
});

module.exports = {
  Workout,
  workoutDifficultyEnum: workoutDifficultyEnum,
};
