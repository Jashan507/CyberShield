const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAnalytics,
  getAuditLogs,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.use(protect, adminOnly);

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
