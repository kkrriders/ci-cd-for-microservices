require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Redis = require("redis");
const logger = require('./config/logger'); // Import logger
const orderRoutes = require('./routes/order.routes'); // Import order routes
const { connectDB } = require('./config/database'); // Import database connection function
const { errorHandler } = require('./middleware/error.middleware'); // Import error handler
const helmet = require('helmet'); // Import Helmet for security
const compression = require('compression'); // Import compression for response compression
const cors = require('cors'); // Import CORS for cross-origin requests
const rateLimit = require('express-rate-limit'); // Import rate limiting
const healthRoutes = require('./routes/health.routes');

const app = express();
const PORT = process.env.PORT || 8083;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(helmet()); // Use Helmet for security
app.use(compression()); // Use compression for response bodies
app.use(cors()); // Enable CORS
app.use(limiter); // Apply rate limiting

// MongoDB Connection
connectDB()
    .then(() => logger.info("📦 Connected to orders MongoDB"))
    .catch((err) => logger.error("❌ MongoDB Connection Error:", err));

// Redis Client
const redisClient = Redis.createClient({
    url: process.env.REDIS_URI
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('📦 Connected to Redis'));

(async () => {
    await redisClient.connect();
})();

// Define Orders Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    customerName: String,
    items: [{
      product: String,
      quantity: Number,
      price: Number
    }],
    totalAmount: Number,
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "orders_db" }
);

const Order = mongoose.model("Order", orderSchema);

// Define base route
app.get("/", (req, res) => {
    res.json({ message: 'Welcome to Orders Service' });
});

// Use order routes
app.use('/api/v1/orders', orderRoutes);

// Health check routes
app.use('/health', healthRoutes);

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
const initializeApp = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Start the server
        app.listen(PORT, () => {
            logger.info(`🚀 Orders Service running on port ${PORT}`);
            logger.info(`Health check available at http://localhost:${PORT}/health`);
        });

    } catch (error) {
        logger.error('Failed to initialize app:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    process.exit(1);
});

// Initialize the application
initializeApp();

// Export app for testing purposes
module.exports = app;
