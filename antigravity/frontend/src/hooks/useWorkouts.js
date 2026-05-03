import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api.service';
import toast from 'react-hot-toast';

export const useWorkouts = () => {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const { data } = await api.get('/workouts');
      return data.data;
    }
  });
};

export const useWorkout = (id) => {
  return useQuery({
    queryKey: ['workouts', id],
    queryFn: async () => {
      const { data } = await api.get(`/workouts/${id}`);
      return data.data;
    },
    enabled: !!id
  });
};

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data } = await api.get('/workouts/templates');
      return data.data;
    }
  });
};

export const useSaveWorkout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workoutData) => {
      const { data } = await api.post('/workouts', workoutData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Workout saved successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save workout');
    }
  });
};
