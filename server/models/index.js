const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'academy.sqlite3',
});

async function initializeDb() {
  await db.sync({ alter: true });
}

const PK = {
  type: DataTypes.BIGINT,
  primaryKey: true,
  autoIncrement: true,
};

module.exports = {
  initializeDb,
  db,
  PK,
};
