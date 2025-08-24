'use client';

import {
  TWithdrawListItem,
  approveWithdraw,
  getWithdrawDetail,
  getWithdraws,
  withdrawQr,
} from '@/services/withdraw.api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const useWithdrawManager = () => {
  const [withdraws, setWithdraws] = useState<TWithdrawListItem[]>([]);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
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
    async (id: string, imageReview?: File) => {
      try {
        setIsApproving(true);
        const result = await approveWithdraw(id, true, imageReview);
        if (result?.success) {
          await fethWithdraw();
          toast.success('Đã duyệt yêu cầu rút tiền', { position: 'top-right' });
          return true;
        }
        const errorMessage = 'Không thể duyệt yêu cầu rút tiền';
        setError(errorMessage);
        toast.error(errorMessage, { position: 'top-right' });
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Không thể duyệt yêu cầu rút tiền';
        setError(errorMessage);
        toast.error(errorMessage, { position: 'top-right' });
        return false;
      } finally {
        setIsApproving(false);
      }
    },
    [fethWithdraw],
  );

  const handleRejectWithdraw = useCallback(
    async (id: string, rejectReason: string) => {
      try {
        setIsRejecting(true);
        const result = await approveWithdraw(id, false, undefined, rejectReason);
        if (result?.success) {
          await fethWithdraw();
          toast.success('Đã từ chối yêu cầu rút tiền', { position: 'top-right' });
          return true;
        }
        const errorMessage = 'Không thể từ chối yêu cầu rút tiền';
        setError(errorMessage);
        toast.error(errorMessage, { position: 'top-right' });
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Không thể từ chối yêu cầu rút tiền';
        setError(errorMessage);
        toast.error(errorMessage, { position: 'top-right' });
        return false;
      } finally {
        setIsRejecting(false);
      }
    },
    [fethWithdraw],
  );

  const fetchWithdrawDetail = useCallback(async (withdrawId: string) => {
    try {
      const withdrawDetail = await getWithdrawDetail(withdrawId);
      return withdrawDetail || null;
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy thông tin chi tiết yêu cầu rút tiền';
      setError(errorMessage);
      toast.error(errorMessage, { position: 'top-right' });
      return null;
    }
  }, []);

  const fetchWithdrawQr = useCallback(async (withdrawId: string) => {
    try {
      const qrBlob = await withdrawQr(withdrawId);
      if (!qrBlob) {
        setQrError('Không thể tải mã QR');
        return null;
      }
      const url = URL.createObjectURL(qrBlob);
      setQrCodeUrl(url);
      return qrBlob; // Return the Blob instead of the URL for consistency
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tải mã QR';
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
    rejectWithdraw: handleRejectWithdraw,
    fetchWithdrawQr,
    fetchWithdrawDetail,
    qrCodeUrl,
    qrError,
    isApproving,
    isRejecting,
  };
};

export { useWithdrawManager };
