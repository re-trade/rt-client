'use client';

import { useWallet } from '@/hooks/use-wallet';
import { BankAccountResponse, BankResponse, getBankByBin, getBanks, getUserBankAccounts, insertBankAccount } from '@/services/payment-method.api';
import { CreateWithdrawalRequest } from '@/services/wallet.api';
import { useToast } from '@/hooks/use-toast';
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

  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawContent, setWithdrawContent] = useState('');
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccountResponse | null>(null);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);

  const [bankAccountModalOpen, setBankAccountModalOpen] = useState(false);
  const [userBankAccounts, setUserBankAccounts] = useState<BankAccountResponse[]>([]);
  const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);

  const [bankAccountCreationModalOpen, setBankAccountCreationModalOpen] = useState(false);
  const [banks, setBanks] = useState<BankResponse[]>([]);
  const [bankAccountForm, setBankAccountForm] = useState({
    selectedBankBin: '',
    accountNumber: '',
    userBankName: ''
  });
  const [creatingBankAccount, setCreatingBankAccount] = useState(false);

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

  const fetchBanks = useCallback(async () => {
    try {
      const response = await getBanks();
      if (response?.success) {
        setBanks(response.content || []);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  }, []);

  const createBankAccount = useCallback(async () => {
    if (!bankAccountForm.selectedBankBin || !bankAccountForm.accountNumber || !bankAccountForm.userBankName) {
      showToast('Vui lòng điền đầy đủ thông tin', 'warning');
      return;
    }

    setCreatingBankAccount(true);
    try {
      const bank = await getBankByBin(bankAccountForm.selectedBankBin);
      if (!bank) {
        showToast('Không tìm thấy ngân hàng', 'warning');
        return;
      }

      const response = await insertBankAccount({
        accountNumber: bankAccountForm.accountNumber,
        bankBin: bankAccountForm.selectedBankBin,
        bankName: bank.code,
        userBankName: bankAccountForm.userBankName,
      });

      if (response?.success) {
        setUserBankAccounts(prev => [...prev, response.content]);
        setBankAccountCreationModalOpen(false);
        setBankAccountForm({ selectedBankBin: '', accountNumber: '', userBankName: '' });
        showToast('Thêm tài khoản ngân hàng thành công', 'success');
      } else {
        showToast('Thêm tài khoản ngân hàng thất bại', 'warning');
      }
    } catch (error) {
      console.error('Error creating bank account:', error);
      showToast('Thêm tài khoản ngân hàng thất bại', 'warning');
    } finally {
      setCreatingBankAccount(false);
    }
  }, [bankAccountForm, showToast]);

  useEffect(() => {
    if (bankAccountModalOpen) {
      fetchUserBankAccounts();
    }
  }, [bankAccountModalOpen, fetchUserBankAccounts]);

  useEffect(() => {
    if (isModalOpen) {
      fetchUserBankAccounts();
    }
  }, [isModalOpen, fetchUserBankAccounts]);

  useEffect(() => {
    if (bankAccountCreationModalOpen) {
      fetchBanks();
    }
  }, [bankAccountCreationModalOpen, fetchBanks]);

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

  const openBankAccountCreationModal = useCallback(() => {
    setBankAccountCreationModalOpen(true);
  }, []);

  const closeBankAccountCreationModal = useCallback(() => {
    setBankAccountCreationModalOpen(false);
    setBankAccountForm({ selectedBankBin: '', accountNumber: '', userBankName: '' });
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

    // Bank account creation modal state
    bankAccountCreationModalOpen,
    setBankAccountCreationModalOpen,
    banks,
    bankAccountForm,
    setBankAccountForm,
    creatingBankAccount,

    // Actions
    setPage,
    refresh,
    handleWithdrawalSubmit,
    cancelWithdrawal,
    openWithdrawalModal,
    openBankAccountCreationModal,
    closeBankAccountCreationModal,
    createBankAccount,
    resetForm,

    formatCurrency,
    formatDate,
  };
};
