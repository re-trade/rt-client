'use client';

import {
  ArrowRight,
  Clock,
  CreditCard,
  Gift,
  MapPin,
  Percent,
  Shield,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { useState } from 'react';

const CartSummary = () => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock cart data
  const cartData = {
    subtotal: 38500000,
    discount: 3500000,
    shipping: 0,
    tax: 0,
    loyaltyPoints: 385,
    estimatedDelivery: '2-3 ngày',
  };

  const total = cartData.subtotal - cartData.discount + cartData.shipping + cartData.tax;
  const savings = cartData.discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const applyPromoCode = async () => {
    if (promoCode.trim()) {
      setIsProcessing(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAppliedPromo(promoCode);
      setPromoCode('');
      setIsProcessing(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate checkout process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Order Summary */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-brand rounded-xl">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">Tóm tắt đơn hàng</h3>
            <p className="text-secondary text-sm">3 sản phẩm được chọn</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-secondary">Tạm tính (3 sản phẩm)</span>
            <span className="font-semibold text-primary text-lg">
              {formatPrice(cartData.subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-2">
              <Percent className="w-4 h-4 text-green-600" />
              <span className="text-secondary">Tiết kiệm được</span>
            </div>
            <span className="font-semibold text-green-600 text-lg">-{formatPrice(savings)}</span>
          </div>

          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-green-600" />
              <span className="text-secondary">Phí vận chuyển</span>
            </div>
            <span className="font-semibold text-green-600">Miễn phí</span>
          </div>

          <div className="border-t border-secondary pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-primary">Tổng thanh toán</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                <p className="text-sm text-green-600">Tiết kiệm {formatPrice(savings)}</p>
              </div>
            </div>
          </div>

          {/* Loyalty Points */}
          <div className="bg-brand-light rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand rounded-lg">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-primary">Tích điểm thưởng</p>
                <p className="text-sm text-secondary">
                  +{cartData.loyaltyPoints} điểm sau khi mua hàng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Gift className="w-5 h-5 text-purple-600" />
          </div>
          <h4 className="font-semibold text-primary">Mã giảm giá</h4>
        </div>

        {appliedPromo ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="p-1 bg-green-500 rounded-full">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-green-700">{appliedPromo}</span>
                <p className="text-sm text-green-600">Đã áp dụng thành công</p>
              </div>
            </div>
            <button
              onClick={removePromoCode}
              className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
            >
              Xóa
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex space-x-3">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="input-field flex-1 px-4 py-3"
              />
              <button
                onClick={applyPromoCode}
                disabled={!promoCode.trim() || isProcessing}
                className="btn-primary px-6 py-3 disabled:opacity-50"
              >
                {isProcessing ? 'Đang xử lý...' : 'Áp dụng'}
              </button>
            </div>
            <p className="text-sm text-muted">Có mã giảm giá? Nhập để được ưu đãi thêm!</p>
          </div>
        )}
      </div>

      {/* Delivery Info */}
      <div className="card p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-primary">Thông tin giao hàng</h4>
              <p className="text-sm text-secondary">Miễn phí cho đơn hàng từ 500K</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-secondary">Giao trong {cartData.estimatedDelivery}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-secondary">Toàn quốc</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="card p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-primary">Thanh toán bảo mật</h4>
            <div className="flex items-center space-x-2 mt-1">
              <CreditCard className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary">SSL 256-bit | Bảo vệ thông tin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full bg-brand hover:bg-brand-hover text-primary py-4 px-6 rounded-xl transition-all duration-200 font-bold text-lg shadow-custom-lg hover:shadow-custom-xl flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <span>Thanh toán ngay</span>
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>

        <button className="btn-secondary w-full py-4 text-lg">Tiếp tục mua sắm</button>
      </div>

      {/* Trust Indicators */}
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="mx-auto w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-secondary font-medium">Bảo vệ người mua</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-secondary font-medium">Giao hàng nhanh</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-secondary font-medium">Đánh giá 4.8★</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
