'use client';

import { ProductNoReview } from '@/services/product-review.api';
import ReviewForm from '@components/common/review/ReviewForm';
import { Calendar, Package } from 'lucide-react';
import { useState } from 'react';

interface PendingReviewsTabProps {
  products: ProductNoReview[];
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
  onReviewSubmit: (productId: string, reviewData: any) => void;
}

export function PendingReviewsTab({
  products,
  formatPrice,
  formatDate,
  onReviewSubmit,
}: PendingReviewsTabProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Không có sản phẩm nào chờ đánh giá
        </h3>
        <p className="text-gray-500">
          Tất cả sản phẩm đã được đánh giá hoặc chưa có đơn hàng nào hoàn thành
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={`${product.orderId}-${product.product.id}`}
          className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <img
              src={product.product.thumbnail || '/placeholder-image.png'}
              alt={product.product.name}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">{product.product.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(product.orderDate)}</span>
                </span>
                <span>Mã đơn: {product.orderId}</span>
                <span className="font-medium text-orange-600">
                  {formatPrice(product.product.currentPrice)}
                </span>
              </div>

              {selectedProduct === product.product.id ? (
                <ReviewForm
                  product={product}
                  onSubmit={(reviewData) => {
                    onReviewSubmit(product.product.id, reviewData);
                    setSelectedProduct(null);
                  }}
                  onCancel={() => setSelectedProduct(null)}
                />
              ) : (
                <button
                  onClick={() => setSelectedProduct(product.product.id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Viết đánh giá
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
