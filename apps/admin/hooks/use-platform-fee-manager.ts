'use client';

import {
  PlatformFee,
  PlatformFeeCreateUpdate,
  createPlatformFee,
  deletePlatformFee,
  getPlatformFees,
  updatePlatformFee,
} from '@/services/platform-fee.api';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const usePlatformFeeManager = () => {
  const [platformFees, setPlatformFees] = useState<PlatformFee[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalFees, setTotalFees] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Refresh the data
  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Load platform fees
  const loadPlatformFees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPlatformFees(page, size);
      if (response && response.success) {
        // Process the fees and ensure proper handling of null maxPrice
        const processedFees = (response.content || []).map((fee) => ({
          ...fee,
          maxPrice: fee.maxPrice === null ? null : fee.maxPrice,
        }));
        setPlatformFees(processedFees);
        setMaxPage(response.pagination?.totalPages ?? 1);
        setTotalFees(response.pagination?.totalElements ?? response.content?.length ?? 0);
      } else {
        setError('Could not load platform fee settings. Please try again.');
      }
    } catch (err) {
      console.error('Error loading platform fees:', err);
      setError('An error occurred while loading platform fee settings.');
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  // Create a new platform fee
  const handleCreateFee = useCallback(
    async (feeData: PlatformFeeCreateUpdate) => {
      try {
        // Ensure maxPrice is explicitly null if it's empty or 0
        const payload = {
          ...feeData,
          maxPrice: feeData.maxPrice === 0 ? null : feeData.maxPrice,
        };
        const response = await createPlatformFee(payload);
        if (response && response.success) {
          toast.success(
            response.messages?.[0] || 'Platform fee configuration created successfully!',
            { position: 'top-right' },
          );
          refresh();
          return true;
        } else {
          toast.error(response?.messages?.[0] || 'Failed to create platform fee configuration.', {
            position: 'top-right',
          });
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.messages?.[0] || 'Failed to create platform fee configuration.';
        toast.error(errorMessage, { position: 'top-right' });
        return false;
      }
    },
    [refresh],
  );

  // Update platform fee
  const handleUpdateFee = useCallback(
    async (id: string, feeData: PlatformFeeCreateUpdate) => {
      try {
        // Ensure maxPrice is explicitly null if it's empty or 0
        const payload = {
          ...feeData,
          maxPrice: feeData.maxPrice === 0 ? null : feeData.maxPrice,
        };
        const response = await updatePlatformFee(id, payload);
        if (response && response.success) {
          toast.success(
            response.messages?.[0] || 'Platform fee configuration updated successfully!',
            { position: 'top-right' },
          );
          refresh();
          return true;
        } else {
          toast.error(response?.messages?.[0] || 'Failed to update platform fee configuration.', {
            position: 'top-right',
          });
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.messages?.[0] || 'Failed to update platform fee configuration.';
        toast.error(errorMessage, { position: 'top-right' });
        return false;
      }
    },
    [refresh],
  );

  // Delete platform fee
  const handleDeleteFee = useCallback(
    async (id: string) => {
      try {
        const response = await deletePlatformFee(id);
        if (response && response.success) {
          toast.success(
            response.messages?.[0] || 'Platform fee configuration deleted successfully!',
            { position: 'top-right' },
          );
          refresh();
          return true;
        } else {
          toast.error(response?.messages?.[0] || 'Failed to delete platform fee configuration.', {
            position: 'top-right',
          });
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.messages?.[0] || 'Failed to delete platform fee configuration.';
        toast.error(errorMessage, { position: 'top-right' });
        return false;
      }
    },
    [refresh],
  );

  // Navigate to a specific page
  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Set page size
  const setPageSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing page size
  }, []);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadPlatformFees();
  }, [loadPlatformFees, refreshTrigger]);

  return {
    platformFees,
    loading,
    error,
    page,
    size,
    maxPage,
    totalFees,
    refresh,
    goToPage,
    setPageSize,
    handleCreateFee,
    handleUpdateFee,
    handleDeleteFee,
  };
};
