import {
  customerProfileApi,
  TCustomerBaseMetricResponse,
  TCustomerProfileResponse,
} from '@/service/customer-profile.api';
import { useCallback, useEffect, useState } from 'react';

function useCustomerProfile() {
  const [profile, setProfile] = useState<TCustomerProfileResponse>();
  const [metrics, setMetrics] = useState<TCustomerBaseMetricResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCustomerProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await customerProfileApi.getCustomerProfile();
      if (!response) {
        throw new Error('No response');
      }
      setProfile(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customer profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCustomerMetrics = useCallback(async () => {
    try {
      const response = await customerProfileApi.getCustomerBaseMetric();
      if (response) {
        setMetrics(response);
      }
    } catch (err) {
      console.error('Failed to fetch customer metrics:', err);
    }
  }, []);

  useEffect(() => {
    getCustomerProfile();
    getCustomerMetrics();
  }, [getCustomerProfile, getCustomerMetrics]);

  return {
    profile,
    metrics,
    isLoading,
    error,
    getCustomerProfile,
    getCustomerMetrics,
  };
}

export { useCustomerProfile };
