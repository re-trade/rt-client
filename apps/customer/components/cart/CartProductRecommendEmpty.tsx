'use client';

import ProductSectionEmpty from '@components/product/ProductSectionEmpty';
import { Package } from 'lucide-react';

interface CartProductRecommendEmptyProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function CartProductRecommendEmpty({
  onRefresh,
  isRefreshing = false,
}: CartProductRecommendEmptyProps) {
  return (
    <ProductSectionEmpty
      title="Không có sản phẩm đề xuất"
      description="Hiện tại chúng tôi chưa có sản phẩm đề xuất phù hợp. Hãy khám phá các sản phẩm khác hoặc thử lại sau."
      icon={Package}
      showBrowseButton={true}
      showRefreshButton={!!onRefresh}
      showCategories={true}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      browseButtonText="Khám phá sản phẩm"
      browseButtonPath="/product"
      size="md"
    />
  );
}
