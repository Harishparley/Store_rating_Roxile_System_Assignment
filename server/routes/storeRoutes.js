const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); 

// 1. Add Store (Admin Only)
// Matches 'addStore' in controller
router.post('/add', verifyToken, isAdmin, storeController.addStore);

// 2. Get All Stores (Visible to logged-in users)
// Matches 'getAllStores' in controller
router.get('/', verifyToken, storeController.getAllStores); 

// 3. Rate Store
// ERROR WAS HERE: Changed 'addRating' to 'rateStore' to match controller
router.post('/rate', verifyToken, storeController.rateStore);

// 4. Owner Dashboard
// ERROR WAS HERE: Changed 'getOwnerDashboard' to 'getMyStore' to match controller
router.get('/my-store', verifyToken, storeController.getMyStore);

module.exports = router;