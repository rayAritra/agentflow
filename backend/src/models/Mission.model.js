import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['idle', 'running', 'done', 'failed'],
    default: 'idle',
  },
  output: {
    type: String,
    default: '',
  },
  startedAt: Date,
  completedAt: Date,
});

const missionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    urls: {
      type: [String],
      default: [],
    },
    jobId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending',
    },
    agents: {
      scraper: { type: agentSchema, default: () => ({}) },
      analyzer: { type: agentSchema, default: () => ({}) },
      factChecker: { type: agentSchema, default: () => ({}) },
      writer: { type: agentSchema, default: () => ({}) },
    },
    finalReport: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Mission = mongoose.model('Mission', missionSchema);
export default Mission;
