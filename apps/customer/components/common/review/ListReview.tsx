import { reviewApi, ReviewResponse } from '@/services/product-review.api';
import { Calendar, ChevronDown, ChevronUp, MessageCircle, Star, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
// Mock data dựa trên ReviewResponse type
const mockReviews = [
  {
    id: '1',
    product: {
      productId: 'prod-1',
      productName: 'iPhone 15 Pro Max 256GB',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
    },
    isVerifiedPurchase: true,
    content:
      'Sản phẩm tuyệt vời! Chất lượng camera rất tốt, pin trâu, thiết kế sang trọng. Mình rất hài lòng với mua hàng này. Shop giao hàng nhanh, đóng gói cẩn thận.',
    author: {
      authId: 'user-1',
      name: 'Nguyễn Văn An',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    },
    vote: 5,
    status: true,
    createdAt: '2024-07-15T10:30:00Z',
    updatedAt: '2024-07-15T10:30:00Z',
    orderId: 'order-123',
    helpful: 15,
    imageUrls: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop',
    ],
    reply: {
      content:
        'Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm của chúng tôi! Chúc bạn sử dụng sản phẩm vui vẻ.',
      createdAt: '2024-07-15T14:00:00Z',
    },
  },
  {
    id: '2',
    product: {
      productId: 'prod-2',
      productName: 'MacBook Air M2 13 inch',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop',
    },
    isVerifiedPurchase: true,
    content:
      'Laptop rất nhẹ và mạnh mẽ. Hiệu năng M2 thật sự ấn tượng, pin sử dụng cả ngày không cần sạc. Thiết kế đẹp, bàn phím gõ rất êm. Đáng đồng tiền bát gạo!',
    author: {
      authId: 'user-2',
      name: 'Trần Thị Bình',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    },
    vote: 5,
    status: true,
    createdAt: '2024-07-10T08:15:00Z',
    updatedAt: '2024-07-10T08:15:00Z',
    orderId: 'order-124',
    helpful: 8,
    imageUrls: [],
    reply: {
      content:
        'Rất vui khi bạn hài lòng với sản phẩm. Chúng tôi luôn cam kết mang đến những sản phẩm chất lượng tốt nhất!',
      createdAt: '2024-07-10T16:30:00Z',
    },
  },
  {
    id: '3',
    product: {
      productId: 'prod-3',
      productName: 'Samsung Galaxy S24 Ultra',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop',
    },
    isVerifiedPurchase: false,
    content:
      'Điện thoại tốt nhưng giá hơi cao. Camera zoom 100x thật sự ấn tượng, màn hình sắc nét. Tuy nhiên pin hơi yếu khi sử dụng nhiều. Nhìn chung vẫn là một sản phẩm đáng mua.',
    author: {
      authId: 'user-3',
      name: 'Lê Minh Châu',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    },
    vote: 4,
    status: true,
    createdAt: '2024-07-08T15:45:00Z',
    updatedAt: '2024-07-08T15:45:00Z',
    orderId: 'order-125',
    helpful: 3,
    imageUrls: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop',
    ],
  },
  {
    id: '4',
    product: {
      productId: 'prod-4',
      productName: 'AirPods Pro 2nd Generation',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&h=100&fit=crop',
    },
    isVerifiedPurchase: true,
    content:
      'Chất lượng âm thanh tuyệt vời, chống ồn rất hiệu quả. Kết nối với iPhone rất mượt mà. Hộp sạc nhỏ gọn, tiện lợi. Giá hơi đắt nhưng xứng đáng với chất lượng.',
    author: {
      authId: 'user-4',
      name: 'Phạm Đức Thành',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    },
    vote: 5,
    status: true,
    createdAt: '2024-07-05T12:20:00Z',
    updatedAt: '2024-07-05T12:20:00Z',
    orderId: 'order-126',
    helpful: 12,
    imageUrls: [],
  },
  {
    id: '5',
    product: {
      productId: 'prod-5',
      productName: 'iPad Pro 11 inch M4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop',
    },
    isVerifiedPurchase: true,
    content:
      'Hiệu năng mạnh mẽ, màn hình đẹp. Rất phù hợp cho công việc thiết kế và học tập. Apple Pencil hoạt động mượt mà. Tuy nhiên giá khá cao so với mặt bằng chung.',
    author: {
      authId: 'user-5',
      name: 'Hoàng Thị Mai',
      avatarUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    },
    vote: 4,
    status: true,
    createdAt: '2024-07-02T09:10:00Z',
    updatedAt: '2024-07-02T09:10:00Z',
    orderId: 'order-127',
    helpful: 7,
    imageUrls: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=200&h=200&fit=crop',
    ],
  },
];

interface ReviewProps {
  productId: string;
}
const ReviewsList = ({ productId }: ReviewProps) => {
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [selectedImages, setSelectedImages] = useState(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>(mockReviews);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewApi.getReviews(productId); // Thay "prod-1" bằng productId thực tế
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const toggleExpand = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const renderStars = (vote) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < vote ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {mockReviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const shouldTruncate = review.content.length > 150;

          return (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Header với thông tin sản phẩm */}

              {/* Nội dung đánh giá */}
              <div className="p-6">
                {/* Thông tin người đánh giá */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={
                      review.author.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author.name)}&background=6366f1&color=fff`
                    }
                    alt={review.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
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

                {/* Nội dung đánh giá */}
                <div className="mb-4">
                  <p className="text-gray-700 text-start">
                    {shouldTruncate && !isExpanded ? truncateText(review.content) : review.content}
                  </p>
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(review.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 flex items-center gap-1 transition-colors"
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

                {/* Hình ảnh đánh giá */}
                {review.imageUrls.length > 0 && (
                  <div className="mb-4">
                    <div className="flex gap-2 flex-wrap">
                      {review.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Hình đánh giá ${index + 1}`}
                          className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedImages({ urls: review.imageUrls, index })}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Phản hồi từ shop */}
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
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <ThumbsUp size={16} />
                    <span className="text-sm">Hữu ích ({review.helpful})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal xem ảnh */}
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
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hiển thị thêm reviews */}
      <div className="mt-8 text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Xem thêm đánh giá
        </button>
      </div>
    </div>
  );
};

export default ReviewsList;
