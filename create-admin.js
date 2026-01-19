// Run this ONCE to create your main Admin account
const sequelize = require('./server/config/db');
const User = require('./server/models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    
    await User.create({
      name: "System Administrator",
      email: "admin@roxiler.com",
      password: hashedPassword,
      address: "Headquarters",
      role: "admin" // <--- The magic key
    });
    
    console.log("✅ Admin User Created! Login with: admin@roxiler.com / Admin@123");
  } catch (err) {
    console.error("Error:", err.message);
  }
};

createAdmin();