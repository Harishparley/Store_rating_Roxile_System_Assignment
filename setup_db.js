const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// 1. Force a specific database file path
const dbPath = path.resolve(__dirname, 'final_database.sqlite');

// 2. Initialize Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
});

// 3. Define Models EXACTLY as we need them
const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'user' }
});

const Store = sequelize.define('Store', {
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    // EXPLICITLY defining the problem column
    ownerId: { type: DataTypes.INTEGER }
});

const Rating = sequelize.define('Rating', {
    rating: { type: DataTypes.INTEGER, allowNull: false }
});

// 4. Associations
User.hasOne(Store, { foreignKey: 'ownerId' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

// 5. The Execution Function
async function setup() {
    try {
        console.log('⏳ Deleting old data...');
        await sequelize.sync({ force: true }); // This WIPES and REBUILDS
        console.log('✅ Database Tables Created Successfully.');

        console.log('Creating Admin User...');
        await User.create({
            name: "System Admin",
            email: "admin@roxiler.com",
            password: "Admin@123", // In a real app, hash this!
            role: "admin",
            address: "HQ"
        });
        console.log('✅ Admin User Created (admin@roxiler.com / Admin@123)');
        
        console.log('🎉 SUCCESS! The database is fixed.');
    } catch (error) {
        console.error('❌ Failed:', error);
    }
}

setup();