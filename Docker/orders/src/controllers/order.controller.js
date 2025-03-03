const Order = require('../models/order.model');
const logger = require('../config/logger');
const asyncHandler = require('express-async-handler');

// Create new order
exports.createOrder = asyncHandler(async (req, res) => {
    const order = new Order({
        userId: req.body.userId,
        items: req.body.items,
        shippingAddress: req.body.shippingAddress,
        totalAmount: req.body.totalAmount,
        paymentMethod: req.body.paymentMethod
    });

    const savedOrder = await order.save();
    logger.info(`Created new order: ${savedOrder._id}`);
    res.status(201).json(savedOrder);
});

// Get all orders with pagination and filtering
exports.getAllOrders = asyncHandler(async (req, res) => {
    const { 
        page = 1, 
        limit = 10, 
        status,
        userId,
        startDate,
        endDate 
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Order.countDocuments(query);

    logger.info(`Retrieved ${orders.length} orders`);
    
    res.status(200).json({
        orders,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalOrders: count
    });
});

// Get single order by ID
exports.getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        logger.warn(`Order not found with id: ${req.params.id}`);
        return res.status(404).json({ message: 'Order not found' });
    }

    logger.info(`Retrieved order: ${order._id}`);
    res.status(200).json(order);
});

// Update order status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { 
            status,
            updatedAt: Date.now()
        },
        { new: true, runValidators: true }
    );

    if (!order) {
        logger.warn(`Order not found for status update with id: ${req.params.id}`);
        return res.status(404).json({ message: 'Order not found' });
    }

    logger.info(`Updated order status: ${order._id} to ${status}`);
    res.status(200).json(order);
});

// Cancel order
exports.cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        logger.warn(`Order not found for cancellation with id: ${req.params.id}`);
        return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'DELIVERED') {
        logger.warn(`Cannot cancel delivered order: ${req.params.id}`);
        return res.status(400).json({ message: 'Cannot cancel delivered order' });
    }

    order.status = 'CANCELLED';
    order.cancelledAt = Date.now();
    await order.save();

    logger.info(`Cancelled order: ${order._id}`);
    res.status(200).json(order);
});

// Get order statistics
exports.getOrderStats = asyncHandler(async (req, res) => {
    const stats = await Order.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalAmount' },
                avgOrderValue: { $avg: '$totalAmount' }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    logger.info('Retrieved order statistics');
    res.status(200).json(stats);
});

// Get user order history
exports.getUserOrders = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Order.countDocuments({ userId });

    logger.info(`Retrieved order history for user: ${userId}`);
    res.status(200).json({
        orders,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalOrders: count
    });
});

// Process refund
exports.processRefund = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        logger.warn(`Order not found for refund with id: ${req.params.id}`);
        return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'CANCELLED' && order.status !== 'RETURNED') {
        logger.warn(`Invalid order status for refund: ${order.status}`);
        return res.status(400).json({ 
            message: 'Only cancelled or returned orders can be refunded' 
        });
    }

    if (order.refundStatus === 'COMPLETED') {
        logger.warn(`Order already refunded: ${req.params.id}`);
        return res.status(400).json({ message: 'Order already refunded' });
    }

    // Process refund logic here
    order.refundStatus = 'COMPLETED';
    order.refundedAt = Date.now();
    await order.save();

    logger.info(`Processed refund for order: ${order._id}`);
    res.status(200).json(order);
});

// Get daily order summary
exports.getDailyOrderSummary = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    
    const summary = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: { 
                    $dateToString: { 
                        format: "%Y-%m-%d", 
                        date: "$createdAt" 
                    }
                },
                orderCount: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
                averageOrderValue: { $avg: "$totalAmount" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    logger.info('Retrieved daily order summary');
    res.status(200).json(summary);
});
