import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const streamCompletion = async (messages, systemPrompt, onToken) => {
  try {
    // Add system prompt to messages
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const stream = await groq.chat.completions.create({
      messages: groqMessages,
      model: 'llama-3.3-70b-versatile',
      stream: true,
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;
      if (content) {
        onToken(content);
      }
    }
    return fullContent;
  } catch (error) {
    console.error('Groq API Error, falling back to Gemini:', error.message);
    
    try {
      // Gemini format conversion
      let chatContent = `System: ${systemPrompt}\n\n`;
      messages.forEach(m => {
        chatContent += `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}\n`;
      });

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: chatContent }] }
        ],
      });

      let fullContent = '';
      for await (const chunk of responseStream) {
         const content = chunk.text;
         fullContent += content;
         if (content) {
           onToken(content);
         }
      }
      return fullContent;
    } catch (geminiError) {
      console.error('Gemini Fallback Error:', geminiError.message);
      throw new Error('Both Groq and Gemini APIs failed.');
    }
  }
};
