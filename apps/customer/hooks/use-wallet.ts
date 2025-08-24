'use client';

import { useToast } from '@/context/ToastContext';
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
  const { showToast } = useToast();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchBalance = useCallback(async () => {
    setLoading((prev) => ({ ...prev, balance: true }));
    try {
      const data = await getWalletBalance();
      if (data) {
        setBalance(data.balance);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể lấy số dư ví';
      showToast(errorMessage, 'error');
    } finally {
      setLoading((prev) => ({ ...prev, balance: false }));
    }
  }, [showToast]);

  const fetchWithdrawals = useCallback(async () => {
    setLoading((prev) => ({ ...prev, withdrawals: true }));
    try {
      const response = await getWithdrawals(page, size);
      if (response?.success) {
        setWithdrawals(response.content || []);
        setTotalItems(response.pagination?.totalElements || 0);
      } else {
        setWithdrawals([]);
        setTotalItems(0);
        const errorMessage =
          response?.message ||
          (response?.messages && response.messages.length > 0
            ? response.messages[0]
            : 'Không thể lấy lịch sử rút tiền');
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể lấy lịch sử rút tiền';
      showToast(errorMessage, 'error');
      setWithdrawals([]);
      setTotalItems(0);
    } finally {
      setLoading((prev) => ({ ...prev, withdrawals: false }));
    }
  }, [page, size, showToast]);

  const requestWithdrawal = useCallback(
    async (data: CreateWithdrawalRequest) => {
      setLoading((prev) => ({ ...prev, createWithdrawal: true }));
      try {
        const response = await createWithdrawal(data);
        if (response?.success) {
          await Promise.all([fetchBalance(), fetchWithdrawals()]);
          showToast('Yêu cầu rút tiền đã được tạo thành công', 'success');
          return { success: true };
        } else {
          const errorMessage =
            response?.message ||
            (response?.messages && response.messages.length > 0
              ? response.messages[0]
              : 'Lỗi khi tạo yêu cầu rút tiền');
          showToast(errorMessage, response?.code === '400' ? 'warning' : 'error');
          return {
            success: false,
            message: errorMessage,
            code: response?.code,
          };
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tạo yêu cầu rút tiền';
        showToast(errorMessage, 'error');
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setLoading((prev) => ({ ...prev, createWithdrawal: false }));
      }
    },
    [fetchBalance, fetchWithdrawals, showToast],
  );

  const handleCancelWithdrawal = useCallback(
    async (id: string) => {
      setLoading((prev) => ({ ...prev, cancelWithdrawal: true }));
      try {
        const response = await cancelWithdrawal(id);
        if (response?.success) {
          await fetchWithdrawals();
          showToast('Đã hủy yêu cầu rút tiền thành công', 'success');
          return { success: true };
        } else {
          const errorMessage =
            response?.message ||
            (response?.messages && response.messages.length > 0
              ? response.messages[0]
              : 'Không thể hủy yêu cầu rút tiền');
          showToast(errorMessage, response?.code === '400' ? 'warning' : 'error');
          return {
            success: false,
            message: errorMessage,
            code: response?.code,
          };
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể hủy yêu cầu rút tiền';
        showToast(errorMessage, 'error');
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setLoading((prev) => ({ ...prev, cancelWithdrawal: false }));
      }
    },
    [fetchWithdrawals, showToast],
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
