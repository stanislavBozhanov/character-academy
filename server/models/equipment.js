const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const PK = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

const Eqipment = sequelize.define('Equipment', {
  id: PK,
  name: DataTypes.STRING,
  abbreviation: DataTypes.STRING,
  description: DataTypes.STRING,
});

module.exports = Eqipment;
