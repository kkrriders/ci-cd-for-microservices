const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');

// Basic CRUD routes
router.get('/products', catalogController.getAllProducts);
router.get('/products/:id', catalogController.getProductById);
router.post('/products', catalogController.createProduct);
router.put('/products/:id', catalogController.updateProduct);
router.delete('/products/:id', catalogController.deleteProduct);

// Advanced feature routes
router.get('/search', catalogController.searchProducts);
router.get('/stats', catalogController.getProductStats);
router.post('/bulk-update', catalogController.bulkUpdateProducts);
router.get('/check-availability', catalogController.checkAvailability);

module.exports = router;
