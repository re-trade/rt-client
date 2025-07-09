import { motion } from 'framer-motion';

const ProductCardSkeleton = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden"
  >
    <div className="animate-pulse">
      <div className="bg-gradient-to-r from-orange-100 to-orange-200 h-48 w-full"></div>

      <div className="p-4 space-y-3">
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 rounded w-3/4"></div>
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 rounded w-1/2"></div>

        <div className="bg-gradient-to-r from-orange-200 to-orange-300 h-6 rounded w-1/3"></div>

        <div className="flex justify-between items-center">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-3 rounded w-1/4"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-3 rounded w-1/3"></div>
        </div>

        <div className="bg-gradient-to-r from-orange-200 to-orange-300 h-10 rounded-lg w-full"></div>
      </div>
    </div>
  </motion.div>
);

export default ProductCardSkeleton;
