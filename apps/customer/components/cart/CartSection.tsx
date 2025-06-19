'use client';

import {
  AlertCircle,
  Check,
  Heart,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  seller: string;
  inStock: boolean;
  discount?: string;
  condition: string;
  isAuthentic?: boolean;
}

const CartSection = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'iPhone 12 Pro Max 256GB - Máy đẹp như mới',
      price: 15000000,
      originalPrice: 18000000,
      image: '/placeholder-phone.jpg',
      quantity: 1,
      seller: 'TechStore VN',
      inStock: true,
      discount: '17%',
      condition: 'Như mới',
      isAuthentic: true,
    },
    {
      id: '2',
      name: 'MacBook Air M1 13" - Nguyên hộp, fullbox',
      price: 20000000,
      originalPrice: 25000000,
      image: '/placeholder-laptop.jpg',
      quantity: 1,
      seller: 'Apple Store Second',
      inStock: true,
      discount: '20%',
      condition: 'Tốt',
      isAuthentic: true,
    },
    {
      id: '3',
      name: 'AirPods Pro 2nd Gen - Chính hãng Apple',
      price: 3500000,
      image: '/placeholder-airpods.jpg',
      quantity: 2,
      seller: 'Audio World',
      inStock: false,
      condition: 'Đã sử dụng',
      isAuthentic: true,
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>(['1', '2']);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    setSelectedItems((selected) => selected.filter((itemId) => itemId !== id));
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems((selected) =>
      selected.includes(id) ? selected.filter((itemId) => itemId !== id) : [...selected, id],
    );
  };

  const toggleSelectAll = () => {
    const inStockItems = cartItems.filter((item) => item.inStock).map((item) => item.id);
    if (selectedItems.length === inStockItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inStockItems);
    }
  };

  const inStockItems = cartItems.filter((item) => item.inStock);
  const allInStockSelected =
    inStockItems.length > 0 && selectedItems.length === inStockItems.length;

  if (cartItems.length === 0) {
    return (
      <div className="card p-8 sm:p-12 text-center">
        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-brand rounded-2xl flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">Giỏ hàng trống</h3>
        <p className="text-secondary mb-8 text-base sm:text-lg max-w-md mx-auto">
          Khám phá hàng ngàn sản phẩm chất lượng từ những người bán uy tín
        </p>
        <button className="btn-primary px-8 py-4 text-lg">Khám phá sản phẩm</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Select All */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={allInStockSelected}
                onChange={toggleSelectAll}
                className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 transition-all"
              />
              {allInStockSelected && (
                <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 pointer-events-none" />
              )}
            </div>
            <div>
              <span className="text-primary font-semibold text-base sm:text-lg">
                Chọn tất cả sản phẩm
              </span>
              <p className="text-secondary text-sm">{inStockItems.length} sản phẩm có sẵn</p>
            </div>
          </label>

          <div className="flex items-center space-x-2 text-sm text-muted">
            <Package className="w-4 h-4" />
            <span>{cartItems.length} món đồ trong giỏ</span>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 sm:space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className={`card p-4 sm:p-6 transition-all duration-300 ${
              !item.inStock
                ? 'border-red-200 bg-red-50'
                : selectedItems.includes(item.id)
                  ? 'border-orange-300 bg-orange-50 shadow-custom-lg'
                  : 'hover:border-orange-200 hover:shadow-custom-lg'
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Checkbox */}
              <div className="flex-shrink-0 self-start">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    disabled={!item.inStock}
                    className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 disabled:opacity-50 transition-all"
                  />
                  {selectedItems.includes(item.id) && item.inStock && (
                    <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Product Image */}
              <div className="relative w-full sm:w-32 h-32 lg:w-24 lg:h-24 xl:w-32 xl:h-32 flex-shrink-0">
                <Image
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name}
                  fill
                  className={`object-cover rounded-xl ${!item.inStock ? 'grayscale opacity-60' : ''}`}
                />
                {item.discount && item.inStock && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    -{item.discount}
                  </div>
                )}
                {item.isAuthentic && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <h3
                    className={`font-semibold text-lg sm:text-xl mb-2 line-clamp-2 ${
                      !item.inStock ? 'text-muted' : 'text-primary'
                    }`}
                  >
                    {item.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-secondary text-sm">
                      Bán bởi: <span className="font-medium text-primary">{item.seller}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.condition === 'Như mới'
                            ? 'bg-green-100 text-green-800'
                            : item.condition === 'Tốt'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.condition}
                      </span>
                      {item.isAuthentic && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Chính hãng
                        </span>
                      )}
                    </div>
                  </div>

                  {!item.inStock && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-3">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Tạm hết hàng
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  {/* Price */}
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-2xl font-bold ${
                        !item.inStock ? 'text-muted' : 'text-primary'
                      }`}
                    >
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-lg text-muted line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls - FIXED */}
                  <div className="flex items-center">
                    <div className="quantity-input flex items-center overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={!item.inStock || item.quantity <= 1}
                        className="quantity-button"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="quantity-display">{item.quantity}</div>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={!item.inStock}
                        className="quantity-button"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col items-center space-x-2 lg:space-x-0 lg:space-y-2">
                <button
                  className="p-3 text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                  title="Thêm vào yêu thích"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-3 text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                  title="Xóa khỏi giỏ hàng"
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button className="btn-secondary px-6 py-3">Lưu để mua sau</button>
            <button className="btn-secondary px-6 py-3">Chia sẻ giỏ hàng</button>
          </div>
          <div className="text-secondary text-sm">Cập nhật: 2 phút trước</div>
        </div>
      </div>
    </div>
  );
};

export default CartSection;
