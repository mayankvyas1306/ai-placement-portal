const express = require('express');
const router = express.Router();
const { getSystemStats, getAllUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, admin);

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);

module.exports = router;
