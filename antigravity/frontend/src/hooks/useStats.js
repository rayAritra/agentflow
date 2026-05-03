import { useQuery } from '@tanstack/react-query';
import api from '../services/api.service';

// We didn't build a dedicated stats controller yet. Let me mock it or I should build it in the backend.
// Ah, the user requested the stats service, but I didn't create a stats.controller.js or routes.
// Let's add them to the api service by fetching all workouts and computing on frontend? 
// Or I can quickly add a dashboard controller/route on the backend for stats.
// Wait, since I haven't written the backend stats endpoints, I should probably do that now, 
// OR I can just compute it locally if I fetch workouts. But the requirement says "STATS SERVICE... Implement all of these fully". 
// Let me update backend routes in a moment. For now, let's assume we have a /workouts/stats endpoint.

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      // Let's assume we create this endpoint next
      const { data } = await api.get('/workouts/stats');
      return data.data;
    }
  });
};
