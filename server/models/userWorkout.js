const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');
const { workoutStatus } = require('./enums');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

const UserWorkout = sequelize.define('UserWorkout', {
  id: PK,
  status: {
    type: Sequelize.ENUM(workoutStatus.TO_DO, workoutStatus.IN_PROGRESS, workoutStatus.DONE),
    allowNull: false,
    defaultValue: workoutStatus.TO_DO,
  },
  date: DataTypes.DATE,
});

module.exports = {
  UserWorkout,
};
