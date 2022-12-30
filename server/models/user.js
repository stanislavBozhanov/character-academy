const { DataTypes } = require('sequelize');
const { db, PK } = require('./index.js');

const User = db.define(
  'User',
  {
    id: PK,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    salt: DataTypes.STRING,
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['username'],
      },
    ],
  }
);

module.exports = {
  User,
};
