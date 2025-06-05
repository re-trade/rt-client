'use client';

import { formatPrice } from '@/lib/utils';
import type { CartItemResponse, CartResponse } from '@/services/cart.api';
import { cartApi } from '@/services/cart.api';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ShoppingCart = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.getCart();
      setCart(response);
      const initialQuantities: Record<string, number> = {};
      response.cartGroupResponses?.forEach((group) => {
        group.items.forEach((item) => {
          initialQuantities[item.productId] = item.quantity || 1;
        });
      });
      setQuantities(initialQuantities);
      setError(null);
    } catch {
      setError('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
      const updatedCart = await cartApi.updateCartItemQuantity(productId, newQuantity);
      setCart(updatedCart);
      setError(null);
    } catch {
      setError('Không thể cập nhật số lượng');
      fetchCart();
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const updatedCart = await cartApi.removeFromCart(productId);
      setCart(updatedCart);
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      setError(null);
    } catch (err) {
      setError('Không thể xóa sản phẩm');
      console.error('Error removing item:', err);
    }
  };

  const calculateOrderSummary = () => {
    if (!cart?.cartGroupResponses) return { subtotal: 0, total: 0 };

    let subtotal = 0;
    cart.cartGroupResponses.forEach((group) => {
      group.items.forEach((item) => {
        if (selectedItems.has(item.productId)) {
          subtotal += Number(item.totalPrice) * (quantities[item.productId] || 1);
        }
      });
    });

    return {
      subtotal,
      total: subtotal,
    };
  };

  const handleSelectItem = (productId: string, checked: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  };

  const handleSelectAllItems = (groupItems: CartItemResponse[], checked: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      groupItems.forEach((item) => {
        if (checked) {
          newSet.add(item.productId);
        } else {
          newSet.delete(item.productId);
        }
      });
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Giỏ hàng</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-center">{error}</p>
          <button
            onClick={fetchCart}
            className="mt-4 w-full text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!cart?.cartGroupResponses || cart.cartGroupResponses.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">Chưa có sản phẩm nào trong giỏ hàng</p>
        </div>
      </div>
    );
  }

  const orderSummary = calculateOrderSummary();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8">Giỏ hàng</h1>

      <div className="space-y-6">
        {cart.cartGroupResponses.map((group) => (
          <div key={group.sellerId} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {group.sellerAvatarUrl && (
                  <Image
                    src={group.sellerAvatarUrl}
                    alt={group.sellerName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="ml-2 font-semibold">{group.sellerName}</span>
              </div>
              {group.items.length > 0 && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={group.items.every((item) => selectedItems.has(item.productId))}
                    onChange={(e) => handleSelectAllItems(group.items, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                  />
                  <span className="ml-2">Chọn tất cả</span>
                </div>
              )}
            </div>

            {group.items.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Không có sản phẩm nào từ người bán này</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {group.items.map((item) => (
                  <div key={item.productId} className="py-6 flex">
                    <div className="flex items-center h-full mr-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.productId)}
                        onChange={(e) => handleSelectItem(item.productId, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <Image
                        src={item.productThumbnail}
                        alt={item.productName}
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="text-sm">
                            <Link
                              href={`/products/${item.productId}`}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {item.productName}
                            </Link>
                          </h4>
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            {formatPrice(
                              Number(item.totalPrice) * (quantities[item.productId] || 1),
                            )}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.productBrand}</p>
                        <p
                          className={`mt-1 text-sm ${item.productAvailable ? 'text-green-600' : 'text-red-500'}`}
                        >
                          {item.productAvailable ? 'Còn hàng' : 'Hết hàng'}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                (quantities[item.productId] || 1) - 1,
                              )
                            }
                            disabled={!item.productAvailable}
                            className="rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="text-gray-900">{quantities[item.productId] || 1}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                (quantities[item.productId] || 1) + 1,
                              )
                            }
                            disabled={!item.productAvailable}
                            className="rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tổng đơn hàng</h2>
          <div className="flow-root">
            <dl className="-my-4 divide-y divide-gray-200 text-sm">
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Tạm tính</dt>
                <dd className="font-medium text-gray-900">{formatPrice(orderSummary.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Phí vận chuyển</dt>
                <dd className="font-medium text-gray-900">Miễn phí</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-base font-medium text-gray-900">Tổng tiền</dt>
                <dd className="text-base font-medium text-gray-900">
                  {formatPrice(orderSummary.total)}
                </dd>
              </div>
            </dl>
          </div>
          <div className="mt-6">
            <button
              type="button"
              disabled={selectedItems.size === 0}
              className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedItems.size > 0
                ? `Thanh toán (${selectedItems.size} sản phẩm)`
                : 'Vui lòng chọn sản phẩm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
