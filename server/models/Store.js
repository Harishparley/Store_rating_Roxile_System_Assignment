const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 60] }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 400] }
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0 // Starts at 0 stars
  }
});

module.exports = Store;