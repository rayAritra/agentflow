import { streamCompletion } from '../../services/ai.service.js';
import { broadcastToMission } from '../../controllers/sse.controller.js';

export const runWriterAgent = async (missionId, prompt, factCheckerOutput) => {
  broadcastToMission(missionId, 'agent_start', { agent: 'writer' });

  const systemPrompt = `You are an expert Writer and Editor agent. Your job is to take the verified claims from the Fact Checker and write a comprehensive, polished, and highly professional Markdown report.
  The report should be directly answering the user's prompt. Use excellent formatting, headings, bullet points, and bold text where appropriate.
  Ensure the tone is authoritative and clear.`;

  const userPrompt = `User Request: ${prompt}\n\nVerified Claims:\n${factCheckerOutput}\n\nWrite the final markdown report.`;

  let agentOutput = '';
  
  await streamCompletion(userPrompt, systemPrompt, (token) => {
    agentOutput += token;
    broadcastToMission(missionId, 'agent_token', { agent: 'writer', token });
  });

  broadcastToMission(missionId, 'agent_done', { agent: 'writer' });
  return agentOutput;
};
