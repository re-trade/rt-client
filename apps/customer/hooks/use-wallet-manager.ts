'use client';

import { useWallet } from '@/hooks/use-wallet';
import { BankResponse } from '@/services/payment-method.api';
import { CreateWithdrawalRequest } from '@/services/wallet.api';
import { useCallback, useState } from 'react';

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

  // Bank selection is now handled directly in the BankSelectionModal component

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
    // Data
    balance,
    withdrawals,
    loading,
    error,
    page,
    totalItems,
    size,

    // Withdrawal modal state
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

    // Actions
    setPage,
    refresh,
    handleWithdrawalSubmit,
    cancelWithdrawal,
    openWithdrawalModal,
    resetForm,

    formatCurrency,
    formatDate,
  };
};
