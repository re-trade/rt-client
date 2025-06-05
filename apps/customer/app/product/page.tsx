'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';

const productsData = [
  {
    id: 1,
    name: 'Áo thun nam',
    category: 'Thời trang',
    price: 150000,
    image: 'https://via.placeholder.com/150?text=Aothun',
    location: 'Hà Nội',
    logistics: 'Hỏa Tốc',
    brand: 'NoBrand',
    shopType: 'Shopee Mall',
    condition: 'Mới',
    rating: 5,
    promotions: ['Đang giảm giá'],
  },
  {
    id: 2,
    name: 'Tai nghe Bluetooth',
    category: 'Điện tử',
    price: 500000,
    image: 'https://via.placeholder.com/150?text=Tai+nghe',
    location: 'TP. Hồ Chí Minh',
    logistics: 'Nhanh',
    brand: 'Goodtool',
    shopType: 'Shop Yêu thích',
    condition: 'Mới',
    rating: 4,
    promotions: ['Hàng có sẵn'],
  },
  {
    id: 3,
    name: 'Giày thể thao',
    category: 'Thời trang',
    price: 750000,
    image: 'https://via.placeholder.com/150?text=Giay',
    location: 'Bình Dương',
    logistics: 'Tiết Kiệm',
    brand: 'NoBrand',
    shopType: 'Normal',
    condition: 'Đã sử dụng',
    rating: 3,
    promotions: [],
  },
  {
    id: 4,
    name: 'Sách kỹ năng',
    category: 'Sách',
    price: 120000,
    image: 'https://via.placeholder.com/150?text=Sach',
    location: 'Thái Nguyên',
    logistics: 'Nhanh',
    brand: 'NoBrand',
    shopType: 'Shopee Mall',
    condition: 'Mới',
    rating: 5,
    promotions: ['Gì Cũng Rẻ'],
  },
  {
    id: 5,
    name: 'Laptop gaming',
    category: 'Điện tử',
    price: 15000000,
    image: 'https://via.placeholder.com/150?text=Laptop',
    location: 'Hà Nội',
    logistics: 'Hỏa Tốc',
    brand: 'Goodtool',
    shopType: 'Shop Yêu thích',
    condition: 'Mới',
    rating: 4,
    promotions: ['Mua giá bán buôn/ bán sỉ'],
  },
];

const categories = ['Thời trang', 'Điện tử', 'Sách'];
const locations = ['Bình Dương', 'Hà Nội', 'TP. Hồ Chí Minh', 'Thái Nguyên'];
const logisticsOptions = ['Hỏa Tốc', 'Nhanh', 'Tiết Kiệm'];
const brands = ['NoBrand', 'Goodtool'];
const shopTypes = ['Shopee Mall', 'Shop Yêu thích', 'Normal'];
const conditions = ['Mới', 'Đã sử dụng'];
const ratings = [5, 4, 3, 2];
const promotions = ['Đang giảm giá', 'Hàng có sẵn', 'Mua giá bán buôn/ bán sỉ', 'Gì Cũng Rẻ'];

export default function ProductListPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedLogistics, setSelectedLogistics] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedShopTypes, setSelectedShopTypes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);

  const toggleFilter = (
    filter: string,
    setFilter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setFilter((prev) =>
      prev.includes(filter) ? prev.filter((c) => c !== filter) : [...prev, filter],
    );
  };

  const resetAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedLogistics([]);
    setSelectedBrands([]);
    setSelectedShopTypes([]);
    setSelectedConditions([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedRating(null);
    setSelectedPromotions([]);
  };

  const filteredProducts = productsData.filter((product) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    if (selectedLocations.length > 0 && !selectedLocations.includes(product.location)) {
      return false;
    }
    if (selectedLogistics.length > 0 && !selectedLogistics.includes(product.logistics)) {
      return false;
    }
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    if (selectedShopTypes.length > 0 && !selectedShopTypes.includes(product.shopType)) {
      return false;
    }
    if (selectedConditions.length > 0 && !selectedConditions.includes(product.condition)) {
      return false;
    }
    if (minPrice !== '' && product.price < Number(minPrice)) {
      return false;
    }
    if (maxPrice !== '' && product.price > Number(maxPrice)) {
      return false;
    }
    if (selectedRating !== null && product.rating < selectedRating) {
      return false;
    }
    if (
      selectedPromotions.length > 0 &&
      !selectedPromotions.every((promo) => product.promotions.includes(promo))
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="sticky top-4 space-y-6 bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gra">Filters</h2>
              {Object.values([
                selectedCategories,
                selectedLocations,
                selectedLogistics,
                selectedBrands,
                selectedShopTypes,
                selectedConditions,
                selectedPromotions,
              ]).some((arr) => arr.length > 0) && (
                <button
                  onClick={resetAllFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Clear all
                </button>
              )}
            </div>

            {[
              {
                title: 'Categories',
                items: categories,
                state: selectedCategories,
                setState: setSelectedCategories,
              },
              {
                title: 'Location',
                items: locations,
                state: selectedLocations,
                setState: setSelectedLocations,
              },
              {
                title: 'Shipping',
                items: logisticsOptions,
                state: selectedLogistics,
                setState: setSelectedLogistics,
              },
              { title: 'Brand', items: brands, state: selectedBrands, setState: setSelectedBrands },
              {
                title: 'Shop Type',
                items: shopTypes,
                state: selectedShopTypes,
                setState: setSelectedShopTypes,
              },
              {
                title: 'Condition',
                items: conditions,
                state: selectedConditions,
                setState: setSelectedConditions,
              },
            ].map((filter) => (
              <div key={filter.title} className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">{filter.title}</h3>
                <div className="space-y-2">
                  {filter.items.map((item) => (
                    <label key={item} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filter.state.includes(item)}
                        onChange={() => toggleFilter(item, filter.setState)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="md:col-span-3">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Products ({filteredProducts.length})
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-200 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-lg font-semibold text-indigo-600">
                    {product.price.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </p>
                  <div className="mt-2 flex items-center">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
