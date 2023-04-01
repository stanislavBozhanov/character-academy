const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

const WorkoutExercise = sequelize.define('WorkoutExercise', {
  id: PK,
  status: {
    type: Sequelize.ENUM('to do', 'in progress', 'done'),
    allowNull: false,
    defaultValue: 'to do',
  },
  order: DataTypes.INTEGER,
  repetitionsType: {
    type: Sequelize.ENUM('repetitions', 'time'),
    allowNull: false,
    defaultValue: 'repetitions',
  },
  repetitions: DataTypes.INTEGER,
});

module.exports = WorkoutExercise;
