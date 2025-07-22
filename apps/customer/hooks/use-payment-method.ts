'use client';
import { useToast } from '@/context/ToastContext';
import {
  BankAccountResponse,
  BankResponse,
  getBankByBin,
  getBanks,
  getUserBankAccounts,
  insertBankAccount,
  updateBankAccount,
} from '@services/payment-method.api';
import { useCallback, useEffect, useState } from 'react';

export function usePaymentMethod() {
  const [banks, setBanks] = useState<BankResponse[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
  const [page, setPage] = useState(0);
  const [bankPage, setBankPage] = useState(0);
  const [isBankAccountLoading, setBankAccountLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const [form, setForm] = useState<{
    selectedBankBin: string;
    accountNumber: string;
    userBankName: string;
    id?: string;
  }>({
    selectedBankBin: '',
    accountNumber: '',
    userBankName: '',
  });

  const [editingAccount, setEditingAccount] = useState<BankAccountResponse | null>(null);
  const fetchBankAccounts = useCallback(async () => {
    setBankAccountLoading(true);
    const response = await getUserBankAccounts();
    if (!response) {
      setBankAccounts([]);
      setBankAccountLoading(false);
      return;
    }
    if (response.success) {
      setBankAccounts(response.content);
      setPage(response.pagination?.page ?? 0);
    }
    setBankAccountLoading(false);
  }, []);

  const fetchBanks = useCallback(async () => {
    const response = await getBanks();
    if (!response) {
      setBanks([]);
      return;
    }
    if (response.success) {
      setBanks(response.content);
      setBankPage(response.pagination?.page ?? 0);
    }
  }, []);

  const createBankAccount = useCallback(
    async (data: { accountNumber: string; selectedBankBin: string; userBankName: string }) => {
      const bank = await getBankByBin(data.selectedBankBin);
      if (!bank) {
        showToast('Bank not found', 'warning');
        return;
      }
      const response = await insertBankAccount({
        accountNumber: data.accountNumber,
        bankBin: data.selectedBankBin,
        bankName: bank.code,
        userBankName: data.userBankName,
      });
      if (!response) {
        showToast('Create Bank Account Failed', 'warning');
        return;
      }
      if (response.success) {
        setBankAccounts([...bankAccounts, response.content]);
        setPage(response.pagination?.page ?? 0);
        showToast('Create Bank Account Success', 'success');
        return;
      }
      showToast('Create Bank Account Failed', 'warning');
    },
    [],
  );

  const updateUserBankAccount = useCallback(
    async (
      data: { accountNumber: string; selectedBankBin: string; userBankName: string },
      id: string,
    ) => {
      const bank = await getBankByBin(data.selectedBankBin);
      if (!bank) {
        showToast('Bank not found', 'warning');
        return;
      }
      const response = await updateBankAccount(
        {
          accountNumber: data.accountNumber,
          bankBin: data.selectedBankBin,
          bankName: bank.code,
          userBankName: data.userBankName,
        },
        id,
      );
      if (!response) {
        showToast('Update Bank Account Failed', 'warning');
        return;
      }
      if (response.success) {
        setBankAccounts([...bankAccounts, response.content]);
        setPage(response.pagination?.page ?? 0);
        showToast('Update Bank Account Success', 'success');
        return;
      }
      showToast('Update Bank Account Failed', 'warning');
    },
    [],
  );

  useEffect(() => {
    fetchBankAccounts();
    fetchBanks();
  }, [fetchBankAccounts, fetchBanks]);

  return {
    banks,
    bankAccounts,
    fetchBanks,
    page,
    bankPage,
    isBankAccountLoading,
    editingAccount,
    setEditingAccount,
    createBankAccount,
    updateUserBankAccount,
    isModalOpen,
    setIsModalOpen,
    form,
    setForm,
  };
}
