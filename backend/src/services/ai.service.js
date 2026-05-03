import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const streamCompletion = async (prompt, systemPrompt, onToken) => {
  try {
    // Try Groq First (Llama 3.3 70B)
    const stream = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
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
    
    // Fallback to Gemini 1.5 Flash
    try {
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `System: ${systemPrompt}\n\nUser: ${prompt}` }] }
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

export const getCompletion = async (prompt, systemPrompt) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.3-70b-versatile',
    });
    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq getCompletion Error, falling back to Gemini:', error.message);
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `System: ${systemPrompt}\n\nUser: ${prompt}` }] }
        ],
    });
    return response.text;
  }
};
