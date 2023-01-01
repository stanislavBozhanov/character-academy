const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'academy.sqlite3',
});

const PK = {
  type: DataTypes.BIGINT,
  primaryKey: true,
  autoIncrement: true,
};

module.exports = {
  db,
  PK,
};
