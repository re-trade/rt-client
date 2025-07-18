'use client';

import { acceptReport, getReports, TReportSellerProfile } from '@/services/report.seller.api';
import { useCallback, useEffect, useMemo, useState } from 'react';

const useReportSellerManager = () => {
  const [reports, setReports] = useState<TReportSellerProfile[]>([]);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const pageSize = 10;

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getReports(page, pageSize, searchQuery);
      if (result?.success) {
        setReports(result.content || []);
        setTotal(result.content?.length || 0);
      } else {
        setReports([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  //   const handleBanSeller = useCallback(
  //     async (id: string) => {
  //       try {
  //         const result = await appro(id);
  //         if (result?.success) {
  //           await fetchSeller();
  //           return true;
  //         }
  //         setError('Failed to ban seller');
  //         return false;
  //       } catch (err) {
  //         setError(err instanceof Error ? err.message : 'Failed to ban seller');
  //         return false;
  //       }
  //     },
  //      [fetchReport],
  //   );

  const handleApproveReport = useCallback(
    async (id: string) => {
      try {
        const result = await acceptReport(id);
        if (result?.success) {
          await fetchReport();
          return true;
        }
        setError('Failed to unban seller');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to unban seller');
        return false;
      }
    },
    [fetchReport],
  );

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const stats = useMemo(
    () => ({
      total: total,
      accepted: reports?.filter((report) => report.resolutionStatus === 'ACCEPT')?.length || 0,
      rejected: reports?.filter((report) => report.resolutionStatus === 'REJECT')?.length || 0,
      pending: reports?.filter((report) => report.resolutionStatus === null)?.length || 0,
    }),
    [reports, total],
  );

  return {
    page,
    setPage,
    reports,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    pageSize,
    stats,
    refresh: fetchReport,
    approveReport: handleApproveReport,
  };
};

export { useReportSellerManager };
