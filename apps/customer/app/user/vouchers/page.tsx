'use client';

import {
  CheckCircle,
  Copy,
  Filter,
  Gift,
  Grid3X3,
  List,
  Search,
  Star,
  XCircle,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface Voucher {
  id: number;
  title: string;
  description: string;
  discount: string;
  minOrder: string;
  expiryDate: string;
  category: {
    name: string;
    icon: string;
  };
  code: string;
  status: 'available' | 'used' | 'expired';
  isNew?: boolean;
  isFavorite?: boolean;
  usageCount?: number;
  maxUsage?: number;
}

const categories = [
  { name: 'HÀNG TIÊU DÙNG', icon: '🧴', color: 'bg-blue-100 text-blue-700' },
  { name: 'THỜI TRANG', icon: '👕', color: 'bg-pink-100 text-pink-700' },
  { name: 'ĐIỆN TỬ', icon: '📷', color: 'bg-purple-100 text-purple-700' },
  { name: 'PHONG CÁCH SỐNG', icon: '🏍️', color: 'bg-green-100 text-green-700' },
  { name: 'ƯU ĐÃI ĐỐI TÁC', icon: '🤝', color: 'bg-amber-100 text-amber-700' },
];

const mockVouchers: Voucher[] = Array.from({ length: 12 }, (_, i) => {
  const category = categories[i % categories.length];
  const day = String((i % 28) + 1).padStart(2, '0');
  const month = String((i % 12) + 1).padStart(2, '0');

  return {
    id: i + 1,
    title:
      i % 3 === 0
        ? 'Hoàn 100% xu Đơn Tối Thiểu 0₫'
        : i % 3 === 1
          ? 'Giảm 50K cho đơn hàng từ 200K'
          : 'Miễn phí vận chuyển toàn quốc',
    description:
      i % 3 === 0
        ? 'Giảm giá 100% cho đơn hàng tối thiểu 0₫, tối đa 88k xu. Chỉ áp dụng cho khách hàng mới.'
        : i % 3 === 1
          ? 'Giảm 50.000đ cho đơn hàng từ 200.000đ. Áp dụng cho tất cả sản phẩm.'
          : 'Miễn phí giao hàng cho đơn hàng từ 100.000đ. Áp dụng toàn quốc.',
    discount: i % 3 === 0 ? '100%' : i % 3 === 1 ? '50K' : 'Free Ship',
    minOrder: i % 3 === 0 ? '0đ' : i % 3 === 1 ? '200K' : '100K',
    expiryDate: `${day}/${month}/2024`,
    category: category!,
    code: `VOUCHER${String(i + 1).padStart(3, '0')}`,
    status: i % 4 === 0 ? 'used' : i % 8 === 0 ? 'expired' : 'available',
    isNew: i < 3,
    isFavorite: i % 5 === 0,
    usageCount: Math.floor(Math.random() * 100),
    maxUsage: 1000,
  };
});

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>(mockVouchers);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string>('');

  const ITEMS_PER_PAGE = 9;

  // Filter logic
  useState(() => {
    let filtered = vouchers;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((v) => v.category.name === selectedCategory);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.code.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredVouchers(filtered);
    setCurrentPage(1);
  }, [selectedCategory, statusFilter, searchTerm, vouchers]);

  const totalPages = Math.ceil(filteredVouchers.length / ITEMS_PER_PAGE);
  const currentVouchers = filteredVouchers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const getStatusBadge = (status: Voucher['status']) => {
    switch (status) {
      case 'available':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Có thể dùng
          </div>
        );
      case 'used':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã sử dụng
          </div>
        );
      case 'expired':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Hết hạn
          </div>
        );
      default:
        return null;
    }
  };

  const availableCount = vouchers.filter((v) => v.status === 'available').length;
  const usedCount = vouchers.filter((v) => v.status === 'used').length;
  const expiredCount = vouchers.filter((v) => v.status === 'expired').length;

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
          <div className="bg-[#FFD2B2] p-4 sm:p-6 text-[#121212]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Kho Voucher</h1>
                  <p className="text-[#121212] mt-1 text-sm sm:text-base">
                    Khám phá và sử dụng các ưu đãi hấp dẫn
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-[#121212]">Tổng số voucher</p>
                <p className="text-xl sm:text-2xl font-bold">{vouchers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 border border-amber-100">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3">
              <div className="p-2 sm:p-3 bg-green-100 rounded-xl mb-2 sm:mb-0">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">Có thể dùng</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">{availableCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 border border-amber-100">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl mb-2 sm:mb-0">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">Đã sử dụng</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">{usedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 border border-amber-100">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3">
              <div className="p-2 sm:p-3 bg-red-100 rounded-xl mb-2 sm:mb-0">
                <XCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">Hết hạn</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">{expiredCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFD2B2] rounded-2xl shadow-lg p-3 sm:p-6 border border-amber-200">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3">
              <div className="p-2 sm:p-3 bg-[#121212] rounded-xl mb-2 sm:mb-0">
                <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-[#121212]">Yêu thích</p>
                <p className="text-lg sm:text-2xl font-bold text-[#121212]">
                  {vouchers.filter((v) => v.isFavorite).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-amber-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            Danh mục voucher
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">🎯</span>
              <span className="font-medium text-sm sm:text-base">Tất cả</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === category.name
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-xs sm:text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-amber-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm voucher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all text-sm sm:text-base"
                />
              </div>

              {/* Status Filter */}
              <div className="relative w-full md:w-auto">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-8 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all bg-white text-sm sm:text-base"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="available">Có thể dùng</option>
                  <option value="used">Đã sử dụng</option>
                  <option value="expired">Hết hạn</option>
                </select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Vouchers Grid/List */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 border border-amber-100">
          {currentVouchers.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-[#FFD2B2] rounded-2xl flex items-center justify-center mb-6">
                <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-[#121212]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Không tìm thấy voucher
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          ) : (
            <>
              <div
                className={`${
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                    : 'space-y-4'
                }`}
              >
                {currentVouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className={`relative group border border-gray-200 rounded-2xl overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all duration-300 ${
                      viewMode === 'list' ? 'flex items-center p-4' : 'p-4 sm:p-6'
                    }`}
                  >
                    {/* New Badge */}
                    {voucher.isNew && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        MỚI
                      </div>
                    )}

                    {/* Favorite Badge */}
                    {voucher.isFavorite && (
                      <div className="absolute top-2 right-2 z-10">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                      </div>
                    )}

                    {viewMode === 'grid' ? (
                      <>
                        {/* Grid Layout */}
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div
                              className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium ${voucher.category.color}`}
                            >
                              <span className="mr-1">{voucher.category.icon}</span>
                              <span className="hidden sm:inline">{voucher.category.name}</span>
                            </div>
                            {getStatusBadge(voucher.status)}
                          </div>

                          {/* Discount Badge */}
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#FFD2B2] rounded-full text-[#121212] text-lg sm:text-xl font-bold shadow-lg">
                              {voucher.discount}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="text-center space-y-2">
                            <h3 className="font-bold text-gray-800 line-clamp-2 text-sm sm:text-base">
                              {voucher.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                              {voucher.description}
                            </p>
                          </div>

                          {/* Details */}
                          <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                              <span>Đơn tối thiểu:</span>
                              <span className="font-medium">{voucher.minOrder}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Hết hạn:</span>
                              <span className="font-medium">{voucher.expiryDate}</span>
                            </div>
                          </div>

                          {/* Code */}
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm text-gray-600">Mã:</span>
                              <div className="flex items-center space-x-2">
                                <code className="font-mono font-bold text-amber-600 text-xs sm:text-sm">
                                  {voucher.code}
                                </code>
                                <button
                                  onClick={() => handleCopyCode(voucher.code)}
                                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                                >
                                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            disabled={voucher.status !== 'available'}
                            className={`w-full py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                              voucher.status === 'available'
                                ? 'bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] shadow-lg hover:shadow-xl'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {voucher.status === 'available'
                              ? 'Sử dụng ngay'
                              : voucher.status === 'used'
                                ? 'Đã sử dụng'
                                : 'Hết hạn'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List Layout */}
                        <div className="flex-1 flex items-center space-x-3 sm:space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FFD2B2] rounded-xl flex items-center justify-center text-[#121212] font-bold text-sm sm:text-base">
                              {voucher.discount}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                              <h3 className="font-bold text-gray-800 truncate text-sm sm:text-base">
                                {voucher.title}
                              </h3>
                              {getStatusBadge(voucher.status)}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                              {voucher.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-xs text-gray-500">
                              <span>Tối thiểu: {voucher.minOrder}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>Hết hạn: {voucher.expiryDate}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>
                                Mã:{' '}
                                <code className="font-mono font-bold text-amber-600">
                                  {voucher.code}
                                </code>
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={() => handleCopyCode(voucher.code)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                            </button>
                            <button
                              disabled={voucher.status !== 'available'}
                              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
                                voucher.status === 'available'
                                  ? 'bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212]'
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {voucher.status === 'available'
                                ? 'Dùng ngay'
                                : voucher.status === 'used'
                                  ? 'Đã dùng'
                                  : 'Hết hạn'}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Copy Success Message */}
                    {copiedCode === voucher.code && (
                      <div className="absolute inset-0 bg-green-100 bg-opacity-90 flex items-center justify-center rounded-2xl">
                        <div className="text-green-700 font-medium flex items-center text-sm sm:text-base">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Đã sao chép mã!
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Trang trước
                  </button>

                  <div className="flex items-center space-x-2 overflow-x-auto">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                          currentPage === page
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Tips */}
        <div className="bg-[#FFD2B2] rounded-2xl shadow-lg p-4 sm:p-6 border border-amber-200">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-[#121212] rounded-xl">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-[#121212] mb-2">
                💡 Mẹo sử dụng voucher
              </h3>
              <p className="text-[#121212] text-sm leading-relaxed">
                Kiểm tra điều kiện sử dụng và ngày hết hạn của voucher trước khi áp dụng. Một số
                voucher có thể được kết hợp với các chương trình khuyến mãi khác để tối ưu hóa lợi
                ích.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
