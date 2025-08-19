'use client';

import ProductCard from '@/components/product/ProductCard';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import { productApi, TProduct } from '@/services/product.api';
import { motion } from 'framer-motion';
import { Package, RefreshCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProductListEmptyProps {
  title?: string;
  description?: string;
  showRecommendations?: boolean;
  viewMode?: 'grid' | 'list';
  onRetry?: () => void;
  isRetrying?: boolean;
}

export default function ProductListEmpty({
  title = 'Không tìm thấy sản phẩm',
  description = 'Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.',
  showRecommendations = true,
  viewMode = 'grid',
  onRetry,
  isRetrying = false,
}: ProductListEmptyProps) {
  const [recommendations, setRecommendations] = useState<TProduct[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(false);

  const fetchRecommendations = async () => {
    if (!showRecommendations) return;

    setLoadingRecommendations(true);
    setRecommendationsError(false);

    try {
      const randomResponse = await productApi.getProductIdRandom();
      const randomProductId = randomResponse.selectedProductId;

      if (randomProductId) {
        const similarProducts = await productApi.getProductSimilar(randomProductId, 0, 8);
        setRecommendations(similarProducts || []);
      } else {
        throw new Error('No random product ID available');
      }
    } catch (error) {
      setRecommendationsError(true);

      try {
        const bestSellers = await productApi.getproductBestSellers(0, 8);
        setRecommendations(bestSellers || []);
        setRecommendationsError(false);
      } catch (fallbackError) {
        console.error('Error fetching fallback recommendations:', fallbackError);
        setRecommendations([]);
      }
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [showRecommendations]);

  return (
    <div className="space-y-12">
      {/* Empty State Message */}
      <motion.div
        className="flex flex-col items-center justify-center py-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center shadow-lg">
            <Search className="w-12 h-12 text-orange-500" />
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
          </div>

          {onRetry && (
            <div className="pt-4">
              <button
                onClick={onRetry}
                disabled={isRetrying}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-base font-semibold text-white hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Đang thử lại...' : 'Thử lại'}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recommendations Section */}
      {showRecommendations && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Có thể bạn sẽ thích</h2>
            <p className="text-gray-600">Khám phá những sản phẩm tương tự dành cho bạn</p>
          </div>

          {loadingRecommendations ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
              }`}
            >
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : recommendationsError ? (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Không thể tải gợi ý sản phẩm</p>
              <button
                onClick={fetchRecommendations}
                disabled={loadingRecommendations}
                className="inline-flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${loadingRecommendations ? 'animate-spin' : ''}`} />
                {loadingRecommendations ? 'Đang tải...' : 'Thử lại'}
              </button>
            </div>
          ) : recommendations.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
              }`}
            >
              {recommendations.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.currentPrice}
                    image={product.thumbnail}
                    shortDescription={product.shortDescription}
                    brand={product.brand}
                    verified={product.verified}
                    sellerShopName={product.sellerShopName}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </div>
          ) : null}
        </motion.div>
      )}
    </div>
  );
}
