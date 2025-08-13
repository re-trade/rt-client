'use client';

import ImageGallery from '@components/gallery/ImageGallery';
import { reviewApi, ReviewResponse } from '@services/product-review.api';
import { Calendar, ChevronDown, ChevronUp, MessageCircle, Star, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const AVATAR_PLACEHOLDER = '/placeholder-avatar.png';
const REVIEW_IMAGE_PLACEHOLDER = '/placeholder-review-image.png';

interface ReviewProps {
  productId: string;
  totalReviews?: number;
}

type SafeImageUrl = string;

const ReviewsList = ({ productId, totalReviews = 0 }: ReviewProps) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<SafeImageUrl[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [ratingStats, setRatingStats] = useState<Record<number, number>>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [averageRating, setAverageRating] = useState(0);

  const fetchReviews = async (page: number = 0, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const pageSize = 4;
      const data = await reviewApi.getReviews(productId, page, pageSize);

      const validatedData = data.map((review) => ({
        ...review,
        author: {
          ...review.author,
          name: review.author?.name || 'Khách hàng',
          avatarUrl: AVATAR_PLACEHOLDER,
        },
        images: Array.isArray(review.images)
          ? review.images.map(() => REVIEW_IMAGE_PLACEHOLDER)
          : [],
      }));

      if (append) {
        setReviews((prev) => [...prev, ...validatedData]);
      } else {
        setReviews(validatedData);

        const stats: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let sum = 0;

        validatedData.forEach((review) => {
          const rating = Math.round(review.vote);
          if (rating >= 1 && rating <= 5) {
            stats[rating as keyof typeof stats] = (stats[rating as keyof typeof stats] || 0) + 1;
            sum += review.vote;
          }
        });

        setRatingStats(stats);
        setAverageRating(
          validatedData.length > 0 ? Number((sum / validatedData.length).toFixed(1)) : 0,
        );
      }

      setHasMoreReviews(validatedData.length === pageSize);
    } catch {
      if (!append) {
        setReviews([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
    setHasMoreReviews(true);
    fetchReviews(0, false);
  }, [productId]);

  const loadMoreReviews = () => {
    if (!loadingMore && hasMoreReviews) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchReviews(nextPage, true);
    }
  };

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const updated = new Set(prev);
      updated.has(reviewId) ? updated.delete(reviewId) : updated.add(reviewId);
      return updated;
    });
  };

  const renderStars = (vote: number, size = 16) =>
    Array.from({ length: 5 }, (_, index) => {
      const isFilled = index < Math.floor(vote);
      const isHalf = !isFilled && index < Math.ceil(vote) && vote % 1 >= 0.4;

      return (
        <Star
          key={index}
          size={size}
          className={
            isFilled
              ? 'text-yellow-400 fill-current'
              : isHalf
                ? 'text-yellow-400 fill-current opacity-60'
                : 'text-gray-300'
          }
        />
      );
    });

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
    const index = name && name.length > 0 ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const truncateText = (text: string, maxLength = 150) =>
    text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;

  const openGallery = (images: SafeImageUrl[], index: number) => {
    const placeholders = Array(images.length).fill(REVIEW_IMAGE_PLACEHOLDER);
    setGalleryImages(placeholders);
    setGalleryIndex(Math.min(index, Math.max(0, placeholders.length - 1)));
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
        <div className="bg-white rounded-xl shadow-md border border-orange-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-orange-100">
              <h3 className="font-semibold text-gray-700 mb-2">Đánh giá trung bình</h3>
              <div className="text-4xl font-bold text-orange-600 mb-2">{averageRating}</div>
              <div className="flex items-center gap-1 mb-3">{renderStars(averageRating, 20)}</div>
              <p className="text-sm text-gray-500">
                Dựa trên {totalReviews || reviews.length} đánh giá
              </p>
            </div>

            <div className="w-full md:w-2/3 p-4">
              <h3 className="font-semibold text-gray-700 mb-4">Phân bố đánh giá</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingStats[rating] || 0;
                  const percentage =
                    totalReviews && totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="w-16 text-sm text-gray-600 flex items-center gap-1">
                        <span>{rating}</span>
                        <Star size={12} className="text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-12 text-xs text-gray-500 text-right">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 space-y-3">
              <div className="h-6 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 animate-pulse rounded w-32" />
              <div className="h-12 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 animate-pulse rounded w-full" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-3/4" />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-full" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-16" />
                    <div className="h-2 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 animate-pulse rounded flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Star size={40} className="text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3" style={{ color: '#1f2937' }}>
            Chưa có đánh giá nào
          </h3>
          <p className="text-gray-600 max-w-md mx-auto" style={{ color: '#6b7280' }}>
            Hãy là người đầu tiên đánh giá sản phẩm này sau khi mua hàng.
          </p>
          <button className="mt-6 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm hover:shadow-md">
            Mua ngay để đánh giá
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto scroll-smooth">
      {reviews.map((review) => {
        const isExpanded = expandedReviews.has(review.id);
        const shouldTruncate = review.content.length > 150;

        return (
          <div
            key={review.id}
            className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                  {review.author.avatarUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src="/placeholder-avatar.png"
                        alt={review.author.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const parent = e.currentTarget.parentElement?.parentElement;
                          if (parent) {
                            parent.style.backgroundColor = getColorFromName(review.author.name);
                            parent.innerHTML = `<span>${review.author.name.charAt(0).toUpperCase()}</span>`;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className={`${getBgColor(review.author.name)} w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                    >
                      {review.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900" style={{ color: '#111827' }}>
                      {review.author.name}
                    </h4>
                    <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full border border-orange-100">
                      Đã mua hàng
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
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

              <div className="mb-3">
                <p
                  className={`text-gray-700 leading-relaxed text-start ${isExpanded ? 'animate-fadeIn' : ''}`}
                  style={{ color: '#374151' }}
                >
                  {shouldTruncate && !isExpanded ? truncateText(review.content) : review.content}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => toggleExpand(review.id)}
                    className="text-orange-600 hover:text-orange-700 text-sm mt-1 flex items-center gap-1 font-medium transition-colors hover:bg-orange-50 rounded-full px-3 py-1"
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
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    Hình ảnh từ khách hàng
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {review.images.map((url, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden"
                        onClick={() => openGallery(review.images, index)}
                      >
                        <div className="relative w-16 h-16 rounded-lg border border-orange-100 group-hover:border-orange-300 transition-all duration-300 shadow-sm overflow-hidden">
                          <Image
                            src="/placeholder-review-image.png"
                            alt={`Hình đánh giá sản phẩm ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-all duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="m16 12-4 4-4-4m4 4V8" />
                            </svg>
                            {index + 1}/{review.images.length}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply */}
              {review.reply && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-25 border-l-4 border-orange-400 p-5 rounded-r-xl mb-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MessageCircle size={16} className="text-orange-600" />
                    </div>
                    <div>
                      <span
                        className="font-semibold text-orange-900 text-sm block"
                        style={{ color: '#9a3412' }}
                      >
                        Phản hồi từ shop
                      </span>
                      <span className="text-xs text-gray-600" style={{ color: '#6b7280' }}>
                        {formatDate(review.reply.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-gray-700 text-sm leading-relaxed pl-10"
                    style={{ color: '#374151' }}
                  >
                    {review.reply.content}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-orange-100">
                <button className="flex items-center gap-2 text-gray-500 hover:text-orange-600 text-sm font-medium transition-colors group px-3 py-1 rounded-full hover:bg-orange-50">
                  <ThumbsUp size={16} className="group-hover:scale-110 transition-transform" />
                  Hữu ích ({review.helpful || 0})
                </button>
                <div className="text-xs text-gray-400">
                  {review.vote === 5 && '⭐ Đánh giá xuất sắc'}
                  {review.vote === 4 && '👍 Đánh giá tốt'}
                </div>
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
      {reviews.length > 0 && hasMoreReviews && (
        <div className="text-center pt-4">
          <button
            onClick={loadMoreReviews}
            disabled={loadingMore}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang tải...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m16 12-4 4-4-4m4 4V8" />
                </svg>
                Xem thêm {Math.max(0, totalReviews - reviews.length)} đánh giá
              </>
            )}
          </button>
          <p className="text-gray-500 text-sm mt-2">
            Hiển thị {reviews.length} trong tổng số {totalReviews} đánh giá
          </p>
        </div>
      )}

      {reviews.length > 0 && !hasMoreReviews && (
        <div className="text-center pt-4">
          <p className="text-gray-500 text-sm">Đã hiển thị tất cả {reviews.length} đánh giá</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
