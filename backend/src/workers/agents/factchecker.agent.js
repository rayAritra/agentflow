import { streamCompletion } from '../../services/ai.service.js';
import { broadcastToMission } from '../../controllers/sse.controller.js';

export const runFactCheckerAgent = async (missionId, prompt, analyzerOutput) => {
  broadcastToMission(missionId, 'agent_start', { agent: 'factChecker' });

  const systemPrompt = `You are a rigorous Fact Checker agent. Your job is to review the analysis provided by the Analyzer Agent and ensure there are no contradictions, logical fallacies, or obvious hallucinations based on the context provided.
  If you spot issues, call them out. If it looks solid, confirm it. Output a clean set of verified claims.`;

  const userPrompt = `User Request: ${prompt}\n\nAnalyzer Output:\n${analyzerOutput}\n\nReview and verify this analysis.`;

  let agentOutput = '';
  
  await streamCompletion(userPrompt, systemPrompt, (token) => {
    agentOutput += token;
    broadcastToMission(missionId, 'agent_token', { agent: 'factChecker', token });
  });

  broadcastToMission(missionId, 'agent_done', { agent: 'factChecker' });
  return agentOutput;
};
