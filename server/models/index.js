const sequelize = require('../config/db');
const User = require('./User');

// We bundle all models here so the main server can load them easily
const db = {
  sequelize,
  User,
};

module.exports = db;