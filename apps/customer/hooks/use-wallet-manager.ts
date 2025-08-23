'use client';

import { useToast } from '@/context/ToastContext';
import { useWallet } from '@/hooks/use-wallet';
import {
  BankAccountResponse,
  BankResponse,
  getBankByBin,
  getBanks,
  getUserBankAccounts,
  insertBankAccount,
} from '@/services/payment-method.api';
import { CreateWithdrawalRequest } from '@/services/wallet.api';
import { useCallback, useEffect, useState } from 'react';

export const useWalletManager = () => {
  const {
    balance,
    withdrawals,
    loading,
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
    userBankName: '',
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
      } else if (response) {
        // Show API error message in toast
        const errorMessage =
          response.message ||
          (response.messages && response.messages.length > 0
            ? response.messages[0]
            : 'Không thể lấy danh sách tài khoản ngân hàng');
        showToast(errorMessage, 'error');
      }
    } catch (error: any) {
      console.error('Error fetching user bank accounts:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.messages?.[0] ||
        error.message ||
        'Không thể lấy danh sách tài khoản ngân hàng';
      showToast(errorMessage, 'error');
    } finally {
      setLoadingBankAccounts(false);
    }
  }, []);

  const fetchBanks = useCallback(async () => {
    try {
      const response = await getBanks();
      if (response?.success) {
        setBanks(response.content || []);
      } else if (response) {
        // Show API error message in toast
        const errorMessage =
          response.message ||
          (response.messages && response.messages.length > 0
            ? response.messages[0]
            : 'Không thể lấy danh sách ngân hàng');
        showToast(errorMessage, 'error');
      }
    } catch (error: any) {
      console.error('Error fetching banks:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.messages?.[0] ||
        error.message ||
        'Không thể lấy danh sách ngân hàng';
      showToast(errorMessage, 'error');
    }
  }, []);

  const createBankAccount = useCallback(async () => {
    if (
      !bankAccountForm.selectedBankBin ||
      !bankAccountForm.accountNumber ||
      !bankAccountForm.userBankName
    ) {
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
        setUserBankAccounts((prev) => [...prev, response.content]);
        setBankAccountCreationModalOpen(false);
        setBankAccountForm({ selectedBankBin: '', accountNumber: '', userBankName: '' });
        showToast('Thêm tài khoản ngân hàng thành công', 'success');
      } else {
        // Display specific error message from API if available
        const errorMessage =
          response?.message ||
          (response?.messages?.length > 0
            ? response.messages[0]
            : 'Thêm tài khoản ngân hàng thất bại');
        showToast(errorMessage, 'warning');
      }
    } catch (error: any) {
      console.error('Error creating bank account:', error);
      // Extract error message from the error object if available
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.messages?.[0] ||
        error.message ||
        'Thêm tài khoản ngân hàng thất bại';
      showToast(errorMessage, 'warning');
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

  const resetForm = useCallback(() => {
    setWithdrawAmount('');
    setWithdrawContent('');
    setSelectedBankAccount(null);
  }, []);

  const handleWithdrawalSubmit = useCallback(async () => {
    if (!selectedBankAccount || !withdrawAmount || !withdrawContent) {
      showToast('Vui lòng điền đầy đủ thông tin', 'warning');
      return false;
    }

    setProcessingWithdrawal(true);
    try {
      const data: CreateWithdrawalRequest = {
        amount: parseFloat(withdrawAmount),
        bankProfileId: selectedBankAccount.id,
        content: withdrawContent,
      };
      const result = await requestWithdrawal(data);
      if (result.success) {
        resetForm();
        setIsModalOpen(false);
        return true;
      }
      return false;
    } finally {
      setProcessingWithdrawal(false);
    }
  }, [
    selectedBankAccount,
    withdrawAmount,
    withdrawContent,
    requestWithdrawal,
    setIsModalOpen,
    resetForm,
  ]);

  // Use the cancelWithdrawal function directly from useWallet
  // It now handles error messages with toast internally

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

  // resetForm function moved above

  return {
    // Data
    balance,
    withdrawals,
    loading,
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
