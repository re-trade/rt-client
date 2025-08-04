'use client';

import { reviewApi, ReviewResponse } from '@/services/product-review.api';
import { Calendar, ChevronDown, ChevronUp, MessageCircle, Star, ThumbsUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReviewProps {
  productId: string;
}

type SelectedImage = {
  urls: string[];
  index: number;
} | null;

const ReviewsList = ({ productId }: ReviewProps) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [selectedImages, setSelectedImages] = useState<SelectedImage>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewApi.getReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
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
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-emerald-500',
    ];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index];
  };
  const getColorFromName = (name: string) => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#6366f1'];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const truncateText = (text: string, maxLength = 150) =>
    text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {reviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const shouldTruncate = review.content.length > 150;

          return (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Author Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {review.author.avatarUrl ? (
                      <img
                        src={review.author.avatarUrl}
                        alt={review.author.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          // Ẩn ảnh khi bị lỗi và hiển thị fallback bằng cách xóa src
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';

                          // Thêm fallback vào element cha
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
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{review.author.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">{renderStars(review.vote)}</div>
                      <span className="text-sm text-gray-500">•</span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={12} />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-gray-700 text-start">
                    {shouldTruncate && !isExpanded
                      ? truncateText(review.content)
                      : review.content}
                  </p>
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(review.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 flex items-center gap-1"
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
                {Array.isArray(review.imageUrls) && review.imageUrls.length > 0 && (
                  <div className="mb-4">
                    <div className="flex gap-2 flex-wrap">
                      {review.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Hình đánh giá ${index + 1}`}
                          className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80"
                          onClick={() =>
                            setSelectedImages({ urls: review.imageUrls, index })
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply */}
                {review.reply && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle size={16} className="text-blue-600" />
                      <span className="font-semibold text-blue-900 text-sm">Phản hồi từ shop</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.reply.content}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm">
                    <ThumbsUp size={16} />
                    Hữu ích ({review.helpful| 0})
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Modal */}
      {selectedImages && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-3xl max-h-full">
            <img
              src={selectedImages.urls[selectedImages.index]}
              alt="Hình đánh giá"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImages(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Load more (chưa xử lý logic phân trang) */}
      <div className="mt-8 text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
          Xem thêm đánh giá
        </button>
      </div>
    </div>
  );
};

export default ReviewsList;
