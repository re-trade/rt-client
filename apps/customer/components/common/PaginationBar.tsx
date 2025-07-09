import { motion } from 'framer-motion';

const PaginationBar = ({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div
      className="flex justify-center mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="btn-group shadow-lg">
        <button
          className="btn btn-outline border-orange-200 hover:bg-orange-500 hover:border-orange-500 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          «
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            className={`btn ${
              page === currentPage
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500'
                : page === '...'
                  ? 'btn-disabled'
                  : 'btn-outline border-orange-200 hover:bg-orange-500 hover:border-orange-500'
            }`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || loading}
          >
            {page}
          </button>
        ))}
        <button
          className="btn btn-outline border-orange-200 hover:bg-orange-500 hover:border-orange-500 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          »
        </button>
      </div>
    </motion.div>
  );
};

export default PaginationBar;
