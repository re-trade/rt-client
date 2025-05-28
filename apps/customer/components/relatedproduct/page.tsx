'use client';

import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  description: string;
  images: string[];
  stock: number;
  category: string;
  shopName: string;
}

export default function RelatedProducts() {
  const currentProductId = '1'; // Simulate current product
  const currentProductShop = 'Cool Shop';
  const currentProductCategory = 'Electronics';

  const allProducts: Product[] = [
    {
      id: '1',
      name: 'Main Product',
      price: 299.99,
      discountPrice: 249.99,
      description: 'Main item',
      images: ['/images/product1.jpg'],
      stock: 50,
      category: 'Electronics',
      shopName: 'Cool Shop',
    },
    {
      id: '2',
      name: 'Shop Product 1',
      price: 199.99,
      discountPrice: 159.99,
      description: 'Great item from same shop.',
      images: ['/images/product2.jpg'],
      stock: 30,
      category: 'Electronics',
      shopName: 'Cool Shop',
    },
    {
      id: '3',
      name: 'Similar Product A',
      price: 349.99,
      discountPrice: 299.99,
      description: 'Similar style product.',
      images: ['/images/product3.jpg'],
      stock: 15,
      category: 'Electronics',
      shopName: 'Another Shop',
    },
    {
      id: '4',
      name: 'Similar Product B',
      price: 319.99,
      discountPrice: 289.99,
      description: 'Another similar product.',
      images: ['/images/product4.jpg'],
      stock: 10,
      category: 'Electronics',
      shopName: 'Other Shop',
    },
    {
      id: '5',
      name: 'Shop Product 2',
      price: 279.99,
      discountPrice: 219.99,
      description: 'Second product from same shop.',
      images: ['/images/product2.jpg'],
      stock: 20,
      category: 'Accessories',
      shopName: 'Cool Shop',
    },
    {
      id: '6',
      name: 'Similar Product C',
      price: 399.99,
      discountPrice: 349.99,
      description: 'Yet another similar product.',
      images: ['/images/product5.jpg'],
      stock: 8,
      category: 'Electronics',
      shopName: 'Random Shop',
    },
    {
      id: '7',
      name: 'Shop Product 2',
      price: 279.99,
      discountPrice: 219.99,
      description: 'Second product from same shop.',
      images: ['/images/product2.jpg'],
      stock: 20,
      category: 'Accessories',
      shopName: 'Cool Shop',
    },
    {
      id: '8',
      name: 'Shop Product 2',
      price: 279.99,
      discountPrice: 219.99,
      description: 'Second product from same shop.',
      images: ['/images/product2.jpg'],
      stock: 20,
      category: 'Accessories',
      shopName: 'Cool Shop',
    },
    {
      id: '9',
      name: 'Shop Product 2',
      price: 279.99,
      discountPrice: 219.99,
      description: 'Second product from same shop.',
      images: ['/images/product2.jpg'],
      stock: 20,
      category: 'Accessories',
      shopName: 'Cool Shop',
    },
    {
      id: '10',
      name: 'Shop Product 2',
      price: 279.99,
      discountPrice: 219.99,
      description: 'Second product from same shop.',
      images: ['/images/product2.jpg'],
      stock: 20,
      category: 'Accessories',
      shopName: 'Cool Shop',
    },
    {
      id: '11',
      name: 'Shop Product 2',
      price: 279.99,
      discountPrice: 219.99,
      description: 'Second product from same shop.',
      images: ['/images/product2.jpg'],
      stock: 20,
      category: 'Accessories',
      shopName: 'Cool Shop',
    },
  ];

  const otherFromShop = allProducts.filter(
    (p) => p.shopName === currentProductShop && p.id !== currentProductId
  );

  const similarProducts = allProducts.filter(
    (p) =>
      p.category === currentProductCategory &&
      p.id !== currentProductId &&
      p.shopName !== currentProductShop
  );

  function ProductCard({ product }: { product: Product }) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition">
        <div className="relative w-full h-40 bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-2">
          <h3 className="text-sm font-semibold truncate">{product.name}</h3>
          <div className="flex items-center gap-1">
            <span className="text-red-500 font-bold">${product.discountPrice.toFixed(2)}</span>
            <span className="line-through text-xs text-gray-400">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-12">
      {otherFromShop.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">More from {currentProductShop}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {otherFromShop.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

      {similarProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {similarProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
