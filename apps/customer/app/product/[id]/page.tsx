'use client';

import RelatedProducts from '@/components/related-product/page';
import { productApi, TProduct } from '@/services/product.api';
import Chart from '@components/chart/chart';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
interface Product {
  name: string;
  price: number;
  discountPrice: number;
  description: string;
  images: string[];
  shopName: string;
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const [productDetail, setProductDetail] = useState<TProduct | null>(null);

  const { id } = use(params);
  let discountNumber: number = 0;

  const [listImg, setListImg] = useState<string[]>([]);
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const product = await productApi.getProduct(id);
        setProductDetail(product);
        setListImg([
          ...(product.thumbnail ? [product.thumbnail] : []),
          ...(product.productImages || []),
        ]);
        let discountNumber = 0;
        if (typeof product.discount === 'string') {
          const numberPart = product.discount.replace('%', '');
          discountNumber = Number(numberPart);
        } else if (typeof product.discount === 'number') {
          discountNumber = product.discount;
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProductDetail();
  }, []);
  useEffect(() => {
    console.log('Updated listImg:', listImg);
  }, [listImg]);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Reddit_Sans'] bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
        <div className="space-y-4">
          {/* Ảnh chính */}
          <div className="relative w-full h-[480px] rounded-xl overflow-hidden border border-amber-100">
            <Image
              src={listImg[selectedImage] || '/image_login.jpg'}
              alt={productDetail?.name || 'Product image'}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Danh sách thumbnail */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
            {listImg.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative min-w-[80px] h-20 rounded-lg overflow-hidden border-2 transition-all duration-200
          ${selectedImage === index ? 'border-amber-500 shadow-sm' : 'border-amber-200'}`}
              >
                <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">
              {productDetail?.name}
            </h1>
            <p className="text-amber-700">Cửa hàng: {productDetail?.sellerShopName}</p>
          </div>

          <div className="bg-[#FFD2B2]/20 p-6 rounded-xl space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-amber-900">
                {productDetail?.discount.toLocaleString()}đ
              </span>
              {productDetail?.currentPrice && (
                <>
                  <span className="text-lg text-amber-900/60 line-through">
                    {productDetail.currentPrice.toLocaleString()}đ
                  </span>
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
                    -
                    {Math.round(
                      ((productDetail.currentPrice - discountNumber) / productDetail.currentPrice) *
                        100,
                    )}
                    %
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 bg-[#FFD2B2] text-amber-900 px-6 py-3 rounded-full
                hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
              >
                <MdAddShoppingCart className="text-2xl" />
                Thêm vào giỏ hàng
              </button>
              <button
                className="flex-1 bg-amber-500 text-white px-6 py-3 rounded-full
                hover:bg-amber-600 transition-colors"
              >
                Mua ngay
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-amber-900">Mô tả sản phẩm</h2>
            <p className="text-amber-800/80 leading-relaxed whitespace-pre-line">
              {productDetail?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
        <h2 className="text-xl font-semibold text-amber-900 mb-6">Lịch sử giá</h2>
        <div className="h-[300px]">
          <Chart />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-amber-900 mb-6">Sản phẩm tương tự</h2>
        <RelatedProducts />
      </div>
    </div>
  );
}
