import { streamCompletion } from '../../services/ai.service.js';
import { broadcastToMission } from '../../controllers/sse.controller.js';

export const runAnalyzerAgent = async (missionId, prompt, scraperOutput) => {
  broadcastToMission(missionId, 'agent_start', { agent: 'analyzer' });

  const systemPrompt = `You are an expert Data Analyzer agent. Your job is to take raw notes from the Scraper Agent and analyze them based on the user's original request.
  Identify trends, pros/cons, pricing differences, or any strategic insights. Organize the raw data into a coherent analytical summary. Do not write a final report, just the analysis.`;

  const userPrompt = `User Request: ${prompt}\n\nScraper Agent Notes:\n${scraperOutput}\n\nAnalyze this data.`;

  let agentOutput = '';
  
  await streamCompletion(userPrompt, systemPrompt, (token) => {
    agentOutput += token;
    broadcastToMission(missionId, 'agent_token', { agent: 'analyzer', token });
  });

  broadcastToMission(missionId, 'agent_done', { agent: 'analyzer' });
  return agentOutput;
};
