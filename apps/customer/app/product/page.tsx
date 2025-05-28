"use client";

import React, { useState } from "react";

const productsData = [
  {
    id: 1,
    name: "Áo thun nam",
    category: "Thời trang",
    price: 150000,
    image: "https://via.placeholder.com/150?text=Aothun",
    location: "Hà Nội",
    logistics: "Hỏa Tốc",
    brand: "NoBrand",
    shopType: "Shopee Mall",
    condition: "Mới",
    rating: 5,
    promotions: ["Đang giảm giá"],
  },
  {
    id: 2,
    name: "Tai nghe Bluetooth",
    category: "Điện tử",
    price: 500000,
    image: "https://via.placeholder.com/150?text=Tai+nghe",
    location: "TP. Hồ Chí Minh",
    logistics: "Nhanh",
    brand: "Goodtool",
    shopType: "Shop Yêu thích",
    condition: "Mới",
    rating: 4,
    promotions: ["Hàng có sẵn"],
  },
  {
    id: 3,
    name: "Giày thể thao",
    category: "Thời trang",
    price: 750000,
    image: "https://via.placeholder.com/150?text=Giay",
    location: "Bình Dương",
    logistics: "Tiết Kiệm",
    brand: "NoBrand",
    shopType: "Normal",
    condition: "Đã sử dụng",
    rating: 3,
    promotions: [],
  },
  {
    id: 4,
    name: "Sách kỹ năng",
    category: "Sách",
    price: 120000,
    image: "https://via.placeholder.com/150?text=Sach",
    location: "Thái Nguyên",
    logistics: "Nhanh",
    brand: "NoBrand",
    shopType: "Shopee Mall",
    condition: "Mới",
    rating: 5,
    promotions: ["Gì Cũng Rẻ"],
  },
  {
    id: 5,
    name: "Laptop gaming",
    category: "Điện tử",
    price: 15000000,
    image: "https://via.placeholder.com/150?text=Laptop",
    location: "Hà Nội",
    logistics: "Hỏa Tốc",
    brand: "Goodtool",
    shopType: "Shop Yêu thích",
    condition: "Mới",
    rating: 4,
    promotions: ["Mua giá bán buôn/ bán sỉ"],
  },
];

const categories = ["Thời trang", "Điện tử", "Sách"];
const locations = ["Bình Dương", "Hà Nội", "TP. Hồ Chí Minh", "Thái Nguyên"];
const logisticsOptions = ["Hỏa Tốc", "Nhanh", "Tiết Kiệm"];
const brands = ["NoBrand", "Goodtool"];
const shopTypes = ["Shopee Mall", "Shop Yêu thích", "Normal"];
const conditions = ["Mới", "Đã sử dụng"];
const ratings = [5, 4, 3, 2];
const promotions = ["Đang giảm giá", "Hàng có sẵn", "Mua giá bán buôn/ bán sỉ", "Gì Cũng Rẻ"];

