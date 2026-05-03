import { Worker } from 'bullmq';
import connection from '../config/redis.js';
import Mission from '../models/Mission.model.js';
import { runScraperAgent } from './agents/scraper.agent.js';
import { runAnalyzerAgent } from './agents/analyzer.agent.js';
import { runFactCheckerAgent } from './agents/factchecker.agent.js';
import { runWriterAgent } from './agents/writer.agent.js';
import { broadcastToMission } from '../controllers/sse.controller.js';
import connectDB from '../config/db.js';

// We need to ensure DB is connected in case the worker runs in a separate process, 
// though here we run it in the same process, it's safe to call.
connectDB();

export const orchestratorWorker = new Worker(
  'missionQueue',
  async (job) => {
    const { missionId, prompt, urls } = job.data;

    try {
      // 1. Update Mission Status
      const mission = await Mission.findById(missionId);
      if (!mission) throw new Error('Mission not found');
      
      mission.status = 'running';
      await mission.save();

      // Broadcast start
      broadcastToMission(missionId, 'mission_start', { status: 'running' });

      // 2. Run Scraper
      mission.agents.scraper.status = 'running';
      mission.agents.scraper.startedAt = new Date();
      await mission.save();
      const scraperOutput = await runScraperAgent(missionId, prompt, urls);
      mission.agents.scraper.status = 'done';
      mission.agents.scraper.output = scraperOutput;
      mission.agents.scraper.completedAt = new Date();
      await mission.save();

      // 3. Run Analyzer
      mission.agents.analyzer.status = 'running';
      mission.agents.analyzer.startedAt = new Date();
      await mission.save();
      const analyzerOutput = await runAnalyzerAgent(missionId, prompt, scraperOutput);
      mission.agents.analyzer.status = 'done';
      mission.agents.analyzer.output = analyzerOutput;
      mission.agents.analyzer.completedAt = new Date();
      await mission.save();

      // 4. Run FactChecker
      mission.agents.factChecker.status = 'running';
      mission.agents.factChecker.startedAt = new Date();
      await mission.save();
      const factCheckerOutput = await runFactCheckerAgent(missionId, prompt, analyzerOutput);
      mission.agents.factChecker.status = 'done';
      mission.agents.factChecker.output = factCheckerOutput;
      mission.agents.factChecker.completedAt = new Date();
      await mission.save();

      // 5. Run Writer
      mission.agents.writer.status = 'running';
      mission.agents.writer.startedAt = new Date();
      await mission.save();
      const finalReport = await runWriterAgent(missionId, prompt, factCheckerOutput);
      mission.agents.writer.status = 'done';
      mission.agents.writer.output = finalReport;
      mission.agents.writer.completedAt = new Date();
      
      // Complete Mission
      mission.status = 'completed';
      mission.finalReport = finalReport;
      await mission.save();

      broadcastToMission(missionId, 'mission_complete', { finalReport });

    } catch (error) {
      console.error(`Mission ${missionId} failed:`, error);
      const mission = await Mission.findById(missionId);
      if (mission) {
        mission.status = 'failed';
        mission.error = error.message;
        await mission.save();
        broadcastToMission(missionId, 'mission_failed', { error: error.message });
      }
      throw error; // Re-throw for BullMQ to handle retry
    }
  },
  {
    connection,
    concurrency: 2, // Keep concurrency low for free tier Upstash Redis
  }
);

orchestratorWorker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed!`);
});

orchestratorWorker.on('failed', (job, err) => {
  console.log(`Job ${job.id} has failed with ${err.message}`);
});
