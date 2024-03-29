const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');
const { exerciseRepetitionsType } = require('./enums');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

const WorkoutExercise = sequelize.define('WorkoutExercise', {
  id: PK,
  order: DataTypes.INTEGER,
  repetitionsType: {
    type: Sequelize.ENUM(exerciseRepetitionsType.REPETITIONS, exerciseRepetitionsType.TIME),
    allowNull: false,
    defaultValue: exerciseRepetitionsType.REPETITIONS,
  },
  repetitions: DataTypes.INTEGER,
});

module.exports = {
  WorkoutExercise,
};
