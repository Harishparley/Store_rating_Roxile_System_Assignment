const { Sequelize } = require('sequelize');

// --- OFFLINE MODE (SQLite) ---
// We use this for development so we don't need internet.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // This creates a file in your project folder
  logging: false
});

module.exports = sequelize;