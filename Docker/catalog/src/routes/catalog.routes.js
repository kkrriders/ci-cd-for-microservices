const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');
const productValidationRules = require('../middleware/validation.middleware');

// Apply validation rules to routes
router.get('/products', productValidationRules.queryValidation, catalogController.getAllProducts);
router.get('/products/:id', productValidationRules.getProduct, catalogController.getProductById);
router.post('/products', productValidationRules.createProduct, catalogController.createProduct);
router.put('/products/:id', productValidationRules.updateProduct, catalogController.updateProduct);
router.delete('/products/:id', productValidationRules.getProduct, catalogController.deleteProduct);

// Advanced feature routes with validation
router.get('/check-availability', productValidationRules.checkAvailability, catalogController.checkAvailability);
router.post('/bulk-update', productValidationRules.bulkUpdate, catalogController.bulkUpdateProducts);

module.exports = router;
