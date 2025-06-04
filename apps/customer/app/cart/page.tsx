'use client';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  shopId: number;
  shopName: string;
  image: string;
}

interface RecommendedItem {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  image: string;
}

interface ShopSection {
  isOpen: boolean;
  items: CartItem[];
}

const ShoppingCart: React.FC = () => {
  const cartItems = useMemo<CartItem[]>(
    () => [
      {
        id: 1,
        shopId: 101,
        shopName: 'TechTrend Việt Nam',
        name: 'Máy tính All in One APPLE iMac (2023) mqrq3ro/a, Apple M3, 24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, Bàn phím quốc tế',
        price: 34990000,
        image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg',
      },
      {
        id: 3,
        shopId: 102,
        shopName: 'Khu Công Nghệ',
        name: 'Apple - MacBook Pro 16" Laptop, Chip M3 Pro, Bộ nhớ 36GB, GPU 18 nhân, SSD 512GB, Đen không gian',
        price: 41990000,
        image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-light.svg',
      },
      {
        id: 4,
        shopId: 102,
        shopName: 'Khu Công Nghệ',
        name: 'Máy tính bảng APPLE iPad Pro 12.9" Thế hệ 6, 128GB, Wi-Fi, Vàng',
        price: 16490000,
        image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-light.svg',
      },
      {
        id: 5,
        shopId: 103,
        shopName: 'Điện Máy Việt',
        name: 'APPLE iPhone 15 5G, 256GB, Vàng',
        price: 23490000,
        image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-light.svg',
      },
    ],
    [],
  );

  const recommendedItems: RecommendedItem[] = [
    {
      id: 6,
      name: 'iMac 27"',
      originalPrice: 9990000,
      discountedPrice: 6990000,
      description: 'Thế hệ này có một số cải tiến, bao gồm thời lượng pin liên tục lâu hơn.',
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg',
    },
    {
      id: 7,
      name: 'Playstation 5',
      originalPrice: 18990000,
      discountedPrice: 11990000,
      description: 'Thế hệ này có một số cải tiến, bao gồm thời lượng pin liên tục lâu hơn.',
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-light.svg',
    },
    {
      id: 8,
      name: 'Apple Watch Series 8',
      originalPrice: 42990000,
      discountedPrice: 28990000,
      description: 'Thế hệ này có một số cải tiến, bao gồm thời lượng pin liên tục lâu hơn.',
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg',
    },
  ];

  const [shopSections, setShopSections] = useState<Record<number, ShopSection>>({});
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [orderSummary, setOrderSummary] = useState({
    originalPrice: 0,
    savings: 0,
    storePickup: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    const groupedItems = cartItems.reduce((acc: Record<number, CartItem[]>, item) => {
      if (!acc[item.shopId]) {
        acc[item.shopId] = [];
      }
      acc[item.shopId].push(item);
      return acc;
    }, {});

    const initialShopSections = Object.keys(groupedItems).reduce(
      (acc: Record<number, ShopSection>, shopId) => {
        acc[Number(shopId)] = {
          isOpen: true,
          items: groupedItems[Number(shopId)],
        };
        return acc;
      },
      {},
    );

    setShopSections(initialShopSections);
  }, [cartItems]);

  useEffect(() => {
    const selectedProducts = cartItems.filter((item) => selectedItems.includes(item.id));
    const originalPrice = selectedProducts.reduce((sum, item) => sum + item.price, 0);
    const savings = selectedProducts.length > 0 ? 299000 : 0;
    const storePickup = selectedProducts.length > 0 ? 99000 : 0;
    const tax = selectedProducts.length > 0 ? 799000 : 0;
    const total = originalPrice - savings + storePickup + tax;

    setOrderSummary({
      originalPrice,
      savings,
      storePickup,
      tax,
      total,
    });
  }, [selectedItems, cartItems]);

  const handleCheckboxChange = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (selectedItems.length === 0) {
      setSelectedItems([id]);
      return;
    }

    const currentShopId = cartItems.find((i) => i.id === selectedItems[0])?.shopId;
    if (item.shopId === currentShopId) {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
      );
    } else {
      alert('Bạn chỉ có thể chọn sản phẩm từ cùng một cửa hàng.');
    }
  };

  const handleRemove = (id: number) => {
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    alert(`Sản phẩm ${id} đã được xóa khỏi giỏ hàng.`);
  };

  const handleAddToFavorites = (id: number) => {
    alert(`Sản phẩm ${id} đã được thêm vào danh sách yêu thích.`);
  };

  const toggleShopSection = (shopId: number) => {
    setShopSections((prev) => ({
      ...prev,
      [shopId]: {
        ...prev[shopId],
        isOpen: !prev[shopId].isOpen,
      },
    }));
  };

  return (
    <section className="bg-[#FDFEF9] py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Giỏ Hàng</h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {Object.entries(shopSections).map(([shopId, shopSection]) => (
                <div key={shopId} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <button
                    onClick={() => toggleShopSection(Number(shopId))}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      Người Bán: {shopSection.items[0].shopName}
                    </h3>
                    <svg
                      className={`h-6 w-6 transform transition-transform ${shopSection.isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {shopSection.isOpen && (
                    <div className="space-y-4 p-4">
                      {shopSection.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6"
                        >
                          <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                            <div className="flex items-center md:order-1">
                              <input
                                type="checkbox"
                                id={`select-item-${item.id}`}
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleCheckboxChange(item.id)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <label htmlFor={`select-item-${item.id}`} className="sr-only">
                                Chọn sản phẩm để đặt hàng
                              </label>
                            </div>
                            <a href="#" className="shrink-0 md:order-2">
                              <Image
                                width={80}
                                height={80}
                                className="h-20 w-20"
                                src={item.image}
                                alt={`${item.name} hình ảnh`}
                              />
                            </a>

                            <div className="flex items-center justify-between md:order-4 md:justify-end">
                              <div className="text-end md:w-32">
                                <p className="text-base font-bold text-gray-900">
                                  {item.price.toLocaleString('vi-VN')}₫
                                </p>
                              </div>
                            </div>

                            <div className="w-full min-w-0 flex-1 space-y-4 md:order-3 md:max-w-md">
                              <a
                                href="#"
                                className="text-base font-medium text-gray-900 hover:underline"
                              >
                                {item.name}
                              </a>
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => handleAddToFavorites(item.id)}
                                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline"
                                >
                                  <svg
                                    className="me-1.5 h-5 w-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
                                    />
                                  </svg>
                                  Thêm vào Yêu thích
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(item.id)}
                                  className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                                >
                                  <svg
                                    className="me-1.5 h-5 w-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M6 18 17.94 6M18 18 6.06 6"
                                    />
                                  </svg>
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="hidden xl:mt-8 xl:block">
                <h3 className="text-2xl font-semibold text-gray-900">Người khác cũng mua</h3>
                <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                  {recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <a href="#" className="overflow-hidden rounded">
                        <Image
                          width={176}
                          height={176}
                          className="mx-auto h-44 w-44"
                          src={item.image}
                          alt={`${item.name} hình ảnh`}
                        />
                      </a>
                      <div>
                        <a
                          href="#"
                          className="text-lg font-semibold leading-tight text-gray-900 hover:underline"
                        >
                          {item.name}
                        </a>
                        <p className="mt-2 text-base font-normal text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          <span className="line-through">
                            {item.originalPrice.toLocaleString('vi-VN')}₫
                          </span>
                        </p>
                        <p className="text-lg font-bold leading-tight text-red-600">
                          {item.discountedPrice.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-2.5">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100"
                        >
                          <svg
                            className="h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                        >
                          <svg
                            className="-ms-2 me-2 h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                            />
                          </svg>
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-xl font-semibold text-gray-900">Tổng đơn hàng</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500">Giá gốc</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {orderSummary.originalPrice.toLocaleString('vi-VN')}₫
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500">Tiết kiệm</dt>
                    <dd className="text-base font-medium text-green-600">
                      -{orderSummary.savings.toLocaleString('vi-VN')}₫
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500">Phí nhận tại cửa hàng</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {orderSummary.storePickup.toLocaleString('vi-VN')}₫
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500">Thuế</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {orderSummary.tax.toLocaleString('vi-VN')}₫
                    </dd>
                  </dl>
                </div>
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                  <dt className="text-base font-bold text-gray-900">Tổng cộng</dt>
                  <dd className="text-base font-bold text-gray-900">
                    {orderSummary.total.toLocaleString('vi-VN')}₫
                  </dd>
                </dl>
              </div>
              <a
                href="#"
                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
              >
                Tiến hành thanh toán
              </a>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-500"> hoặc </span>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline text-gray-700"
                >
                  Tiếp tục mua sắm
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 12H5m14 0-4 4m4-4-4-4"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <form className="space-y-4">
                <div>
                  <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-900">
                    Bạn có mã giảm giá hoặc thẻ quà tặng?
                  </label>
                  <input
                    type="text"
                    id="voucher"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    placeholder=""
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  Áp dụng mã
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
