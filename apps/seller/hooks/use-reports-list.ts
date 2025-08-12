import { reportSellerApi, type SellerReportResponse } from '@/service/report.api';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useReportsList() {
  const [reports, setReports] = useState<SellerReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputQuery, setInputQuery] = useState('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const result = await reportSellerApi.getReportSellers(
        currentPage - 1,
        itemsPerPage,
        searchQuery,
      );
      setReports(result.content);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalElements);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Không thể tải danh sách báo cáo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearchQuery(inputQuery);
      setCurrentPage(1);
      if (inputQuery.trim()) {
        toast.info(`Tìm kiếm: "${inputQuery}"`);
      }
    },
    [inputQuery],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const refreshReports = useCallback(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    searchQuery,
    inputQuery,
    setInputQuery,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    getStatusColor,
    refreshReports,
  };
}
