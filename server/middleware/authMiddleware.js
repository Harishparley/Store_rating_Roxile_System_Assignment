const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    // Expecting "Bearer <token>" or just "<token>"
    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
    const verified = jwt.verify(tokenString, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};

// --- ADD THIS FUNCTION ---
exports.isStoreOwner = (req, res, next) => {
  if (req.user && (req.user.role === 'store_owner' || req.user.role === 'owner')) {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Store Owners only." });
  }
};