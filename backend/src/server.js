import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import missionRoutes from './routes/mission.routes.js';
import sseRoutes from './routes/sse.routes.js';
import agentRoutes from './routes/agent.routes.js';

// Load env vars
dotenv.config();

// Initialize worker
import './workers/orchestrator.worker.js';

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Apply rate limiting to all requests
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/sse', sseRoutes);
app.use('/api/agents', agentRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('AgentFlow API is running');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
