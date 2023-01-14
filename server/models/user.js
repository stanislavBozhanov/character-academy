const { DataTypes } = require('sequelize');

const PK = {
  type: DataTypes.BIGINT,
  primaryKey: true,
  autoIncrement: true,
};

module.exports = (db) => {
  return db.define(
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
};
