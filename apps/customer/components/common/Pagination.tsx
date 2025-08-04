import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';

export const paginationThemes = {
  default: {
    container:
      'bg-gradient-to-r from-white to-orange-50 rounded-lg border border-orange-200 p-6 shadow-sm',
    button:
      'px-3 py-2 rounded-lg border border-orange-200 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 text-gray-600 transition-all duration-200 font-medium',
    activeButton:
      'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-md hover:from-orange-600 hover:to-orange-700',
    disabledButton:
      'opacity-50 cursor-not-allowed hover:bg-white hover:text-gray-600 hover:border-orange-200',
    dotButton:
      'border-transparent text-gray-400 cursor-default hover:bg-transparent hover:text-gray-400',
    infoText: 'text-sm text-gray-600',
    loadingSpinner: 'border-orange-500',
  },
  purchase: {
    container: 'bg-white rounded-xl shadow-md border border-orange-200 p-6',
    button:
      'px-3 py-2 rounded-lg border border-orange-200 bg-white hover:bg-orange-100 hover:border-orange-300 text-gray-800 transition-all duration-200',
    activeButton: 'bg-orange-500 border-orange-500 text-white shadow-md',
    disabledButton:
      'opacity-50 cursor-not-allowed disabled:hover:bg-white disabled:hover:border-orange-200',
    dotButton: 'border-transparent text-gray-400 cursor-default',
    infoText: 'text-sm text-gray-600',
    loadingSpinner: 'border-orange-500',
  },
  minimal: {
    container: 'p-4',
    button:
      'px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors',
    activeButton: 'bg-gray-900 border-gray-900 text-white',
    disabledButton: 'opacity-50 cursor-not-allowed',
    dotButton: 'border-transparent text-gray-400 cursor-default',
    infoText: 'text-sm text-gray-500',
    loadingSpinner: 'border-gray-900',
  },
} as const;

export type PaginationTheme = keyof typeof paginationThemes;

export interface PaginationProps {
  // Core pagination props
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  // Optional display props
  totalElements?: number;
  loading?: boolean;

  // Customization props
  theme?: PaginationTheme;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
  showQuickJump?: boolean;
  quickJumpThreshold?: number;
  delta?: number; // Number of pages to show around current page

  // Animation props
  animated?: boolean;

  // Custom styling
  className?: string;

  // Labels for internationalization
  labels?: {
    previous?: string;
    next?: string;
    goToPage?: string;
    showingText?: string;
    ofText?: string;
    totalText?: string;
    pageText?: string;
  };
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalElements,
  loading = false,
  theme = 'default',
  size = 'md',
  showInfo = true,
  showQuickJump = true,
  quickJumpThreshold = 10,
  delta = 2,
  animated = true,
  className = '',
  labels = {},
}: PaginationProps) => {
  // Default labels
  const defaultLabels = {
    previous: 'Trước',
    next: 'Sau',
    goToPage: 'Đi đến trang:',
    showingText: 'Hiển thị trang',
    ofText: 'của',
    totalText: 'Tổng cộng',
    pageText: 'trang',
    ...labels,
  };

  const themeConfig = paginationThemes[theme];

  // Don't render if there's only one page or no data
  if (totalPages <= 1) return null;

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'min-w-[32px] h-8 px-2 py-1 text-xs',
      container: size === 'sm' && theme === 'purchase' ? 'p-4' : '',
      gap: 'gap-1',
    },
    md: {
      button: 'min-w-[40px] h-10 px-3 py-2 text-sm',
      container: '',
      gap: 'gap-2',
    },
    lg: {
      button: 'min-w-[48px] h-12 px-4 py-3 text-base',
      container: size === 'lg' && theme === 'purchase' ? 'p-8' : '',
      gap: 'gap-3',
    },
  };

  const currentSizeConfig = sizeConfig[size];

  const getVisiblePages = () => {
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show around current page
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page and dots if needed
    if (currentPage - delta > 1) {
      rangeWithDots.push(1);
      if (currentPage - delta > 2) {
        rangeWithDots.push('...');
      }
    }

    rangeWithDots.push(...range);

    // Add last page and dots if needed
    if (currentPage + delta < totalPages) {
      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const handleQuickJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages && !loading) {
      onPageChange(page);
    }
  };

  // All themes use the same structure
  const containerClasses = `${themeConfig.container} ${currentSizeConfig.container} ${className}`;

  return (
    <div className={containerClasses}>
      {/* Pagination Info */}
      {showInfo && (totalElements !== undefined || theme === 'purchase') && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className={themeConfig.infoText}>
            {totalElements !== undefined ? (
              <>
                {defaultLabels.showingText}{' '}
                <span className="font-semibold text-gray-900">{currentPage}</span>{' '}
                {defaultLabels.ofText}{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span> (
                {defaultLabels.totalText}{' '}
                <span className="font-semibold text-gray-900">{totalElements}</span>{' '}
                {totalElements === 1 ? 'mục' : 'mục'})
              </>
            ) : (
              <>
                {defaultLabels.pageText}{' '}
                <span className="font-semibold text-gray-900">{currentPage}</span>{' '}
                {defaultLabels.ofText}{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </>
            )}
          </div>

          {loading && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div
                className={`animate-spin rounded-full h-4 w-4 border-2 ${themeConfig.loadingSpinner} border-t-transparent`}
              ></div>
              <span>Đang tải...</span>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className={`flex flex-wrap justify-center items-center ${currentSizeConfig.gap}`}>
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || loading}
          className={`flex items-center space-x-1 ${themeConfig.button} ${currentSizeConfig.button} font-medium ${
            currentPage === 1 || loading ? themeConfig.disabledButton : ''
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{defaultLabels.previous}</span>
        </button>

        {/* Page Numbers */}
        <div className={`flex items-center ${currentSizeConfig.gap}`}>
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              disabled={page === '...' || loading}
              className={`${currentSizeConfig.button} border transition-all duration-200 font-medium ${
                page === currentPage
                  ? themeConfig.activeButton
                  : page === '...'
                    ? themeConfig.dotButton
                    : themeConfig.button
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || loading}
          className={`flex items-center space-x-1 ${themeConfig.button} ${currentSizeConfig.button} font-medium ${
            currentPage === totalPages || loading ? themeConfig.disabledButton : ''
          }`}
        >
          <span className="hidden sm:inline">{defaultLabels.next}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Jump (for larger datasets) */}
      {showQuickJump && totalPages > quickJumpThreshold && (
        <div
          className={`flex justify-center items-center gap-2 mt-4 pt-4 ${
            theme === 'default' ? 'border-t border-orange-200' : 'border-t border-gray-200'
          }`}
        >
          <span className={themeConfig.infoText}>{defaultLabels.goToPage}</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={handleQuickJump}
            disabled={loading}
            className={`w-16 px-2 py-1 text-sm border rounded-md text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === 'purchase'
                ? 'border-gray-300 focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2]'
                : 'border-orange-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-600'
            }`}
          />
          <span className={themeConfig.infoText}>/ {totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default memo(Pagination);
