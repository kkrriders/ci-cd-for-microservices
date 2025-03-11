const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Redis = require('redis');
const logger = require('../config/logger');
const { version, name } = require('../../package.json');
const os = require('os');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get overall service health
 *     description: Returns the overall health status of the service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: 
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: orders-service
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *       503:
 *         description: Service is unhealthy
 */
router.get('/', async (req, res) => {
  try {
    // Basic health check - if this endpoint is reachable, the service is running
    res.json({
      status: 'ok',
      service: name,
      version,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      message: 'Service health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /health/liveness:
 *   get:
 *     summary: Service liveness check
 *     description: Verifies that the service is running and can respond to requests
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 *       503:
 *         description: Service is not alive
 */
router.get('/liveness', (req, res) => {
  // Liveness just checks if the service is running
  res.json({
    status: 'ok',
    message: 'Service is alive',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /health/readiness:
 *   get:
 *     summary: Service readiness check
 *     description: Verifies that the service is ready to accept requests by checking database and cache connections
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/readiness', async (req, res) => {
  // Check MongoDB connection
  let mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  // Initialize Redis status as disconnected
  let redisStatus = 'disconnected';
  
  // Try to create a new Redis client and check connection
  try {
    const redisClient = Redis.createClient({
      url: process.env.REDIS_URI
    });
    
    await redisClient.connect();
    redisStatus = 'connected';
    await redisClient.quit();
  } catch (error) {
    logger.error('Redis readiness check failed:', error);
    redisStatus = 'error';
  }
  
  // Check if all dependencies are ready
  const isReady = mongoStatus === 'connected' && redisStatus === 'connected';
  
  if (isReady) {
    res.json({
      status: 'ok',
      message: 'Service is ready',
      dependencies: {
        mongodb: mongoStatus,
        redis: redisStatus
      },
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'error',
      message: 'Service is not ready',
      dependencies: {
        mongodb: mongoStatus,
        redis: redisStatus
      },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /health/details:
 *   get:
 *     summary: Detailed service health
 *     description: Returns detailed information about the service health and its dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 */
router.get('/details', async (req, res) => {
  // Gather system information
  const systemInfo = {
    uptime: process.uptime(),
    platform: process.platform,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    hostname: os.hostname(),
    freeMemory: os.freemem(),
    totalMemory: os.totalmem(),
    cpus: os.cpus().length
  };
  
  // Check MongoDB status
  const mongoStatus = {
    connected: mongoose.connection.readyState === 1,
    host: process.env.MONGO_HOST || 'unknown',
    database: process.env.MONGO_DB_NAME || 'orders'
  };
  
  // Initialize Redis status
  let redisStatus = { connected: false };
  
  // Try to create a new Redis client and check connection
  try {
    const redisClient = Redis.createClient({
      url: process.env.REDIS_URI
    });
    
    await redisClient.connect();
    redisStatus = {
      connected: true,
      host: process.env.REDIS_HOST || 'unknown',
      port: process.env.REDIS_PORT || '6379'
    };
    await redisClient.quit();
  } catch (error) {
    logger.error('Redis detailed health check failed:', error);
    redisStatus = {
      connected: false,
      error: error.message
    };
  }
  
  // Return detailed health information
  res.json({
    status: 'ok',
    service: name,
    version,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    system: systemInfo,
    dependencies: {
      mongodb: mongoStatus,
      redis: redisStatus
    }
  });
});

module.exports = router; 