const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { verifyToken, isAdmin, isStoreOwner } = require('../middleware/authMiddleware'); 


router.post('/add', verifyToken, isAdmin, storeController.addStore);

router.get('/', verifyToken, storeController.getAllStores); 

router.post('/rate', verifyToken, storeController.addRating);

router.get('/dashboard', verifyToken, isStoreOwner, storeController.getOwnerDashboard);

module.exports = router;