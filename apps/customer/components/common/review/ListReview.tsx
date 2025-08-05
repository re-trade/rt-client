'use client';

import { reviewApi, ReviewResponse } from '@/services/product-review.api';
import ImageGallery from '@components/gallery/ImageGallery';
import { Calendar, ChevronDown, ChevronUp, MessageCircle, Star, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReviewProps {
  productId: string;
}

const ReviewsList = ({ productId }: ReviewProps) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewApi.getReviews(productId);
        console.log('Fetched reviews:', data);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const updated = new Set(prev);
      updated.has(reviewId) ? updated.delete(reviewId) : updated.add(reviewId);
      return updated;
    });
  };

  const renderStars = (vote: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < vote ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getBgColor = (name: string) => {
    const colors = [
      'bg-orange-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-emerald-500',
      'bg-pink-500',
    ];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getColorFromName = (name: string) => {
    const colors = [
      '#ea580c',
      '#3b82f6',
      '#10b981',
      '#ef4444',
      '#8b5cf6',
      '#6366f1',
      '#059669',
      '#ec4899',
    ];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const truncateText = (text: string, maxLength = 150) =>
    text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;

  const openGallery = (images: string[], index: number) => {
    setGalleryImages(images);
    setGalleryIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const nextImage = () => {
    setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleGalleryIndexChange = (index: number) => {
    setGalleryIndex(index);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 animate-pulse rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 animate-pulse rounded w-24" />
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-32" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-full" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star size={32} className="text-orange-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: '#1f2937' }}>
          Chưa có đánh giá nào
        </h3>
        <p className="text-gray-600" style={{ color: '#6b7280' }}>
          Hãy là người đầu tiên đánh giá sản phẩm này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const isExpanded = expandedReviews.has(review.id);
        const shouldTruncate = review.content.length > 150;

        return (
          <div
            key={review.id}
            className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all duration-200"
          >
            <div className="p-6">
              {/* Author Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                  {review.author.avatarUrl ? (
                    <img
                      src={review.author.avatarUrl}
                      alt={review.author.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.style.backgroundColor = getColorFromName(review.author.name);
                          parent.textContent = review.author.name?.charAt(0).toUpperCase();
                        }
                      }}
                    />
                  ) : (
                    <div
                      className={`${getBgColor(review.author.name)} w-full h-full flex items-center justify-center`}
                    >
                      {review.author.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900" style={{ color: '#111827' }}>
                      {review.author.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1">{renderStars(review.vote)}</div>
                    <span className="text-sm text-gray-400" style={{ color: '#9ca3af' }}>
                      •
                    </span>
                    <div
                      className="flex items-center gap-1 text-sm text-gray-600"
                      style={{ color: '#6b7280' }}
                    >
                      <Calendar size={12} />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p
                  className="text-gray-700 leading-relaxed text-start"
                  style={{ color: '#374151' }}
                >
                  {shouldTruncate && !isExpanded ? truncateText(review.content) : review.content}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => toggleExpand(review.id)}
                    className="text-orange-600 hover:text-orange-700 text-sm mt-2 flex items-center gap-1 font-medium transition-colors"
                    style={{ color: '#ea580c' }}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={16} />
                        Thu gọn
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Xem thêm
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Images */}
              {Array.isArray(review.images) && review.images.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-3 flex-wrap">
                    {review.images.map((url, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => openGallery(review.images, index)}
                      >
                        <img
                          src={url}
                          alt={`Hình đánh giá ${index + 1}`}
                          className="w-20 h-20 rounded-lg object-cover border border-orange-100 group-hover:border-orange-300 transition-all duration-200 group-hover:scale-105 shadow-sm"
                        />
                        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200" /> */}
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white px-1 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {index + 1}/{review.images.length}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply */}
              {review.reply && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-25 border-l-4 border-orange-400 p-4 rounded-r-xl mb-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={16} className="text-orange-600" />
                    <span
                      className="font-semibold text-orange-900 text-sm"
                      style={{ color: '#9a3412' }}
                    >
                      Phản hồi từ shop
                    </span>
                    <span className="text-xs text-gray-400" style={{ color: '#9ca3af' }}>
                      •
                    </span>
                    <span className="text-xs text-gray-600" style={{ color: '#6b7280' }}>
                      {formatDate(review.reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed" style={{ color: '#374151' }}>
                    {review.reply.content}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-orange-100">
                <button className="flex items-center gap-2 text-gray-500 hover:text-orange-600 text-sm font-medium transition-colors group">
                  <ThumbsUp size={16} className="group-hover:scale-110 transition-transform" />
                  Hữu ích ({review.helpful || 0})
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Image Gallery */}
      <ImageGallery
        images={galleryImages}
        currentIndex={galleryIndex}
        isOpen={showGallery}
        onClose={closeGallery}
        onNext={nextImage}
        onPrevious={prevImage}
        onIndexChange={handleGalleryIndexChange}
        productName="Hình ảnh đánh giá"
      />

      {/* Load more button */}
      {reviews.length > 0 && (
        <div className="text-center pt-6">
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
            Xem thêm đánh giá
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
