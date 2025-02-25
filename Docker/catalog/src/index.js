require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('redis');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { connectDB, createIndexes } = require('./config/database');
const logger = require('./config/logger');
const healthRoutes = require('./routes/health.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 8082;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use('/api/v1/catalog', require('./routes/catalog.routes'));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Redis Client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URI
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('📦 Connected to Redis'));

(async () => {
  await redisClient.connect();
})();

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Catalog Service' });
});

// Health check routes
app.use('/health', healthRoutes);

// Initialize database and start server
const initializeApp = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Create database indexes
        await createIndexes();

        // Start the server
        app.listen(PORT, () => {
            logger.info(`🚀 Catalog Service running on port ${PORT}`);
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