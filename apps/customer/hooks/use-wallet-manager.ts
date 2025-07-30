'use client';

import { useWallet } from '@/hooks/use-wallet';
import { BankAccountResponse, getUserBankAccounts } from '@/services/payment-method.api';
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
  const [withdrawContent, setWithdrawContent] = useState('');
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccountResponse | null>(null);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);

  const [bankAccountModalOpen, setBankAccountModalOpen] = useState(false);
  const [userBankAccounts, setUserBankAccounts] = useState<BankAccountResponse[]>([]);
  const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);

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

  const fetchUserBankAccounts = useCallback(async () => {
    setLoadingBankAccounts(true);
    try {
      const response = await getUserBankAccounts(0, 100);
      if (response?.success) {
        setUserBankAccounts(response.content || []);
      }
    } catch (error) {
      console.error('Error fetching user bank accounts:', error);
    } finally {
      setLoadingBankAccounts(false);
    }
  }, []);

  useEffect(() => {
    if (bankAccountModalOpen) {
      fetchUserBankAccounts();
    }
  }, [bankAccountModalOpen, fetchUserBankAccounts]);

  const handleWithdrawalSubmit = useCallback(async () => {
    if (!selectedBankAccount || !withdrawAmount || !withdrawContent) {
      return false;
    }

    setProcessingWithdrawal(true);
    try {
      const data: CreateWithdrawalRequest = {
        amount: parseFloat(withdrawAmount),
        bankProfileId: selectedBankAccount.id,
        content: withdrawContent,
      };
      const success = await requestWithdrawal(data);
      if (success) {
        resetForm();
      }
      return success;
    } finally {
      setProcessingWithdrawal(false);
    }
  }, [selectedBankAccount, withdrawAmount, withdrawContent, requestWithdrawal]);

  const openWithdrawalModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const resetForm = useCallback(() => {
    setWithdrawAmount('');
    setWithdrawContent('');
    setSelectedBankAccount(null);
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
    withdrawContent,
    setWithdrawContent,
    selectedBankAccount,
    setSelectedBankAccount,
    processingWithdrawal,

    // Bank account modal state
    bankAccountModalOpen,
    setBankAccountModalOpen,
    userBankAccounts,
    loadingBankAccounts,
    fetchUserBankAccounts,

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
