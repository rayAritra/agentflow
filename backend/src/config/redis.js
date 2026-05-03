import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  tls: {},
};

// BullMQ uses ioredis
const connection = new Redis(redisConfig);

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

connection.on('connect', () => {
  console.log('Connected to Upstash Redis');
});

// Map to store active SSE connections
// Key: missionId, Value: Set of Express response objects
export const sseClients = new Map();

export default connection;
