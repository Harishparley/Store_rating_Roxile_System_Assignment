const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Check Stats
router.get('/stats', verifyToken, isAdmin, adminController.getDashboardStats);

// Get/Filter Users
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);

// Add New User (Manual Creation)
router.post('/users', verifyToken, isAdmin, adminController.addUser);

module.exports = router;