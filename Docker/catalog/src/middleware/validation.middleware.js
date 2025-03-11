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

// Product validation rules
const productValidationRules = {
    // Create product validation
    createProduct: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Product name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Product name must be between 2 and 100 characters'),
        
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Product description is required')
            .isLength({ min: 10, max: 1000 })
            .withMessage('Description must be between 10 and 1000 characters'),
        
        body('price')
            .notEmpty()
            .withMessage('Price is required')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        
        body('category')
            .trim()
            .notEmpty()
            .withMessage('Category is required')
            .isIn(['Electronics', 'Books', 'Clothing', 'Food', 'Other'])
            .withMessage('Invalid category'),
        
        body('stockQuantity')
            .notEmpty()
            .withMessage('Stock quantity is required')
            .isInt({ min: 0 })
            .withMessage('Stock quantity must be a positive integer'),
        
        body('sku')
            .trim()
            .notEmpty()
            .withMessage('SKU is required')
            .matches(/^[A-Za-z0-9-]+$/)
            .withMessage('SKU must contain only letters, numbers, and hyphens'),
        
        handleValidationErrors
    ],

    // Update product validation
    updateProduct: [
        param('id')
            .isMongoId()
            .withMessage('Invalid product ID'),
        
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Product name must be between 2 and 100 characters'),
        
        body('description')
            .optional()
            .trim()
            .isLength({ min: 10, max: 1000 })
            .withMessage('Description must be between 10 and 1000 characters'),
        
        body('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        
        body('category')
            .optional()
            .trim()
            .isIn(['Electronics', 'Books', 'Clothing', 'Food', 'Other'])
            .withMessage('Invalid category'),
        
        body('stockQuantity')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Stock quantity must be a positive integer'),
        
        handleValidationErrors
    ],

    // Get product validation
    getProduct: [
        param('id')
            .isMongoId()
            .withMessage('Invalid product ID'),
        handleValidationErrors
    ],

    // Query validation for get all products
    queryValidation: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        
        query('minPrice')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Minimum price must be a positive number'),
        
        query('maxPrice')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Maximum price must be a positive number')
            .custom((maxPrice, { req }) => {
                const minPrice = req.query.minPrice;
                if (minPrice && Number(maxPrice) <= Number(minPrice)) {
                    throw new Error('Maximum price must be greater than minimum price');
                }
                return true;
            }),
        
        handleValidationErrors
    ],

    // Bulk update validation
    bulkUpdate: [
        body('updates')
            .isArray()
            .withMessage('Updates must be an array')
            .notEmpty()
            .withMessage('Updates array cannot be empty'),
        
        body('updates.*.id')
            .isMongoId()
            .withMessage('Invalid product ID in updates'),
        
        body('updates.*.price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        
        body('updates.*.stockQuantity')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Stock quantity must be a positive integer'),
        
        handleValidationErrors
    ],

    // Availability check validation
    checkAvailability: [
        query('productId')
            .isMongoId()
            .withMessage('Invalid product ID'),
        
        query('quantity')
            .isInt({ min: 1 })
            .withMessage('Quantity must be a positive integer'),
        
        handleValidationErrors
    ]
};

module.exports = productValidationRules;