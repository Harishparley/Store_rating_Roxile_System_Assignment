const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize'); // Import Sequelize Operators for filtering

// 1. Dashboard Stats (Already working)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({
      users: totalUsers,
      stores: totalStores,
      ratings: totalRatings
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// 2. Get All Users WITH FILTERING (Fixed Missing Requirement)
exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    
    // Build the "Where" clause dynamically based on filters
    let whereClause = {};

    // Filter by Role (Exact match)
    if (role) {
      whereClause.role = role;
    }

    // Filter by Email (Partial match)
    if (email) {
      whereClause.email = { [Op.like]: `%${email}%` };
    }

    // Filter by Name (Partial match)
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    // Filter by Address (Partial match)
    if (address) {
      whereClause.address = { [Op.like]: `%${address}%` };
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'address', 'role'] // Exclude password
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// 3. Create User Manually (Fixed Missing Requirement)
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // --- Validation Logic (Matches Assignment Rules) ---
    
    // Name: Min 20, Max 60
    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({ error: "Name must be between 20 and 60 characters." });
    }

    // Password: 8-16 chars, 1 Upper, 1 Special
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Password must be 8-16 chars, include 1 uppercase & 1 special character." });
    }

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || 'user' // Admin can specify role, defaults to 'user'
    });

    res.status(201).json({ 
      message: "User created successfully", 
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
};