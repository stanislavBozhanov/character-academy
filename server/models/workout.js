const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');
const { workoutDifficulty } = require('./enums');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

const Workout = sequelize.define('Workout', {
  id: PK,
  name: DataTypes.STRING,
  load: {
    type: Sequelize.ENUM(workoutDifficulty.EASY, workoutDifficulty.MODERATE, workoutDifficulty.HARD),
    allowNull: false,
    defaultValue: workoutDifficulty.EASY,
  },
  notes: DataTypes.STRING,
});

module.exports = {
  Workout,
};
