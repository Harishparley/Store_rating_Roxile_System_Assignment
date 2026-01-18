const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Validation Schema (As per requirements)
const signupSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16)
    // Regex: At least 1 Uppercase, 1 Special Character
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])'))
    .required(),
  address: Joi.string().max(400).optional(),
  role: Joi.string().valid('user', 'store_owner').default('user')
});

exports.signup = async (req, res) => {
  try {
    // 1. Validate Input
    const { error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password, address, role } = req.body;

    // 2. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 3. Hash Password (Security Best Practice)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || 'user'
    });

    // 5. Generate Token (So they are logged in immediately)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: "User registered successfully", token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during signup" });
  }
};

// ... existing imports and signup code ...

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 3. Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
};