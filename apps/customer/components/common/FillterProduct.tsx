'use client';

import { useState } from 'react';

type ProductFilterProps = {
  filter: {
    name: string;
    categories: string[];
    brands: string[];
    verified: boolean | null;
  };
  onChange: (filter: ProductFilterProps['filter']) => void;
};

const allCategories = ['Điện tử', 'Thời trang', 'Gia dụng'];
const allBrands = ['Apple', 'Samsung', 'Sony'];

export default function ProductFilter({ filter, onChange }: ProductFilterProps) {
  const [localFilter, setLocalFilter] = useState(filter);

  const handleChange = (key: keyof typeof localFilter, value: any) => {
    const updated = { ...localFilter, [key]: value };
    setLocalFilter(updated);
    onChange(updated);
  };

  const toggleMultiSelect = (key: 'categories' | 'brands', value: string) => {
    const selected = localFilter[key].includes(value)
      ? localFilter[key].filter((item) => item !== value)
      : [...localFilter[key], value];
    handleChange(key, selected);
  };

  return (
    <div className="flex flex-col gap-6 bg-white text-black p-6 rounded-xl shadow-sm">
      {/* Tên sản phẩm */}
      <div className="flex flex-col gap-2">
        <label className="font-bold">Tìm theo tên sản phẩm</label>
        <input
          type="text"
          placeholder="Nhập tên sản phẩm"
          className="border-gray-950 w-full bg-white text-black"
          value={localFilter.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      {/* Chọn danh mục */}
      <div className="flex flex-col gap-2">
        <label className="font-bold">Danh mục</label>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <div
              key={cat}
              className={`badge cursor-pointer ${
                localFilter.categories.includes(cat) ? 'badge-primary' : 'badge-outline'
              }`}
              onClick={() => toggleMultiSelect('categories', cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Chọn thương hiệu */}
      <div className="flex flex-col gap-2">
        <label className="font-bold">Thương hiệu</label>
        <div className="flex flex-wrap gap-2">
          {allBrands.map((brand) => (
            <div
              key={brand}
              className={`badge cursor-pointer ${
                localFilter.brands.includes(brand) ? 'badge-secondary' : 'badge-outline'
              }`}
              onClick={() => toggleMultiSelect('brands', brand)}
            >
              {brand}
            </div>
          ))}
        </div>
      </div>

      {/* Xác minh */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="checkbox"
          checked={localFilter.verified ?? false}
          onChange={(e) => handleChange('verified', e.target.checked)}
        />
        <span>Chỉ hiển thị sản phẩm đã xác minh</span>
      </div>

      {/* Nút đặt lại */}
      <div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() =>
            setLocalFilter({ ...filter, name: '', categories: [], brands: [], verified: null })
          }
        >
          Đặt lại bộ lọc
        </button>
      </div>
    </div>
  );
}
