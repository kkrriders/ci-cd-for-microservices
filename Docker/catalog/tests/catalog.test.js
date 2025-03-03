const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/index');
const Product = require('../src/models/product.model');

let mongoServer;

// Test product data
const testProduct = {
    name: "Test Laptop",
    description: "A test laptop for unit testing",
    price: 999.99,
    category: "Electronics",
    sku: "TEST-LAPTOP-001",
    stockQuantity: 10,
    imageUrl: "https://example.com/test-laptop.jpg"
};

// Setup and teardown
beforeAll(async () => {
    // Setup MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    // Clear the database before each test
    await Product.deleteMany({});
});

// Test suites
describe('Product API Endpoints', () => {
    // GET /products
    describe('GET /api/v1/catalog/products', () => {
        it('should return empty array when no products exist', async () => {
            const res = await request(app)
                .get('/api/v1/catalog/products')
                .expect(200);

            expect(res.body.products).toBeInstanceOf(Array);
            expect(res.body.products).toHaveLength(0);
        });

        it('should return all products', async () => {
            await Product.create(testProduct);

            const res = await request(app)
                .get('/api/v1/catalog/products')
                .expect(200);

            expect(res.body.products).toHaveLength(1);
            expect(res.body.products[0].name).toBe(testProduct.name);
        });
    });

    // POST /products
    describe('POST /api/v1/catalog/products', () => {
        it('should create a new product', async () => {
            const res = await request(app)
                .post('/api/v1/catalog/products')
                .send(testProduct)
                .expect(201);

            expect(res.body.name).toBe(testProduct.name);
            expect(res.body.price).toBe(testProduct.price);
        });

        it('should validate required fields', async () => {
            const invalidProduct = {
                name: "Test"
                // Missing required fields
            };

            const res = await request(app)
                .post('/api/v1/catalog/products')
                .send(invalidProduct)
                .expect(400);

            expect(res.body.status).toBe('fail');
        });
    });

    // GET /products/:id
    describe('GET /api/v1/catalog/products/:id', () => {
        it('should return a product by ID', async () => {
            const product = await Product.create(testProduct);

            const res = await request(app)
                .get(`/api/v1/catalog/products/${product._id}`)
                .expect(200);

            expect(res.body.name).toBe(testProduct.name);
        });

        it('should return 404 for non-existent product', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            
            await request(app)
                .get(`/api/v1/catalog/products/${fakeId}`)
                .expect(404);
        });
    });

    // PUT /products/:id
    describe('PUT /api/v1/catalog/products/:id', () => {
        it('should update a product', async () => {
            const product = await Product.create(testProduct);
            const update = { price: 1099.99 };

            const res = await request(app)
                .put(`/api/v1/catalog/products/${product._id}`)
                .send(update)
                .expect(200);

            expect(res.body.price).toBe(update.price);
        });
    });

    // DELETE /products/:id
    describe('DELETE /api/v1/catalog/products/:id', () => {
        it('should delete a product', async () => {
            const product = await Product.create(testProduct);

            await request(app)
                .delete(`/api/v1/catalog/products/${product._id}`)
                .expect(204);

            const deletedProduct = await Product.findById(product._id);
            expect(deletedProduct).toBeNull();
        });
    });

    // Test advanced features
    describe('Advanced Features', () => {
        // Search products
        it('should search products by query', async () => {
            await Product.create(testProduct);

            const res = await request(app)
                .get('/api/v1/catalog/search?q=laptop')
                .expect(200);

            expect(res.body).toHaveLength(1);
            expect(res.body[0].name).toContain('Laptop');
        });

        // Check availability
        it('should check product availability', async () => {
            const product = await Product.create(testProduct);

            const res = await request(app)
                .get(`/api/v1/catalog/check-availability?productId=${product._id}&quantity=5`)
                .expect(200);

            expect(res.body.available).toBe(true);
        });

        // Bulk update
        it('should perform bulk update', async () => {
            const product = await Product.create(testProduct);
            const updates = {
                updates: [{
                    id: product._id,
                    price: 899.99,
                    stockQuantity: 15
                }]
            };

            const res = await request(app)
                .post('/api/v1/catalog/bulk-update')
                .send(updates)
                .expect(200);

            expect(res.body[0].success).toBe(true);
            expect(res.body[0].product.price).toBe(899.99);
        });
    });
});
