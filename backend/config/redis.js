const Redis = require('ioredis');
require('dotenv').config();

let redis = null;

const connectRedis = () => {
    try {
        redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            retryStrategy: (times) => {
                if (times > 3) {
                    console.log('⚠️ Redis connection failed, running without cache');
                    return null;
                }
                return Math.min(times * 200, 2000);
            },
        });

        redis.on('connect', () => {
            console.log('✅ Redis connected successfully');
        });

        redis.on('error', (err) => {
            console.log('⚠️ Redis error:', err.message);
        });
    } catch (error) {
        console.log('⚠️ Redis not available, running without cache');
    }
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };
