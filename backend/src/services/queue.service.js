import { Queue, Worker } from 'bullmq';
import connection from '../config/redis.js';
// We'll import the worker logic later, or we start it here
// Actually we will create a dedicated orchestrator worker file and start it in server.js or explicitly.

export const missionQueue = new Queue('missionQueue', { connection });

export const queueMission = async (missionData) => {
  return await missionQueue.add('runMission', missionData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
    jobId: missionData.missionId // Tie jobId directly to missionId
  });
};
