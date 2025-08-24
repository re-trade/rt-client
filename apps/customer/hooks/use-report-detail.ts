'use client';

import {
  customerReportApi,
  CustomerReportEvidenceResponse,
  CustomerReportResponse,
} from '@services/report.api';
import { getSellerProfile, TSellerProfile } from '@services/seller.api';
import { useCallback, useEffect, useState } from 'react';

export function useReportDetail(id: string) {
  const [report, setReport] = useState<CustomerReportResponse | null>(null);
  const [evidences, setEvidences] = useState<CustomerReportEvidenceResponse[]>([]);
  const [seller, setSeller] = useState<TSellerProfile | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const reportData = await customerReportApi.getReportById(id);
      setReport(reportData);
    } catch (err) {
      setError('Không thể tải thông tin báo cáo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchEvidences = useCallback(
    async (page: number = 0) => {
      try {
        setEvidenceLoading(true);
        const evidenceData = await customerReportApi.getReportEvidences(id, page, 10);
        setEvidences(evidenceData.content);
        setCurrentPage(evidenceData.page);
        setTotalPages(evidenceData.totalPages);
      } catch (err) {
      } finally {
        setEvidenceLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    if (id) {
      fetchReport();
      fetchEvidences();
    }
  }, [fetchEvidences, fetchReport, id]);

  useEffect(() => {
    if (report?.sellerId) {
      const fetchSellerProfile = async () => {
        try {
          const sellerData = await getSellerProfile(report.sellerId);
          setSeller(sellerData);
        } catch (err) {}
      };

      fetchSellerProfile();
    }
  }, [report]);
  return {
    report,
    evidences,
    loading,
    fetchReport,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    isEvidenceModalOpen,
    setIsEvidenceModalOpen,
    fetchEvidences,
    seller,
    evidenceLoading,
  };
}
