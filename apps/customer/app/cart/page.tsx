'use client'
import React, { useState, useEffect } from 'react';

const ShoppingCart: React.FC = () => {
  const cartItems = [
    {
      id: 1,
      name: 'PC system All in One APPLE iMac (2023) mqrq3ro/a, Apple M3, 24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, Keyboard layout INT',
      price: 1499,
      imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg',
      imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg',
    },
    {
      id: 2,
      name: 'Restored Apple Watch Series 8 (GPS) 41mm Midnight Aluminum Case with Midnight Sport Band',
      price: 598,
      imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg',
      imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg',
    },
    {
      id: 3,
      name: 'Apple - MacBook Pro 16" Laptop, M3 Pro chip, 36GB Memory, 18-core GPU, 512GB SSD, Space Black',
      price: 1799,
      imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-light.svg',
      imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-dark.svg',
    },
    {
      id: 4,
      name: 'Tablet APPLE iPad Pro 12.9" 6th Gen, 128GB, Wi-Fi, Gold',
      price: 699,
      imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-light.svg',
      imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-dark.svg',
    },
    {
      id: 5,
      name: 'APPLE iPhone 15 5G phone, 256GB, Gold',
      price: 999,
      imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-light.svg',
      imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-dark.svg',
    },
  ];

  const recommendedItems = [
    {
      id: 6,
      name: 'iMac 27”',
      originalPrice: 399.99,
      discountedPrice: 299,
      description: 'This generation has some improvements, including a longer continuous battery life.',
      imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg',
      imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg',
    },
    {
      id: 7,
      name: 'Playstation 5',
      originalPrice: 799.99,
      discountedPrice: 499,
      description: 'This generation has some improvements, including a longer continuous battery life.',
      imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-light.svg',
      imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-dark.svg',
    },
    {
      id: 8,
      name: 'Apple Watch Series 8',
      originalPrice: 1799.99,
      discountedPrice: 1199,
      description: 'This generation has some improvements, including a longer continuous battery life.',
      imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg',
      imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg',
    },
  ];

  // State to track selected products
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // State for order summary calculations
  const [orderSummary, setOrderSummary] = useState({
    originalPrice: 0,
    savings: 0,
    storePickup: 0,
    tax: 0,
    total: 0,
  });

  // Calculate order summary based on selected items
  useEffect(() => {
    const selectedProducts = cartItems.filter(item => selectedItems.includes(item.id));
    const originalPrice = selectedProducts.reduce((sum, item) => sum + item.price, 0);
    const savings = selectedProducts.length > 0 ? 299 : 0; // Fixed savings from original
    const storePickup = selectedProducts.length > 0 ? 99 : 0; // Fixed store pickup fee
    const tax = selectedProducts.length > 0 ? 799 : 0; // Fixed tax from original
    const total = originalPrice - savings + storePickup + tax;

    setOrderSummary({
      originalPrice,
      savings,
      storePickup,
      tax,
      total,
    });
  }, [selectedItems]);

  // Handle checkbox toggle
  const handleCheckboxChange = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Shopping Cart</h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                >
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <div className="flex items-center md:order-1">
                      <input
                        type="checkbox"
                        id={`select-item-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
                      />
                      <label htmlFor={`select-item-${item.id}`} className="sr-only">
                        Select item for order
                      </label>
                    </div>
                    <a href="#" className="shrink-0 md:order-2">
                      <img className="h-20 w-20 dark:hidden" src={item.imageLight} alt={`${item.name} image`} />
                      <img className="hidden h-20 w-20 dark:block" src={item.imageDark} alt={`${item.name} image`} />
                    </a>

                    <div className="flex items-center justify-between md:order-4 md:justify-end">
                      <div className="text-end md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-white">${item.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-3 md:max-w-md">
                      <a href="#" className="text-base font-medium text-gray-900 hover:underline dark:text-white">
                        {item.name}
                      </a>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
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
                          className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
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
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="hidden xl:mt-8 xl:block">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">People also bought</h3>
                <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                  {recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <a href="#" className="overflow-hidden rounded">
                        <img className="mx-auto h-44 w-44 dark:hidden" src={item.imageLight} alt={`${item.name} image`} />
                        <img className="mx-auto hidden h-44 w-44 dark:block" src={item.imageDark} alt={`${item.name} image`} />
                      </a>
                      <div>
                        <a href="#" className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
                          {item.name}
                        </a>
                        <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">{item.description}</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          <span className="line-through">${item.originalPrice.toFixed(2)}</span>
                        </p>
                        <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">${item.discountedPrice}</p>
                      </div>
                      <div className="mt-6 flex items-center gap-2.5">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
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
                          className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">${orderSummary.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                    <dd className="text-base font-medium text-green-600">-${orderSummary.savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Store Pickup</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">${orderSummary.storePickup.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Tax</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">${orderSummary.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
                  </dl>
                </div>
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">${orderSummary.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
                </dl>
              </div>
              <a
                href="#"
                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Proceed to Checkout
              </a>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> or </span>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
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
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <form className="space-y-4">
                <div>
                  <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Do you have a voucher or gift card?
                  </label>
                  <input
                    type="text"
                    id="voucher"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder=""
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Apply Code
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