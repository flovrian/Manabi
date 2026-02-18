import { createClient } from 'redis';
import dotenv = require("dotenv");

dotenv.config();

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port:  Number.parseInt(process.env.REDIS_PORT || '6379', 10),
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect()
    .then(() => console.log('Successfully connected to Redis cache.'))
    .catch(err => console.error('Redis connection failed', err));
export default redisClient;
