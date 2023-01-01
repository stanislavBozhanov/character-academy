const { Sequelize } = require('sequelize');

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'academy.sqlite3',
});

const User = require('./user')(db);

async function initializeDb() {
  await db.sync({ alter: true });
}

module.exports = {
  User,
  initializeDb,
};
