'use client';
import { getAccountInfo, IUserAccount } from '@/services/auth.api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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

const ShoppingCart: React.FC = () => {
  const router = useRouter();
  const [isCustomerChecked, setIsCustomerChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<IUserAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartItems: CartItem[] = [
    {
      id: 1,
      shopId: 101,
      shopName: 'TechTrend Innovations',
      name: 'PC system All in One APPLE iMac (2023) mqrq3ro/a, Apple M3, 24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, Keyboard layout INT',
      price: 1499,
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg',
    },
    {
      id: 2,
      shopId: 101,
      shopName: 'TechTrend Innovations',
      name: 'Restored Apple Watch Series 8 (GPS) 41mm Midnight Aluminum Case with Midnight Sport Band',
      price: 598,
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg',
    },
    {
      id: 3,
      shopId: 102,
      shopName: 'GadgetZone',
      name: 'Apple - MacBook Pro 16" Laptop, M3 Pro chip, 36GB Memory, 18-core GPU, 512GB SSD, Space Black',
      price: 1799,
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-light.svg',
    },
    {
      id: 4,
      shopId: 102,
      shopName: 'GadgetZone',
      name: 'Tablet APPLE iPad Pro 12.9" 6th Gen, 128GB, Wi-Fi, Gold',
      price: 699,
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-light.svg',
    },
    {
      id: 5,
      shopId: 103,
      shopName: 'ElectroMart',
      name: 'APPLE iPhone 15 5G phone, 256GB, Gold',
      price: 999,
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-light.svg',
    },
  ];

  const recommendedItems: RecommendedItem[] = [
    {
      id: 6,
      name: 'iMac 27”',
      originalPrice: 399.99,
      discountedPrice: 299,
      description:
        'This generation has some improvements, including a longer continuous battery life.',
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg',
    },
    {
      id: 7,
      name: 'Playstation 5',
      originalPrice: 799.99,
      discountedPrice: 499,
      description:
        'This generation has some improvements, including a longer continuous battery life.',
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-light.svg',
    },
    {
      id: 8,
      name: 'Apple Watch Series 8',
      originalPrice: 1799.99,
      discountedPrice: 1199,
      description:
        'This generation has some improvements, including a longer continuous battery life.',
      image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg',
    },
  ];

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [orderSummary, setOrderSummary] = useState({
    originalPrice: 0,
    savings: 0,
    storePickup: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    const checkCustomerStatus = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      console.log('ShoppingCart - Token:', token); // Debug: Log token
      if (!token) {
        console.log('No token found, redirecting to /login');
        router.push('/login');
        setIsLoading(false);
        return;
      }
      try {
        const userData = await getAccountInfo();
        console.log('getAccountInfo Response:', userData); // Debug: Log response
        if (userData === null) {
          console.log('getAccountInfo returned null, redirecting to /login');
          router.push('/login');
        } else {
          setUser(userData);
          setIsCustomerChecked(true);
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error('getAccountInfo Error:', err); // Debug: Log error
        router.push('/login');
      }
      setIsLoading(false);
    };
    checkCustomerStatus();
  }, [router]);

  useEffect(() => {
    const selectedProducts = cartItems.filter((item) => selectedItems.includes(item.id));
    const originalPrice = selectedProducts.reduce((sum, item) => sum + item.price, 0);
    const savings = selectedProducts.length > 0 ? 299 : 0;
    const storePickup = selectedProducts.length > 0 ? 99 : 0;
    const tax = selectedProducts.length > 0 ? 799 : 0;
    const total = originalPrice - savings + storePickup + tax;

    setOrderSummary({
      originalPrice,
      savings,
      storePickup,
      tax,
      total,
    });
  }, [selectedItems]);

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
      alert('You can only select products from the same shop at once.');
    }
  };

  const handleRemove = (id: number) => {
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    alert(`Item ${id} removed from cart.`);
  };

  const handleAddToFavorites = (id: number) => {
    alert(`Item ${id} added to favorites.`);
  };

  const groupedItems = cartItems.reduce((acc: Record<number, CartItem[]>, item) => {
    if (!acc[item.shopId]) {
      acc[item.shopId] = [];
    }
    acc[item.shopId].push(item);
    return acc;
  }, {});

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div className="text-center text-gray-900">Loading...</div>;
  }

  if (!isCustomerChecked) {
    return null;
  }

  return (
    <>
      {isModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Enabled:</strong> {user.enabled ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Locked:</strong> {user.locked ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Using 2FA:</strong> {user.using2FA ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Join Date:</strong>{' '}
                {new Date(user.joinInDate).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
              <p>
                <strong>Roles:</strong> {user.roles.join(', ')}
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="mt-4 w-full rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <section className="bg-[#FDFEF9] py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Shopping Cart</h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {Object.entries(groupedItems).map(([shopId, items]) => (
                  <div key={shopId} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                      Shop: {items[0].shopName}
                    </h3>
                    {items.map((item) => (
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
                              Select item for order
                            </label>
                          </div>
                          <a href="#" className="shrink-0 md:order-2">
                            <img
                              className="h-20 w-20"
                              src={item.image}
                              alt={`${item.name} image`}
                            />
                          </a>

                          <div className="flex items-center justify-between md:order-4 md:justify-end">
                            <div className="text-end md:w-32">
                              <p className="text-base font-bold text-gray-900">
                                ${item.price.toLocaleString()}
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
                                Add to Favorites
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
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="hidden xl:mt-8 xl:block">
                  <h3 className="text-2xl font-semibold text-gray-900">People also bought</h3>
                  <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                    {recommendedItems.map((item) => (
                      <div
                        key={item.id}
                        className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                      >
                        <a href="#" className="overflow-hidden rounded">
                          <img
                            className="mx-auto h-44 w-44"
                            src={item.image}
                            alt={`${item.name} image`}
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
                            <span className="line-through">${item.originalPrice.toFixed(2)}</span>
                          </p>
                          <p className="text-lg font-bold leading-tight text-red-600">
                            ${item.discountedPrice}
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
                            Add to cart
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
                <p className="text-xl font-semibold text-gray-900">Order summary</p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500">Original price</dt>
                      <dd className="text-base font-medium text-gray-900">
                        $
                        {orderSummary.originalPrice.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500">Savings</dt>
                      <dd className="text-base font-medium text-green-600">
                        -$
                        {orderSummary.savings.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500">Store Pickup</dt>
                      <dd className="text-base font-medium text-gray-900">
                        $
                        {orderSummary.storePickup.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500">Tax</dt>
                      <dd className="text-base font-medium text-gray-900">
                        $
                        {orderSummary.tax.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </dd>
                    </dl>
                  </div>
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                    <dt className="text-base font-bold text-gray-900">Total</dt>
                    <dd className="text-base font-bold text-gray-900">
                      $
                      {orderSummary.total.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </dd>
                  </dl>
                </div>
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  Proceed to Checkout
                </a>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500"> or </span>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline"
                  >
                    Continue Shopping
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
                    <label
                      htmlFor="voucher"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Do you have a voucher or gift card?
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
                    type="button"
                    className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                  >
                    Apply Code
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShoppingCart;
