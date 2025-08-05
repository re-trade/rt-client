'use client';

import { ProductNoReview, ReviewResponse, reviewApi } from '@/services/product-review.api';
import { MyReviewsTab } from '@components/common/review/MyReviewsTab';
import { PendingReviewsTab } from '@components/common/review/PendingReviewsTab';
import { Package, RefreshCw, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'myReviews'>('pending');
  const [productsNoReview, setProductsNoReview] = useState<ProductNoReview[]>([]);
  const [myReviews, setMyReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const formatPrice = useMemo(() => {
    return (price: number) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsResponse, reviewsResponse] = await Promise.all([
          reviewApi.getProductBuyNoReview(),
          reviewApi.getMyReviews(),
        ]);
        console.log('Fetched products:', productsResponse);
        console.log('Fetched reviews:', reviewsResponse);
        setProductsNoReview(productsResponse);
        setMyReviews(reviewsResponse);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProductsNoReview = useMemo(() => {
    return productsNoReview.filter(
      (product) =>
        product.product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.orderId.toLowerCase().includes(search.toLowerCase()),
    );
  }, [productsNoReview, search]);

  const filteredMyReviews = useMemo(() => {
    return myReviews.filter(
      (review) =>
        review.product.productName.toLowerCase().includes(search.toLowerCase()) ||
        review.orderId.toLowerCase().includes(search.toLowerCase()),
    );
  }, [myReviews, search]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [productsResponse, reviewsResponse] = await Promise.all([
        reviewApi.getProductBuyNoReview(),
        reviewApi.getMyReviews(),
      ]);
      setProductsNoReview(productsResponse);
      setMyReviews(reviewsResponse);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = (
    productId: string,
    reviewData: { rating: number; comment: string; images: string[] },
  ) => {
    const product = productsNoReview.find((p) => p.product.id === productId);
    if (!product) return;

    const newReview: ReviewResponse = {
      id: Date.now().toString(),
      product: {
        productId: productId,
        productName: product.product.name,
        thumbnailUrl: product.product.thumbnail,
      },
      isVerifiedPurchase: true,
      content: reviewData.comment,
      author: {
        authId: 'current-user', // Thay bằng authId thực tế
        name: 'Current User', // Thay bằng tên người dùng thực tế
        avatarUrl: undefined,
      },
      vote: reviewData.rating,
      status: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderId: product.orderId,
      helpful: 0,
      images: reviewData.images,
    };

    setMyReviews((prev) => [newReview, ...prev]);
    setProductsNoReview((prev) => prev.filter((p) => p.product.id !== productId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-orange-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Đánh giá sản phẩm</h1>
                  <p className="text-gray-600 mt-1">Chia sẻ trải nghiệm của bạn về các sản phẩm</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md border border-orange-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Chờ đánh giá ({filteredProductsNoReview.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('myReviews')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'myReviews'
                  ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Đánh giá của tôi ({filteredMyReviews.length})</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'pending' ? (
              <PendingReviewsTab
                products={filteredProductsNoReview}
                formatPrice={formatPrice}
                formatDate={formatDate}
                onReviewSubmit={handleReviewSubmit}
              />
            ) : (
              <MyReviewsTab reviews={filteredMyReviews} formatDate={formatDate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
