import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import authRoutes from './routes/auth.routes.js';
import missionRoutes from './routes/mission.routes.js';
import agentRoutes from './routes/agent.routes.js';
import sseRoutes from './routes/sse.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { rateLimiter } from './middlewares/rateLimiter.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://agentflow-lyart.vercel.app'
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/stream', sseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    app.listen(PORT, () => {
      console.log(`🚀 AgentFlow server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();