const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById, getAllOrders,
  updateOrderStatus, cancelOrder, getOrderStats
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/stats', protect, adminOnly, getOrderStats);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;