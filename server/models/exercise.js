const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/connection');

const difficultyEnum = {
  Begginer: 'Begginer',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
  Expert: 'Expert',
};

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
        difficultyEnum.Begginer,
        difficultyEnum.Intermediate,
        difficultyEnum.Advanced,
        difficultyEnum.Expert
      ),
      allowNull: false,
      defaultValue: 'Begginer',
    },
    muscleGroup: DataTypes.STRING,
    equipment: DataTypes.STRING,
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
  difficultyEnum,
};
