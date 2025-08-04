'use client';

import {
  Calendar,
  MessageCircle,
  Package,
  RefreshCw,
  Search,
  Send,
  Star,
  ThumbsUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Mock data types
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  orderDate: string;
  orderId: string;
}

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  orderId: string;
  helpful: number;
}

// Mock data
const mockPendingProducts: Product[] = [
  {
    id: '1',
    name: 'Combo Gà Rán Giòn Tan + Coca Cola',
    image: '/api/placeholder/150/150',
    price: 159000,
    orderDate: '2024-01-15',
    orderId: 'ORD001',
  },
  {
    id: '2',
    name: 'Pizza Hải Sản Deluxe Size L',
    image: '/api/placeholder/150/150',
    price: 299000,
    orderDate: '2024-01-10',
    orderId: 'ORD002',
  },
  {
    id: '3',
    name: 'Bánh Mì Pate Đặc Biệt',
    image: '/api/placeholder/150/150',
    price: 35000,
    orderDate: '2024-01-08',
    orderId: 'ORD003',
  },
];

const mockMyReviews: Review[] = [
  {
    id: '1',
    productId: '4',
    productName: 'Bún Bò Huế Cay Nồng',
    productImage: '/api/placeholder/150/150',
    rating: 5,
    comment: 'Món ăn rất ngon, đúng vị truyền thống. Nước dùng đậm đà, thịt bò mềm. Sẽ đặt lại!',
    images: ['/api/placeholder/200/200', '/api/placeholder/200/200'],
    createdAt: '2024-01-20',
    orderId: 'ORD004',
    helpful: 12,
  },
  {
    id: '2',
    productId: '5',
    productName: 'Phở Bò Tái Nạm',
    productImage: '/api/placeholder/150/150',
    rating: 4,
    comment: 'Phở ngon, nước dùng trong. Tuy nhiên thịt hơi ít so với giá tiền.',
    images: [],
    createdAt: '2024-01-18',
    orderId: 'ORD005',
    helpful: 8,
  },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'myReviews'>('pending');
  const [pendingProducts, setPendingProducts] = useState<Product[]>(mockPendingProducts);
  const [myReviews, setMyReviews] = useState<Review[]>(mockMyReviews);
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

  const filteredPendingProducts = useMemo(() => {
    return pendingProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.orderId.toLowerCase().includes(search.toLowerCase()),
    );
  }, [pendingProducts, search]);

  const filteredMyReviews = useMemo(() => {
    return myReviews.filter(
      (review) =>
        review.productName.toLowerCase().includes(search.toLowerCase()) ||
        review.orderId.toLowerCase().includes(search.toLowerCase()),
    );
  }, [myReviews, search]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chờ đánh giá</p>
                <p className="text-2xl font-bold text-gray-800">{pendingProducts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã đánh giá</p>
                <p className="text-2xl font-bold text-gray-800">{myReviews.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <ThumbsUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lượt hữu ích</p>
                <p className="text-2xl font-bold text-gray-800">
                  {myReviews.reduce((sum, review) => sum + review.helpful, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm hoặc mã đơn hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
            />
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
                <span>Chờ đánh giá ({filteredPendingProducts.length})</span>
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
                products={filteredPendingProducts}
                formatPrice={formatPrice}
                formatDate={formatDate}
                onReviewSubmit={(productId, reviewData) => {
                  // Handle review submission
                  const newReview: Review = {
                    id: Date.now().toString(),
                    productId,
                    productName: products.find((p) => p.id === productId)?.name || '',
                    productImage: products.find((p) => p.id === productId)?.image || '',
                    rating: reviewData.rating,
                    comment: reviewData.comment,
                    images: reviewData.images,
                    createdAt: new Date().toISOString(),
                    orderId: products.find((p) => p.id === productId)?.orderId || '',
                    helpful: 0,
                  };
                  setMyReviews((prev) => [newReview, ...prev]);
                  setPendingProducts((prev) => prev.filter((p) => p.id !== productId));
                }}
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

// Pending Reviews Tab Component
function PendingReviewsTab({
  products,
  formatPrice,
  formatDate,
  onReviewSubmit,
}: {
  products: Product[];
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
  onReviewSubmit: (productId: string, reviewData: any) => void;
}) {
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
          key={product.id}
          className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(product.orderDate)}</span>
                </span>
                <span>Mã đơn: {product.orderId}</span>
                <span className="font-medium text-orange-600">{formatPrice(product.price)}</span>
              </div>

              {selectedProduct === product.id ? (
                <ReviewForm
                  product={product}
                  onSubmit={(reviewData) => {
                    onReviewSubmit(product.id, reviewData);
                    setSelectedProduct(null);
                  }}
                  onCancel={() => setSelectedProduct(null)}
                />
              ) : (
                <button
                  onClick={() => setSelectedProduct(product.id)}
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

// My Reviews Tab Component
function MyReviewsTab({
  reviews,
  formatDate,
}: {
  reviews: Review[];
  formatDate: (date: string) => string;
}) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Chưa có đánh giá nào</h3>
        <p className="text-gray-500">Bạn chưa đánh giá sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <img
              src={review.productImage}
              alt={review.productName}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">{review.productName}</h3>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span>{formatDate(review.createdAt)}</span>
                <span>Mã đơn: {review.orderId}</span>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              {review.images.length > 0 && (
                <div className="flex space-x-2 mb-4">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ThumbsUp className="w-4 h-4" />
                <span>{review.helpful} người thấy hữu ích</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Review Form Component
function ReviewForm({
  product,
  onSubmit,
  onCancel,
}: {
  product: Product;
  onSubmit: (reviewData: any) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Vui lòng chọn số sao');
      return;
    }
    if (comment.trim().length < 10) {
      alert('Vui lòng viết đánh giá ít nhất 10 ký tự');
      return;
    }

    onSubmit({
      rating,
      comment: comment.trim(),
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn *</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét của bạn *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-none"
          rows={4}
          minLength={10}
          required
        />
        <p className="text-xs text-gray-500 mt-1">Tối thiểu 10 ký tự</p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>Gửi đánh giá</span>
        </button>
      </div>
    </form>
  );
}
