const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

// Muscle group could be a multiple choice enum with predefined muscle groups
const Exercise = sequelize.define('Exercise', {
  id: PK,
  name: DataTypes.STRING,
  abbreviation: DataTypes.STRING,
  difficulty: {
    type: Sequelize.ENUM('Begginer', 'Intermediate', 'Advanced', 'Expert'),
    allowNull: false,
    defaultValue: 'Begginer',
  },
  muscleGroup: DataTypes.STRING,
  variation: DataTypes.STRING,
  notes: DataTypes.STRING,
});

module.exports = Exercise;
