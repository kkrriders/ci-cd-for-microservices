require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('redis');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 8082;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Catalog Service running on port ${PORT}`);
});