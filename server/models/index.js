const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// 1. User Model
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'user' }
});

// 2. Store Model
const Store = sequelize.define('Store', {
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  // Explicitly defining the foreign key helps avoid confusion
  ownerId: {
    type: DataTypes.INTEGER,
    references: { model: 'Users', key: 'id' }
  }
});

// 3. Rating Model
const Rating = sequelize.define('Rating', {
  rating: { type: DataTypes.INTEGER, allowNull: false }
});

// 4. Relationships
User.hasOne(Store, { foreignKey: 'ownerId' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

module.exports = { sequelize, User, Store, Rating };