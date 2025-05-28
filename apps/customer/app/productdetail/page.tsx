'use client';

import RelatedProducts from '@/components/relatedproduct/page';
import Chart from '@components/chart/chart';
import Image from 'next/image';
import { useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

interface Product {
  name: string;
  price: number;
  discountPrice: number;
  description: string;
  images: string[];
  shopName: string;
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const product: Product = {
    name: 'Sample Product Name',
    price: 299.99,
    discountPrice: 249.99,
    description:
      'This is a high-quality product with amazing features. Perfect for everyday use with durable materials and modern design.',
    images: [
      '/images/product1.jpg',
      '/images/product2.jpg',
      '/images/product3.jpg',
      '/images/product4.jpg',
    ],
    shopName: 'HAHAHA',
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-8 font-[Open_Sans]
">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative w-full h-72 sm:h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative min-w-[80px] h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-xl sm:text-2xl font-bold">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-2xl sm:text-3xl font-semibold text-red-500">
              ${product.discountPrice.toFixed(2)}
            </span>
            <span className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="w-full sm:w-auto bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition flex items-center justify-center gap-2">
              <MdAddShoppingCart />
              Thêm vào giỏ hàng
            </button>
            <button className="w-full sm:w-auto bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition">
              Buy Now
            </button>
          </div>
          `
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Product Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Chart />
      </div>

      <div className="mt-12">
        <RelatedProducts />
      </div>
    </div>
  );
}
