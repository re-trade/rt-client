'use client';

import {
  TEvidence,
  TReportSellerProfile,
  acceptReport,
  getEvidence,
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
  const [evidence, setEvidence] = useState<TEvidence[] | null>(null);
  const [evidenceLoading, setEvidenceLoading] = useState<boolean>(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  const pageSize = 10;

  const fetchReports = useCallback(
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

  const fetchEvidence = useCallback(async (id: string) => {
    setEvidenceLoading(true);
    setEvidenceError(null);
    try {
      const response = await getEvidence(id); // response is TEvidence[]
      setEvidence(response); // Set the array of evidence
      return response;
    } catch (err) {
      setEvidence([]); // Set empty array on error
      setEvidenceError(err instanceof Error ? err.message : 'Failed to fetch evidence');
      return [];
    } finally {
      setEvidenceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const refetch = () => fetchReports();

  const goToPage = (newPage: number, searchQuery?: string) => {
    setPage(newPage);
    fetchReports(searchQuery, newPage);
  };

  const searchReports = (searchQuery: string) => {
    setPage(1);
    fetchReports(searchQuery, 1);
  };

  const handleAccept = useCallback(
    async (id: string) => {
      try {
        const result = await acceptReport(id);
        if (result?.success) {
          await fetchReports();
          return true;
        }
        setError('Failed to accept report');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to accept report');
        return false;
      }
    },
    [fetchReports],
  );

  const handleReject = useCallback(
    async (id: string) => {
      try {
        const result = await rejectReport(id);
        if (result?.success) {
          await fetchReports();
          return true;
        }
        setError('Failed to reject report');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reject report');
        return false;
      }
    },
    [fetchReports],
  );

  return {
    reports,
    page,
    maxPage,
    totalReports,
    loading,
    error,
    evidence,
    evidenceLoading,
    evidenceError,
    refetch,
    goToPage,
    searchReports,
    acceptReport: handleAccept,
    rejectReport: handleReject,
    fetchEvidence,
  };
};

export { useReportSeller };
