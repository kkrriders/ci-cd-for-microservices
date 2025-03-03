const mongoose = require('mongoose');
const logger = require('./logger');

// MongoDB connection options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// MongoDB connection function
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
        
        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        // Handle MongoDB events
        mongoose.connection.on('connected', () => {
            logger.info('Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                logger.info('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                logger.error('Error during MongoDB connection closure:', err);
                process.exit(1);
            }
        });

        return conn;

    } catch (error) {
        logger.error('MongoDB connection error:', error);
        // Retry logic
        setTimeout(connectDB, 5000);
    }
};

// Function to check database health
const checkDatabaseHealth = async () => {
    try {
        const state = mongoose.connection.readyState;
        switch (state) {
            case 0:
                return { status: 'disconnected' };
            case 1:
                return { status: 'connected' };
            case 2:
                return { status: 'connecting' };
            case 3:
                return { status: 'disconnecting' };
            default:
                return { status: 'unknown' };
        }
    } catch (error) {
        logger.error('Database health check failed:', error);
        return { status: 'error', message: error.message };
    }
};

// Create indexes for better query performance
const createIndexes = async () => {
    try {
        // Get the Order model (assuming it's defined elsewhere)
        const Order = mongoose.model('Order');
        
        // Create indexes
        await Promise.all([
            Order.collection.createIndex({ "orderNumber": 1 }, { unique: true }),
            Order.collection.createIndex({ "userId": 1 }),
            Order.collection.createIndex({ "status": 1 }),
            Order.collection.createIndex({ "createdAt": 1 }),
            Order.collection.createIndex({ "totalAmount": 1 })
        ]);

        logger.info('Database indexes created successfully');
    } catch (error) {
        logger.error('Error creating database indexes:', error);
    }
};

module.exports = {
    connectDB,
    checkDatabaseHealth,
    createIndexes
};
