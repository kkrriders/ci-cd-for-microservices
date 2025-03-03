const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const orderValidationRules = require('../middleware/validation.middleware');

// Create a new order
router.post('/orders', orderValidationRules.createOrder, orderController.createOrder);

// Get all orders with pagination and filtering
router.get('/orders', orderValidationRules.queryValidation, orderController.getAllOrders);

// Get a single order by ID
router.get('/orders/:id', orderValidationRules.getOrder, orderController.getOrderById);

// Update order status
router.put('/orders/:id/status', orderValidationRules.updateOrderStatus, orderController.updateOrderStatus);

// Cancel an order
router.delete('/orders/:id/cancel', orderValidationRules.getOrder, orderController.cancelOrder);

// Get order statistics
router.get('/orders/stats', orderController.getOrderStats);

// Get user order history
router.get('/users/:userId/orders', orderValidationRules.getUserOrders, orderController.getUserOrders);

// Process a refund for an order
router.post('/orders/:id/refund', orderValidationRules.processRefund, orderController.processRefund);

// Get daily order summary
router.get('/orders/daily-summary', orderValidationRules.dailyOrderSummary, orderController.getDailyOrderSummary);

module.exports = router;
