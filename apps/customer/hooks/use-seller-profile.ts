'use client';

import { achievementApi, TAchievementResponse } from '@services/achievement.api';
import {
  getSellerMetric,
  getSellerProfile,
  TSellerMetricResponse,
  TSellerProfile,
} from '@services/seller.api';
import { useCallback, useEffect, useState } from 'react';

function useSellerProfile(id: string) {
  const [sellerProfile, setSellerProfile] = useState<TSellerProfile>();
  const [sellerMetrics, setSellerMetrics] = useState<TSellerMetricResponse>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [achievements, setAchievements] = useState<TAchievementResponse[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const fetchSellerProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const seller = await getSellerProfile(id);
      setSellerProfile(seller);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchSellerMetrics = useCallback(async () => {
    setLoadingMetrics(true);
    setError(null);
    try {
      const metrics = await getSellerMetric(id);
      setSellerMetrics(metrics);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingMetrics(false);
    }
  }, [id]);

  const fetchSellerAchievement = useCallback(async () => {
    setLoadingAchievements(true);
    setError(null);
    try {
      const response = await achievementApi.getSellerAchievements(id);
      setAchievements(response.content);
    } catch (error: any) {
      console.error('Achievement fetch error:', error);
      setError(error.message);
      setAchievements([]);
    } finally {
      setLoadingAchievements(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSellerProfile();
    fetchSellerMetrics();
    fetchSellerAchievement();
  }, [fetchSellerProfile, fetchSellerMetrics, fetchSellerAchievement]);
  return {
    error,
    sellerProfile,
    sellerMetrics,
    loading,
    loadingMetrics,
    achievements,
    loadingAchievements,
  };
}

export { useSellerProfile };
