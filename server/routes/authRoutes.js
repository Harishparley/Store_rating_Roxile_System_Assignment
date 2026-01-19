const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.put('/change-password', verifyToken, authController.changePassword);

router.post('/logout', (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;