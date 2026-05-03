import { create } from 'zustand';

const initialAgentStreams = {
  scraper: '',
  analyzer: '',
  factChecker: '',
  writer: '',
};

const initialAgentStatuses = {
  scraper: 'idle',
  analyzer: 'idle',
  factChecker: 'idle',
  writer: 'idle',
};

export const useMissionStore = create((set, get) => ({
  activeMissionId: null,
  eventSource: null,
  agentStreams: { ...initialAgentStreams },
  agentStatuses: { ...initialAgentStatuses },
  finalReport: null,
  missionStatus: 'pending',
  error: null,

  connectToMission: (missionId) => {
    // Clean up existing connection
    const existingEs = get().eventSource;
    if (existingEs) {
      existingEs.close();
    }

    set({
      activeMissionId: missionId,
      agentStreams: { ...initialAgentStreams },
      agentStatuses: { ...initialAgentStatuses },
      finalReport: null,
      missionStatus: 'pending',
      error: null,
    });

    const es = new EventSource(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/sse/${missionId}`);

    es.onmessage = (event) => {
      // Discard heartbeat
      if (event.data === ':') return;

      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'connected':
            console.log('SSE Connected for mission', missionId);
            break;
            
          case 'mission_start':
            set({ missionStatus: 'running' });
            break;

          case 'agent_start':
            set((state) => ({
              agentStatuses: { ...state.agentStatuses, [data.agent]: 'running' }
            }));
            break;

          case 'agent_token':
            set((state) => ({
              agentStreams: {
                ...state.agentStreams,
                [data.agent]: state.agentStreams[data.agent] + data.token
              }
            }));
            break;

          case 'agent_done':
            set((state) => ({
              agentStatuses: { ...state.agentStatuses, [data.agent]: 'done' }
            }));
            break;

          case 'mission_complete':
            set({ missionStatus: 'completed', finalReport: data.finalReport });
            es.close();
            break;

          case 'mission_failed':
            set({ missionStatus: 'failed', error: data.error });
            es.close();
            break;
            
          default:
            break;
        }
      } catch (err) {
        console.error('Error parsing SSE event', err);
      }
    };

    es.onerror = (err) => {
      console.error('SSE Error', err);
      // We don't automatically close, browser tries to reconnect
    };

    set({ eventSource: es });
  },

  disconnect: () => {
    const es = get().eventSource;
    if (es) {
      es.close();
    }
    set({
      activeMissionId: null,
      eventSource: null,
    });
  },

  // Used for hydrating from db on load
  hydrateFromMission: (mission) => {
    set({
      missionStatus: mission.status,
      finalReport: mission.finalReport,
      error: mission.error,
      agentStatuses: {
        scraper: mission.agents?.scraper?.status || 'idle',
        analyzer: mission.agents?.analyzer?.status || 'idle',
        factChecker: mission.agents?.factChecker?.status || 'idle',
        writer: mission.agents?.writer?.status || 'idle',
      },
      agentStreams: {
        scraper: mission.agents?.scraper?.output || '',
        analyzer: mission.agents?.analyzer?.output || '',
        factChecker: mission.agents?.factChecker?.output || '',
        writer: mission.agents?.writer?.output || '',
      }
    });
  }
}));
