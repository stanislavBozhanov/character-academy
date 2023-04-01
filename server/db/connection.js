const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'academy.sqlite3',
});

module.exports = sequelize;
