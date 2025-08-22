'use client';
import { achievementApi, TAchievementResponse } from '@/service/achievement.api';
import { useCallback, useEffect, useState } from 'react';

const useAchievements = () => {
  const [achievements, setAchievements] = useState<TAchievementResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await achievementApi.getMyAchievements();
      setAchievements(response.content);
    } catch (err) {
      setError('Không thể tải dữ liệu thành tích');
      console.error('Achievement fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAchievements = useCallback(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return {
    achievements,
    isLoading,
    error,
    refreshAchievements,
  };
};

export { useAchievements };
