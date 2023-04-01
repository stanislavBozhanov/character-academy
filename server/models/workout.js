const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

const Workout = sequelize.define('Workout', {
  id: PK,
  name: DataTypes.STRING,
  abbreviation: DataTypes.STRING,
  load: {
    type: Sequelize.ENUM('Easy', 'Moderate', 'Hard'),
    allowNull: false,
    defaultValue: 'Easy',
  },
  notes: DataTypes.STRING,
});

module.exports = Workout;
