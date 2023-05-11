const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');
const { exerciseDifficulty } = require('./enums');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

// Muscle group could be a multiple choice enum with predefined muscle groups
const Exercise = sequelize.define(
  'Exercise',
  {
    id: PK,
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING,
    difficulty: {
      type: Sequelize.ENUM(
        exerciseDifficulty.BEGGINER,
        exerciseDifficulty.INTERMEDIATE,
        exerciseDifficulty.ADVANCED,
        exerciseDifficulty.EXPERT
      ),
      allowNull: false,
      defaultValue: exerciseDifficulty.BEGGINER,
    },
    muscleGroup: DataTypes.STRING,
    notes: DataTypes.STRING,
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['name'],
      },
    ],
  }
);

module.exports = {
  Exercise,
};
