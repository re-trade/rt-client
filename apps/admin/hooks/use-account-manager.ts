'use client';

import {
  AccountResponse,
  getAccounts,
  toggleAccountStatus,
  updateAccountRoles,
} from '@/services/account.api';
import { useCallback, useEffect, useState } from 'react';

const useAccountManager = () => {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const pageSize = 10;

  const fetchAccounts = useCallback(async () => {
    if (page < 0) {
      setPage(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getAccounts(page, pageSize, searchQuery);
      console.log(result);
      if (result && result?.success) {
        setAccounts(result.content ?? []);
        setTotal(result.pagination?.totalElements ?? 0);
      } else {
        setAccounts([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  const handleToggleStatus = async (accountId: string, enabled: boolean) => {
    try {
      const success = await toggleAccountStatus(accountId, enabled);
      if (success) {
        await fetchAccounts();
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account status');
      return false;
    }
  };

  const handleUpdateRoles = async (accountId: string, roles: string[]) => {
    try {
      const success = await updateAccountRoles(accountId, roles);
      if (success) {
        await fetchAccounts();
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account roles');
      return false;
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const filteredAccounts = useCallback(() => {
    return accounts.filter((account) => {
      const matchesSearch =
        !searchQuery ||
        (account.username?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (account.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'All' || (account.roles || []).includes(selectedRole);
      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'active' ? account.enabled : !account.enabled);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [accounts, searchQuery, selectedRole, selectedStatus]);

  return {
    page,
    setPage,
    accounts: filteredAccounts(),
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
    pageSize,
    total,
    refresh: fetchAccounts,
    toggleStatus: handleToggleStatus,
    updateRoles: handleUpdateRoles,
  };
};

export { useAccountManager };
