'use client';

import {
  TWithdrawProfile,
  approveWithdraw,
  getWithdraws,
  withdrawQr,
} from '@/services/withdraw.api';
import { useCallback, useEffect, useMemo, useState } from 'react';

const useWithdrawManager = () => {
  const [withdraws, setWithdraws] = useState<TWithdrawProfile[]>([]);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const pageSize = 10;

  const fethWithdraw = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getWithdraws(page, pageSize, searchQuery);
      if (result?.success) {
        setWithdraws(result.content || []);
        setTotal(result.content?.length || 0);
      } else {
        setWithdraws([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch withdraws');
      setWithdraws([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  const handleApproveWithdraw = useCallback(
    async (id: string) => {
      try {
        const result = await approveWithdraw(id);
        if (result?.success) {
          await fethWithdraw();
          return true;
        }
        setError('Failed approve withdraw');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed approve withdraw');
        return false;
      }
    },
    [fethWithdraw],
  );

  const fetchWithdrawQr = useCallback(async (withdrawId: string) => {
    try {
      const qrBlob = await withdrawQr(withdrawId);
      const url = URL.createObjectURL(qrBlob);
      setQrCodeUrl(url);
      return qrBlob; // Return the Blob instead of the URL for consistency
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch QR code';
      setQrError(errorMessage);
      return null;
    }
  }, []);

  useEffect(() => {
    fethWithdraw();
  }, [fethWithdraw]);

  const stats = useMemo(() => {
    const verified = withdraws?.filter((withdraw) => withdraw.status === 'COMPLETED')?.length || 0;
    const pending = withdraws?.filter((withdraw) => withdraw.status === 'PENDING')?.length || 0;
    const rejected = withdraws?.filter((withdraw) => withdraw.status === 'REJECTED')?.length || 0;

    return {
      total,
      verified,
      pending,
      rejected,
    };
  }, [withdraws, total]);

  return {
    page,
    setPage,
    withdraws,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    pageSize,
    stats,
    refresh: fethWithdraw,
    approveWithdraw: handleApproveWithdraw,
    fetchWithdrawQr,
    qrCodeUrl,
    qrError,
  };
};

export { useWithdrawManager };
