const jwt = require('jsonwebtoken');

// 1. Verify if the user has a valid Token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access Denied: No Token Provided' });

  try {
    // Remove "Bearer " if present and verify
    const cleanToken = token.replace("Bearer ", "");
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = verified; // Save user info to use in other routes
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};

// 2. Verify if the user is an Admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access Denied: You are not an Admin' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };