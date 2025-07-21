'use client';

import { useWallet } from '@/hooks/use-wallet';
import { BankResponse, getBanks } from '@/services/payment-method.api';
import { CreateWithdrawalRequest } from '@/services/wallet.api';
import { useCallback, useEffect, useState } from 'react';

export const useWalletManager = () => {
  const {
    balance,
    withdrawals,
    loading,
    error,
    page,
    setPage,
    totalItems,
    size,
    refresh,
    requestWithdrawal,
    cancelWithdrawal,
  } = useWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [selectedBank, setSelectedBank] = useState<BankResponse | null>(null);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);

  const [banks, setBanks] = useState<BankResponse[]>([]);
  const [bankSearch, setBankSearch] = useState('');
  const [bankModalOpen, setBankModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchBanks = useCallback(async () => {
    try {
      const response = await getBanks(0, 100, bankSearch);
      if (response?.success) {
        setBanks(
          response.content.map((bank) => ({
            ...bank,
            logo: bank.url,
          })) || [],
        );
      }
    } catch (error) {
      console.error('Failed to fetch banks:', error);
    }
  }, [bankSearch]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const handleWithdrawalSubmit = useCallback(
    async (data: CreateWithdrawalRequest) => {
      setProcessingWithdrawal(true);
      try {
        const success = await requestWithdrawal(data);
        return success;
      } finally {
        setProcessingWithdrawal(false);
      }
    },
    [requestWithdrawal],
  );

  const openWithdrawalModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const resetForm = useCallback(() => {
    setWithdrawAmount('');
    setAccountNumber('');
    setAccountName('');
    setSelectedBank(null);
  }, []);

  return {
    balance,
    withdrawals,
    loading,
    error,
    page,
    totalItems,
    size,
    banks,

    isModalOpen,
    setIsModalOpen,
    withdrawAmount,
    setWithdrawAmount,
    accountNumber,
    setAccountNumber,
    accountName,
    setAccountName,
    selectedBank,
    setSelectedBank,
    processingWithdrawal,

    bankModalOpen,
    setBankModalOpen,
    bankSearch,
    setBankSearch,

    setPage,
    refresh,
    fetchBanks,
    handleWithdrawalSubmit,
    cancelWithdrawal,
    openWithdrawalModal,
    resetForm,

    formatCurrency,
    formatDate,
  };
};
