import { create } from 'zustand';
import api from '../services/api.service';

export const useCoachStore = create((set, get) => ({
  messages: [],
  isStreaming: false,
  streamingText: '',
  eventSource: null,

  setMessages: (messages) => set({ messages }),

  sendMessage: async (text) => {
    // Add user message immediately
    const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    set((state) => ({ 
      messages: [...state.messages, userMessage],
      isStreaming: true,
      streamingText: ''
    }));

    try {
      // Initiate SSE stream request via fetch because EventSource doesn't support body natively for POST
      // We'll use the native EventSource approach by passing token if we wanted GET, 
      // but for POST we need fetch and process stream manually or just use a custom SSE handler.
      // Actually, standard fetch works great for streaming.
      
      const token = localStorage.getItem('antigravity-auth') 
        ? JSON.parse(localStorage.getItem('antigravity-auth'))?.state?.token 
        : null;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/coach/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              
              if (data.type === 'token') {
                set((state) => ({ streamingText: state.streamingText + data.token }));
              } else if (data.type === 'done') {
                // Done streaming
                set((state) => ({
                  messages: [...state.messages, { role: 'assistant', content: state.streamingText, timestamp: new Date().toISOString() }],
                  isStreaming: false,
                  streamingText: ''
                }));
              } else if (data.type === 'error') {
                console.error('Coach stream error:', data.message);
                set({ isStreaming: false });
              }
            } catch (e) {
              // chunk split edge cases
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      set({ isStreaming: false });
    }
  },

  loadHistory: async () => {
    try {
      const { data } = await api.get('/coach/history');
      set({ messages: data.data || [] });
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }
}));
