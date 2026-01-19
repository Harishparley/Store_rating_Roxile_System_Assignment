const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// POST /api/stores/add
// We protect this route: User must be Logged In (verifyToken) AND be Admin (isAdmin)
router.post('/add', verifyToken, isAdmin, storeController.addStore);

module.exports = router;