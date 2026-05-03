import { scrapeMultiple } from '../../services/scraper.service.js';
import { streamCompletion } from '../../services/ai.service.js';
import { broadcastToMission } from '../../controllers/sse.controller.js';

export const runScraperAgent = async (missionId, prompt, urls) => {
  broadcastToMission(missionId, 'agent_start', { agent: 'scraper' });

  let rawData = '';
  if (urls && urls.length > 0) {
    // If URLs provided, scrape them
    rawData = await scrapeMultiple(urls);
  } else {
    // If no URLs, the scraper acts as an initial researcher
    rawData = "No URLs provided. Proceeding with general knowledge retrieval.";
  }

  const systemPrompt = `You are an expert web researcher and scraper agent. Your job is to take the user's prompt and any scraped raw data, and extract all relevant raw facts, numbers, statements, and details that pertain to the user's request. 
  Do not write a final report. Just output structured, detailed notes.`;

  const userPrompt = `User Request: ${prompt}\n\nScraped Data:\n${rawData}\n\nExtract the key information.`;

  let agentOutput = '';
  
  await streamCompletion(userPrompt, systemPrompt, (token) => {
    agentOutput += token;
    broadcastToMission(missionId, 'agent_token', { agent: 'scraper', token });
  });

  broadcastToMission(missionId, 'agent_done', { agent: 'scraper' });
  return agentOutput;
};
