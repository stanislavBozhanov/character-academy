const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

const User = sequelize.define(
  'User',
  {
    id: PK,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    salt: DataTypes.STRING,
    role: DataTypes.STRING,
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['username'],
      },
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

module.exports = User;
