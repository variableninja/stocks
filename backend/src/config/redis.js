const redis = require('redis');
const { loadEnv } = require('./env');

const env = loadEnv();

const redisClient = redis.createClient({
  url: env.REDIS_URL
});

let isConnected = false;

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
  isConnected = false;
});

redisClient.on('connect', () => {
  isConnected = true;
});

redisClient.on('disconnect', () => {
  isConnected = false;
});

redisClient.connect().catch((err) => {
  console.error('Could not connect to Redis', err);
  isConnected = false;
});

const ensureConnection = async () => {
  if (!isConnected || !redisClient.isOpen) {
    throw new Error('Redis not connected');
  }
  return redisClient;
};

module.exports = { redisClient, ensureConnection, isConnected: () => isConnected };