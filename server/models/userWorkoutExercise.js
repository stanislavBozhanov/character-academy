const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');
const { exerciseRepetitionsType, exerciseStatus } = require('./enums');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

const UserWorkoutExercise = sequelize.define('UserWorkoutExercise', {
  id: PK,
  order: DataTypes.INTEGER,
  repetitionsType: {
    type: Sequelize.ENUM(exerciseRepetitionsType.REPETITIONS, exerciseRepetitionsType.TIME),
    allowNull: false,
    defaultValue: exerciseRepetitionsType.REPETITIONS,
  },
  repetitions: DataTypes.INTEGER,
  weight: DataTypes.DECIMAL(6, 2),
});

module.exports = {
  UserWorkoutExercise,
};
