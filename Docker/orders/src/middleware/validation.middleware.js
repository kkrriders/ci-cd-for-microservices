const { body, param, query, validationResult } = require('express-validator');
const logger = require('../config/logger');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation error:', errors.array());
        return res.status(400).json({
            status: 'fail',
            errors: errors.array()
        });
    }
    next();
};

// Order validation rules
const orderValidationRules = {
    // Create order validation
    createOrder: [
        body('userId')
            .notEmpty()
            .withMessage('User ID is required')
            .isMongoId()
            .withMessage('Invalid user ID'),

        body('items')
            .isArray()
            .withMessage('Items must be an array')
            .notEmpty()
            .withMessage('Order must contain at least one item'),

        body('items.*.productId')
            .notEmpty()
            .withMessage('Product ID is required')
            .isMongoId()
            .withMessage('Invalid product ID'),

        body('items.*.quantity')
            .notEmpty()
            .withMessage('Quantity is required')
            .isInt({ min: 1 })
            .withMessage('Quantity must be at least 1'),

        body('items.*.price')
            .notEmpty()
            .withMessage('Price is required')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),

        body('shippingAddress')
            .notEmpty()
            .withMessage('Shipping address is required')
            .isObject()
            .withMessage('Shipping address must be an object'),

        body('shippingAddress.street')
            .notEmpty()
            .withMessage('Street is required')
            .isString()
            .trim(),

        body('shippingAddress.city')
            .notEmpty()
            .withMessage('City is required')
            .isString()
            .trim(),

        body('shippingAddress.state')
            .notEmpty()
            .withMessage('State is required')
            .isString()
            .trim(),

        body('shippingAddress.zipCode')
            .notEmpty()
            .withMessage('Zip code is required')
            .matches(/^\d{5}(-\d{4})?$/)
            .withMessage('Invalid zip code format'),

        body('totalAmount')
            .notEmpty()
            .withMessage('Total amount is required')
            .isFloat({ min: 0 })
            .withMessage('Total amount must be a positive number'),

        body('paymentMethod')
            .notEmpty()
            .withMessage('Payment method is required')
            .isIn(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'CASH'])
            .withMessage('Invalid payment method'),

        handleValidationErrors
    ],

    // Update order status validation
    updateOrderStatus: [
        param('id')
            .isMongoId()
            .withMessage('Invalid order ID'),

        body('status')
            .notEmpty()
            .withMessage('Status is required')
            .isIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'])
            .withMessage('Invalid order status'),

        handleValidationErrors
    ],

    // Get order validation
    getOrder: [
        param('id')
            .isMongoId()
            .withMessage('Invalid order ID'),
        handleValidationErrors
    ],

    // Get user orders validation
    getUserOrders: [
        param('userId')
            .isMongoId()
            .withMessage('Invalid user ID'),

        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),

        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),

        handleValidationErrors
    ],

    // Query validation for get all orders
    queryValidation: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),

        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),

        query('status')
            .optional()
            .isIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'])
            .withMessage('Invalid order status'),

        query('startDate')
            .optional()
            .isISO8601()
            .withMessage('Invalid start date format'),

        query('endDate')
            .optional()
            .isISO8601()
            .withMessage('Invalid end date format')
            .custom((endDate, { req }) => {
                if (req.query.startDate && new Date(endDate) <= new Date(req.query.startDate)) {
                    throw new Error('End date must be after start date');
                }
                return true;
            }),

        handleValidationErrors
    ],

    // Process refund validation
    processRefund: [
        param('id')
            .isMongoId()
            .withMessage('Invalid order ID'),

        handleValidationErrors
    ],

    // Daily order summary validation
    dailyOrderSummary: [
        query('startDate')
            .notEmpty()
            .withMessage('Start date is required')
            .isISO8601()
            .withMessage('Invalid start date format'),

        query('endDate')
            .notEmpty()
            .withMessage('End date is required')
            .isISO8601()
            .withMessage('Invalid end date format')
            .custom((endDate, { req }) => {
                if (new Date(endDate) <= new Date(req.query.startDate)) {
                    throw new Error('End date must be after start date');
                }
                return true;
            }),

        handleValidationErrors
    ]
};

module.exports = orderValidationRules;
