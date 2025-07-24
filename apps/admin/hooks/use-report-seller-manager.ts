'use client';

import {
  TReportSellerProfile,
  acceptReport,
  getReports,
  rejectReport,
} from '@/services/report.seller.api';
import { useCallback, useEffect, useState } from 'react';

const useReportSeller = () => {
  const [reports, setReports] = useState<TReportSellerProfile[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const fethReports = useCallback(
    async (searchQuery?: string, customPage?: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getReports((customPage ?? page) - 1, pageSize, searchQuery);

        if (response && response.success) {
          setReports(response.content || []);
          setMaxPage(response.pagination?.totalPages ?? 1);
          setTotalReports(response.pagination?.totalElements ?? response.content?.length ?? 0);
        } else {
          setReports([]);
          setMaxPage(1);
          setTotalReports(0);
          setError(response?.message || 'Fail to get reports');
        }
      } catch (err) {
        setReports([]);
        setMaxPage(1);
        setTotalReports(0);
        setError(err instanceof Error ? err.message : 'Fail to get reports');
      } finally {
        setLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    fethReports();
  }, [fethReports]);

  const refetch = () => fethReports();
  const goToPage = (newPage: number, searchQuery?: string) => {
    setPage(newPage);
    fethReports(searchQuery, newPage);
  };
  const searchReports = (searchQuery: string) => {
    setPage(1);
    fethReports(searchQuery, 1);
  };

  const handleAccept = useCallback(
    async (id: string) => {
      try {
        const result = await acceptReport(id);
        if (result?.success) {
          await fethReports();
          return true;
        }
        setError('Failed to accept report');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to accept report');
        return false;
      }
    },
    [fethReports],
  );

  const handleReject = useCallback(
    async (id: string) => {
      try {
        const result = await rejectReport(id);
        if (result?.success) {
          await fethReports();
          return true;
        }
        setError('Failed to reject report');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reject report');
        return false;
      }
    },
    [fethReports],
  );

  return {
    reports,
    page,
    maxPage,
    totalReports,
    loading,
    error,
    refetch,
    goToPage,
    searchReports,
    acceptReport,
    rejectReport,
  };
};

export { useReportSeller };
