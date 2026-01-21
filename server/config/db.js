const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('store_rating', 'root', '', {
  host: 'localhost',
  port: 3307, 
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;