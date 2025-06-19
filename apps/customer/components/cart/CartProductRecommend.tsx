'use client';

import { Eye, Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  discount?: string;
  condition: string;
  isHot?: boolean;
  viewCount: number;
}

const CartProductRecommend = () => {
  const [recommendedProducts] = useState<RecommendedProduct[]>([
    {
      id: '1',
      name: 'Apple Watch Series 8 GPS 45mm - Nguyên hộp chưa kích hoạt',
      price: 8500000,
      originalPrice: 12000000,
      image: '/placeholder-watch.jpg',
      rating: 4.8,
      reviews: 156,
      seller: 'Watch Paradise',
      discount: '29%',
      condition: 'Như mới',
      isHot: true,
      viewCount: 1240,
    },
    {
      id: '2',
      name: 'iPad Air 5 WiFi 64GB - Bảo hành còn 8 tháng',
      price: 14500000,
      originalPrice: 18000000,
      image: '/placeholder-ipad.jpg',
      rating: 4.9,
      reviews: 89,
      seller: 'Apple Store Second',
      discount: '19%',
      condition: 'Tốt',
      viewCount: 890,
    },
    {
      id: '3',
      name: 'Samsung Galaxy Buds Pro - Fullbox, kèm case sạc',
      price: 2800000,
      originalPrice: 4200000,
      image: '/placeholder-buds.jpg',
      rating: 4.7,
      reviews: 234,
      seller: 'Audio World',
      discount: '33%',
      condition: 'Như mới',
      isHot: true,
      viewCount: 567,
    },
    {
      id: '4',
      name: 'Magic Keyboard cho iPad Pro - Chính hãng Apple',
      price: 4500000,
      originalPrice: 6500000,
      image: '/placeholder-keyboard.jpg',
      rating: 4.6,
      reviews: 67,
      seller: 'Accessories Hub',
      discount: '31%',
      condition: 'Đã sử dụng',
      viewCount: 345,
    },
  ]);

  const [favorites, setFavorites] = useState<string[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const addToCart = (productId: string) => {
    console.log('Adding product to cart:', productId);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand rounded-xl">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">Có thể bạn sẽ thích</h3>
            <p className="text-secondary text-sm">Dựa trên sản phẩm trong giỏ hàng</p>
          </div>
        </div>
        <button className="text-primary hover:text-orange-600 font-medium text-sm transition-colors">
          Xem tất cả
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {recommendedProducts.map((product) => (
          <div
            key={product.id}
            className="card p-0 overflow-hidden group hover:shadow-custom-xl transition-all duration-300"
          >
            <div className="relative">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={product.image || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.discount && (
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      -{product.discount}
                    </div>
                  )}
                  {product.isHot && (
                    <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>HOT</span>
                    </div>
                  )}
                </div>

                {/* Actions Overlay */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                      favorites.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`}
                    />
                  </button>
                  <button className="p-2 bg-white/90 hover:bg-white text-gray-600 rounded-full shadow-lg transition-all duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* View Count */}
                <div className="absolute bottom-3 left-3">
                  <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{formatNumber(product.viewCount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Product Info */}
              <div>
                <h4 className="font-semibold text-primary line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h4>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-secondary bg-muted px-2 py-1 rounded-full">
                    {product.condition}
                  </span>
                  <span className="text-xs text-muted">{product.seller}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-primary">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted">({product.reviews} đánh giá)</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {product.originalPrice && (
                  <div className="text-xs text-green-600 font-medium">
                    Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product.id)}
                className="w-full btn-primary py-3 flex items-center justify-center space-x-2 group/button"
              >
                <ShoppingCart className="w-4 h-4 group-hover/button:scale-110 transition-transform" />
                <span>Thêm vào giỏ</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="text-center">
        <button className="btn-secondary px-8 py-3">Xem thêm sản phẩm tương tự</button>
      </div>
    </div>
  );
};

export default CartProductRecommend;
