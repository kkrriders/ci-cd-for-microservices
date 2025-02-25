const express = require('express');
const router = express.Router();
const { checkDatabaseHealth } = require('../config/database');
const logger = require('../config/logger');

// Basic health check
router.get('/', async (req, res) => {
    try {
        // Check database connection
        const dbHealth = await checkDatabaseHealth();
        
        // Get system metrics
        const healthInfo = {
            status: 'OK',
            timestamp: new Date(),
            service: 'Catalog Service',
            version: process.env.npm_package_version || '1.0.0',
            uptime: process.uptime(),
            database: dbHealth,
            memory: {
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
                rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB'
            },
            cpu: {
                cores: require('os').cpus().length,
                loadAvg: require('os').loadavg()
            }
        };

        // Send response based on database health
        if (dbHealth.status === 'connected') {
            res.json(healthInfo);
        } else {
            logger.warn('Database not fully healthy:', dbHealth);
            res.status(503).json({
                ...healthInfo,
                status: 'Degraded',
                message: 'Database connection issues'
            });
        }

    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(500).json({
            status: 'ERROR',
            timestamp: new Date(),
            message: 'Health check failed',
            error: error.message
        });
    }
});

// Detailed health check for internal use
router.get('/detailed', async (req, res) => {
    try {
        const dbHealth = await checkDatabaseHealth();
        
        const detailedHealth = {
            status: 'OK',
            timestamp: new Date(),
            service: {
                name: 'Catalog Service',
                version: process.env.npm_package_version || '1.0.0',
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch
            },
            uptime: {
                seconds: process.uptime(),
                formatted: formatUptime(process.uptime())
            },
            database: dbHealth,
            memory: {
                heapTotal: formatBytes(process.memoryUsage().heapTotal),
                heapUsed: formatBytes(process.memoryUsage().heapUsed),
                rss: formatBytes(process.memoryUsage().rss),
                external: formatBytes(process.memoryUsage().external)
            },
            cpu: {
                cores: require('os').cpus().length,
                model: require('os').cpus()[0].model,
                loadAvg: require('os').loadavg(),
                freeMemory: formatBytes(require('os').freemem()),
                totalMemory: formatBytes(require('os').totalmem())
            },
            environment: process.env.NODE_ENV
        };

        res.json(detailedHealth);

    } catch (error) {
        logger.error('Detailed health check failed:', error);
        res.status(500).json({
            status: 'ERROR',
            timestamp: new Date(),
            message: 'Detailed health check failed',
            error: error.message
        });
    }
});

// Liveness probe for Kubernetes
router.get('/liveness', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date()
    });
});

// Readiness probe for Kubernetes
router.get('/readiness', async (req, res) => {
    try {
        const dbHealth = await checkDatabaseHealth();
        
        if (dbHealth.status === 'connected') {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date(),
                database: 'connected'
            });
        } else {
            res.status(503).json({
                status: 'NOT_READY',
                timestamp: new Date(),
                database: dbHealth.status
            });
        }
    } catch (error) {
        res.status(503).json({
            status: 'NOT_READY',
            timestamp: new Date(),
            error: error.message
        });
    }
});

// Helper function to format uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}

// Helper function to format bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = router; 