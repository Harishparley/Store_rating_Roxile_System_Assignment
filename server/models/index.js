const sequelize = require('../config/db');
const User = require('./User');
const Store = require('./Store'); 

const db = {
  sequelize,
  User,
  Store, 
};

module.exports = db;