export default function ProductListPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedLogistics, setSelectedLogistics] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedShopTypes, setSelectedShopTypes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
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
    setMinPrice("");
    setMaxPrice("");
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
    if (minPrice !== "" && product.price < Number(minPrice)) {
      return false;
    }
    if (maxPrice !== "" && product.price > Number(maxPrice)) {
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
    <div className="max-w-[80%] mx-auto px-10 py-10 grid grid-cols-12 gap-6">
      <aside className="col-span-12 md:col-span-3 border border-gray-300 rounded-md p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg
            enableBackground="new 0 0 15 15"
            viewBox="0 0 15 15"
            x="0"
            y="0"
            className="w-5 h-5"
          >
            <g>
              <polyline
                fill="none"
                points="5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                stroke="currentColor"
              ></polyline>
            </g>
          </svg>
          <h2 className="font-semibold text-xl">Bộ lọc tìm kiếm</h2>
        </div>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Theo Danh Mục</legend>
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleFilter(category, setSelectedCategories)}
                className="form-checkbox h-4 w-4 text-[#ee4d2d]"
              />
              <span>{category}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Nơi Bán</legend>
          {locations.map((location) => (
            <label key={location} className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() => toggleFilter(location, setSelectedLocations)}
                className="form-checkbox h-4 w-4 text-[#ee4d2d]"
              />
              <span>{location}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Đơn Vị Vận Chuyển</legend>
          {logisticsOptions.map((logistic) => (
            <label key={logistic} className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLogistics.includes(logistic)}
                onChange={() => toggleFilter(logistic, setSelectedLogistics)}
                className="form-checkbox h-4 w-4 text-[#ee4d2d]"
              />
              <span>{logistic}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Thương Hiệu</legend>
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleFilter(brand, setSelectedBrands)}
                className="form-checkbox h-4 w-4 text-[#ee4d2d]"
              />
              <span>{brand}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Khoảng Giá</legend>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="₫ TỪ"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
              maxLength={13}
            />
            <div className="border-t border-gray-300 w-4 my-3"></div>
            <input
              type="text"
            placeholder="₫ ĐẾN"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
              maxLength={13}
            />
          </div>
          <button
            className="w-full bg-[#ee4d2d] text-white p-2 rounded-md hover:bg-[#d9431f]"
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
            }}
          >
            Áp dụng
          </button>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Loại Shop</legend>
          {shopTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedShopTypes.includes(type)}
                onChange={() => toggleFilter(type, setSelectedShopTypes)}
                className="form-checkbox h-4 w-4 text-[#ee4d2d]"
              />
              <span>{type}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Tình Trạng</legend>
          {conditions.map((condition) => (
            <label key={condition} className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedConditions.includes(condition)}
                onChange={() => toggleFilter(condition, setSelectedConditions)}
                className="form-checkbox h-4 w-4 text-[#ee4d2d]"
              />
              <span>{condition}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Đánh Giá</legend>
          {ratings.map((rating) => (
            <label key={rating} className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
                className="form-radio h-4 w-4 text-[#ee4d2d]"
              />
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 9.5 8"
                      className={`w-3 h-3 ${i < rating ? "fill-[#ffca11]" : "fill-gray-300"}`}
                    >
                      <defs>
                        <linearGradient id="ratingStarGradient" x1="50%" x2="50%" y1="0%" y2="100%">
                          <stop offset="0" stopColor="#ffca11" />
                          <stop offset="1" stopColor="#ffad27" />
                        </linearGradient>
                      </defs>
                      <g fill={i < rating ? "url(#ratingStarGradient)" : "none"} stroke="#ffa727" strokeWidth="0.5">
                        <polygon
                          points="14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903"
                        />
                      </g>
                    </svg>
                  ))}
              </div>
              <span> trở lên</span>
            </label>
          ))}
          {selectedRating !== null && (
            <button
              onClick={() => setSelectedRating(null)}
              className="text-sm text-[#ee4d2d] mt-2 hover:underline"
            >
              Xóa bộ lọc đánh giá
            </button>
          )}
        </fieldset>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Dịch Vụ & Khuyến Mãi</legend>
          {promotions.map((promotion) => (
            <label key={promotion} className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPromotions.includes(promotion)}
                onChange={() => toggleFilter(promotion, setSelectedPromotions)}
                className="form-checkbox h-4 w-4 text-[#ee4d2d]"
              />
              <span>{promotion}</span>
            </label>
          ))}
        </fieldset>

        {(selectedCategories.length > 0 ||
          selectedLocations.length > 0 ||
          selectedLogistics.length > 0 ||
          selectedBrands.length > 0 ||
          selectedShopTypes.length > 0 ||
          selectedConditions.length > 0 ||
          minPrice !== "" ||
          maxPrice !== "" ||
          selectedRating !== null ||
          selectedPromotions.length > 0) && (
          <button
            className="w-full bg-[#ee4d2d] text-white p-2 rounded-md hover:bg-[#d9431f]"
            onClick={resetAllFilters}
          >
            Xóa tất cả
          </button>
        )}
      </aside>

      <section className="col-span-12 md:col-span-9">
        <h2 className="font-semibold text-xl mb-6">{filteredProducts.length} sản phẩm</h2>
        {filteredProducts.length === 0 && (
          <p className="text-gray-500">Không có sản phẩm phù hợp.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-300 rounded-md p-4 flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover mb-4 rounded"
              />
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-[#ee4d2d] font-semibold mt-auto">
                {product.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
