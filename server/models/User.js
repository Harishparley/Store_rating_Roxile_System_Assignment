const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 60] // Requirement: Min 3, Max 60 chars
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // Validates email format automatically
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 400] // Requirement: Max 400 chars
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'owner'),
    defaultValue: 'user'
  }
});

module.exports = User;