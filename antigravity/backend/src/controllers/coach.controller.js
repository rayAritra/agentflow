import CoachChat from '../models/CoachChat.model.js';
import Workout from '../models/Workout.model.js';
import { streamCompletion } from '../services/ai.service.js';
import { computeStreak, getPersonalRecords, getMuscleGroupBreakdown } from '../services/stats.service.js';
import User from '../models/User.model.js';

export const getChatHistory = async (req, res) => {
  try {
    let chat = await CoachChat.findOne({ user: req.user.id });
    if (!chat) {
      chat = await CoachChat.create({ user: req.user.id, messages: [] });
    }
    res.status(200).json({ success: true, data: chat.messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const streamCoachResponse = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  // Ensure chat exists and add user message
  let chat = await CoachChat.findOne({ user: userId });
  if (!chat) {
    chat = new CoachChat({ user: userId, messages: [] });
  }
  chat.messages.push({ role: 'user', content: message });
  await chat.save();

  // Prepare context data for AI
  try {
    const workouts = await Workout.find({ user: userId, isTemplate: false })
      .sort({ date: -1 })
      .limit(30)
      .populate('exercises.exercise');
      
    const streak = await computeStreak(userId);
    const prs = await getPersonalRecords(userId);
    const muscleBreakdown = await getMuscleGroupBreakdown(userId, 30);
    const user = await User.findById(userId);

    const systemPrompt = `You are AntiGravity Coach, an expert personal trainer and sports scientist.
You have access to the user's complete workout history. Give specific, data-driven advice.
Reference their actual numbers. Be highly encouraging, athletic, and direct.

USER CONTEXT:
Name: ${user.name}
Current Streak: ${streak} days
Muscle Focus (Last 30 days): ${JSON.stringify(muscleBreakdown)}
Recent Workouts summary: User has done ${workouts.length} workouts recently. 
Top PRs (Personal Records): ${prs.slice(0, 5).map(pr => `${pr.name}: ${pr.maxWeight}`).join(', ')}

Keep your responses concise, highly relevant to their data, and formatting in Markdown.`;

    // Map DB messages to API format
    const apiMessages = chat.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // Setup SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    let fullResponse = '';

    await streamCompletion(apiMessages, systemPrompt, (token) => {
      res.write(`data: ${JSON.stringify({ type: 'token', token })}\n\n`);
      fullResponse += token;
    });

    // Save assistant response
    chat.messages.push({ role: 'assistant', content: fullResponse });
    await chat.save();

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error(error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
};
