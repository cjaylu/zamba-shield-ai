import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface TrainingProgress {
  id: string;
  module_id: string;
  progress: number;
  status: string;
  completed_at?: string;
}

export const useTraining = () => {
  const [progress, setProgress] = useState<TrainingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_training_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching training progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (moduleId: string, newProgress: number, status: string) => {
    if (!user) return;

    try {
      const existingProgress = progress.find(p => p.module_id === moduleId);
      
      if (existingProgress) {
        const { error } = await supabase
          .from('user_training_progress')
          .update({
            progress: newProgress,
            status,
            completed_at: status === 'completed' ? new Date().toISOString() : null,
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_training_progress')
          .insert({
            user_id: user.id,
            module_id: moduleId,
            progress: newProgress,
            status,
            completed_at: status === 'completed' ? new Date().toISOString() : null,
          });

        if (error) throw error;
      }

      await fetchProgress();
      
      if (status === 'completed') {
        toast({
          title: "Module Completed!",
          description: "Great job! You've completed this training module.",
        });
      }
    } catch (error) {
      console.error('Error updating training progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startModule = (moduleId: string) => {
    updateProgress(moduleId, 10, 'in-progress');
  };

  const continueModule = (moduleId: string) => {
    const currentProgress = progress.find(p => p.module_id === moduleId);
    const newProgress = Math.min(100, (currentProgress?.progress || 0) + 20);
    const newStatus = newProgress >= 100 ? 'completed' : 'in-progress';
    updateProgress(moduleId, newProgress, newStatus);
  };

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.module_id === moduleId);
  };

  return {
    progress,
    loading,
    startModule,
    continueModule,
    getModuleProgress,
    updateProgress,
  };
};