const Product = require('../models/product.model');
const logger = require('../config/logger');
const asyncHandler = require('express-async-handler');

// Get all products with pagination and filtering
exports.getAllProducts = asyncHandler(async (req, res) => {
    const { 
        page = 1, 
        limit = 10, 
        category, 
        minPrice, 
        maxPrice, 
        sortBy = 'createdAt',
        order = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    const products = await Product.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Product.countDocuments(query);

    logger.info(`Retrieved ${products.length} products`);
    
    res.status(200).json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalProducts: count
    });
});

// Get single product by ID
exports.getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        logger.warn(`Product not found with id: ${req.params.id}`);
        return res.status(404).json({ message: 'Product not found' });
    }

    logger.info(`Retrieved product: ${product._id}`);
    res.status(200).json(product);
});

// Create new product
exports.createProduct = asyncHandler(async (req, res) => {
    const product = new Product(req.body);
    
    const savedProduct = await product.save();
    logger.info(`Created new product: ${savedProduct._id}`);
    
    res.status(201).json(savedProduct);
});

// Update product
exports.updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!product) {
        logger.warn(`Product not found for update with id: ${req.params.id}`);
        return res.status(404).json({ message: 'Product not found' });
    }

    logger.info(`Updated product: ${product._id}`);
    res.status(200).json(product);
});

// Delete product
exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        logger.warn(`Product not found for deletion with id: ${req.params.id}`);
        return res.status(404).json({ message: 'Product not found' });
    }

    logger.info(`Deleted product: ${req.params.id}`);
    res.status(204).send();
});

// Search products
exports.searchProducts = asyncHandler(async (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    const products = await Product.find({
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
        ]
    });

    logger.info(`Search query "${q}" returned ${products.length} results`);
    res.status(200).json(products);
});

// Get product statistics
exports.getProductStats = asyncHandler(async (req, res) => {
    const stats = await Product.aggregate([
        {
            $group: {
                _id: '$category',
                totalProducts: { $sum: 1 },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                totalStock: { $sum: '$stockQuantity' }
            }
        },
        { $sort: { totalProducts: -1 } }
    ]);

    logger.info('Retrieved product statistics');
    res.status(200).json(stats);
});

// Bulk update products
exports.bulkUpdateProducts = asyncHandler(async (req, res) => {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
        return res.status(400).json({ message: 'Updates must be an array' });
    }

    const results = await Promise.all(
        updates.map(async (update) => {
            try {
                const product = await Product.findByIdAndUpdate(
                    update._id,
                    update,
                    { new: true, runValidators: true }
                );
                return {
                    _id: update._id,
                    success: true,
                    product
                };
            } catch (error) {
                return {
                    _id: update._id,
                    success: false,
                    error: error.message
                };
            }
        })
    );

    logger.info(`Bulk updated ${results.filter(r => r.success).length} products`);
    res.status(200).json(results);
});

// Check product availability
exports.checkAvailability = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.query;

    if (!productId || !quantity) {
        return res.status(400).json({ 
            message: 'Product ID and quantity are required' 
        });
    }

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const available = product.stockQuantity >= Number(quantity);
    
    res.status(200).json({
        available,
        stockQuantity: product.stockQuantity,
        requestedQuantity: Number(quantity)
    });
});