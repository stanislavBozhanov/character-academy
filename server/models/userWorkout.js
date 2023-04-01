const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

const UserWorkout = sequelize.define('UserWorkout', {
  id: PK,
  status: {
    type: Sequelize.ENUM('to do', 'in progress', 'done'),
    allowNull: false,
    defaultValue: 'to do',
  },
  date: DataTypes.DATE,
});

module.exports = UserWorkout;
