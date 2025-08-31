'use client';

import { ProductDetailHeader } from '@/components/product/ProductDetailHeader';
import { ProductDetailSkeleton } from '@/components/product/ProductDetailSkeleton';
import { ProductDetailsTabs } from '@/components/product/ProductDetailsTabs';
import { ProductHistory } from '@/components/product/ProductHistory';
import { ProductInfoCard } from '@/components/product/ProductInfoCard';
import { ProductNotFound } from '@/components/product/ProductNotFound';
import { ProductQuickActions } from '@/components/product/ProductQuickActions';
import { ProductSellerProfile } from '@/components/product/ProductSellerProfile';
import { useProductDetail } from '@/hooks/use-product-detail';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const {
    product,
    sellerProfile,
    productHistory,
    loading,
    historyLoading,
    sellerLoading,
    actionLoading,
    handleVerifyProduct,
    handleUnverifyProduct,
    refetchProduct,
    refetchProductHistory,
  } = useProductDetail(productId);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <ProductDetailHeader productId={product.id} loading={loading} onRefresh={refetchProduct} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <ProductInfoCard product={product} />
          <ProductDetailsTabs product={product} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProductQuickActions
            product={product}
            actionLoading={actionLoading}
            onVerify={handleVerifyProduct}
            onUnverify={handleUnverifyProduct}
          />

          <ProductSellerProfile
            product={product}
            sellerProfile={sellerProfile}
            sellerLoading={sellerLoading}
          />

          <ProductHistory
            productHistory={productHistory}
            historyLoading={historyLoading}
            onRefreshHistory={refetchProductHistory}
          />
        </div>
      </div>
    </div>
  );
}
