import { useQuery } from '@tanstack/react-query';
import api from '../services/api.service';

export const useExercises = (search = '', muscleGroup = 'All') => {
  return useQuery({
    queryKey: ['exercises', search, muscleGroup],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (muscleGroup && muscleGroup !== 'All') params.append('muscleGroup', muscleGroup);
      
      const { data } = await api.get(`/exercises?${params.toString()}`);
      return data.data;
    }
  });
};
