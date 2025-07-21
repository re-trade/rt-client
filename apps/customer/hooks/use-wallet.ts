'use client';

import {
  cancelWithdrawal,
  createWithdrawal,
  CreateWithdrawalRequest,
  getWalletBalance,
  getWithdrawals,
  WithdrawalRequest,
} from '@/services/wallet.api';
import { useCallback, useEffect, useState } from 'react';

export const useWallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState({
    balance: false,
    withdrawals: false,
    createWithdrawal: false,
    cancelWithdrawal: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchBalance = useCallback(async () => {
    setLoading((prev) => ({ ...prev, balance: true }));
    setError(null);
    try {
      const data = await getWalletBalance();
      if (data) {
        setBalance(data.balance);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet balance');
    } finally {
      setLoading((prev) => ({ ...prev, balance: false }));
    }
  }, []);

  const fetchWithdrawals = useCallback(async () => {
    setLoading((prev) => ({ ...prev, withdrawals: true }));
    setError(null);
    try {
      const response = await getWithdrawals(page, size);
      if (response?.success) {
        setWithdrawals(response.content || []);
        setTotalItems(response.pagination?.totalPages || 0);
      } else {
        setWithdrawals([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch withdrawal history');
      setWithdrawals([]);
    } finally {
      setLoading((prev) => ({ ...prev, withdrawals: false }));
    }
  }, [page, size]);

  const requestWithdrawal = useCallback(
    async (data: CreateWithdrawalRequest) => {
      setLoading((prev) => ({ ...prev, createWithdrawal: true }));
      setError(null);
      try {
        const response = await createWithdrawal(data);
        if (response?.success) {
          await Promise.all([fetchBalance(), fetchWithdrawals()]);
          return true;
        } else {
          setError(response?.message || 'Failed to create withdrawal request');
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create withdrawal request');
        return false;
      } finally {
        setLoading((prev) => ({ ...prev, createWithdrawal: false }));
      }
    },
    [fetchBalance, fetchWithdrawals],
  );

  const handleCancelWithdrawal = useCallback(
    async (id: string) => {
      setLoading((prev) => ({ ...prev, cancelWithdrawal: true }));
      setError(null);
      try {
        const response = await cancelWithdrawal(id);
        if (response?.success) {
          await fetchWithdrawals();
          return true;
        } else {
          setError(response?.message || 'Failed to cancel withdrawal request');
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to cancel withdrawal request');
        return false;
      } finally {
        setLoading((prev) => ({ ...prev, cancelWithdrawal: false }));
      }
    },
    [fetchWithdrawals],
  );

  useEffect(() => {
    fetchBalance();
    fetchWithdrawals();
  }, [fetchBalance, fetchWithdrawals]);

  const isLoading = Object.values(loading).some(Boolean);

  return {
    balance,
    withdrawals,
    loading,
    isLoading,
    error,
    page,
    setPage,
    totalItems,
    size,
    refresh: useCallback(() => {
      fetchBalance();
      fetchWithdrawals();
    }, [fetchBalance, fetchWithdrawals]),
    requestWithdrawal,
    cancelWithdrawal: handleCancelWithdrawal,
  };
};
