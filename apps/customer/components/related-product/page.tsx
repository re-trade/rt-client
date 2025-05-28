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
  const currentProductId = '1';
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
      name: 'Shop Product 2',
      price: 279.99,
      discountPrice: 219.99,
      description: 'Another product from same shop.',
      images: ['/images/product2.jpg'],
      stock: 20,
      category: 'Accessories',
      shopName: 'Cool Shop',
    },
    {
      id: '4',
      name: 'Shop Product 3',
      price: 299.99,
      discountPrice: 249.99,
      description: 'Third product from same shop.',
      images: ['/images/product3.jpg'],
      stock: 25,
      category: 'Electronics',
      shopName: 'Cool Shop',
    },
    {
      id: '5',
      name: 'Shop Product 4',
      price: 219.99,
      discountPrice: 199.99,
      description: 'Fourth product from same shop.',
      images: ['/images/product4.jpg'],
      stock: 15,
      category: 'Electronics',
      shopName: 'Cool Shop',
    },
    {
      id: '6',
      name: 'Shop Product 5',
      price: 239.99,
      discountPrice: 199.99,
      description: 'Fifth product from same shop.',
      images: ['/images/product5.jpg'],
      stock: 30,
      category: 'Electronics',
      shopName: 'Cool Shop',
    },
    {
      id: '7',
      name: 'Shop Product 6',
      price: 229.99,
      discountPrice: 189.99,
      description: 'Sixth product from same shop.',
      images: ['/images/product6.jpg'],
      stock: 40,
      category: 'Electronics',
      shopName: 'Cool Shop',
    },
    {
      id: '8',
      name: 'Shop Product 7',
      price: 199.99,
      discountPrice: 179.99,
      description: 'Seventh product from same shop.',
      images: ['/images/product7.jpg'],
      stock: 10,
      category: 'Electronics',
      shopName: 'Cool Shop',
    },
    {
      id: '9',
      name: 'Shop Product 8',
      price: 189.99,
      discountPrice: 169.99,
      description: 'Eighth product from same shop.',
      images: ['/images/product8.jpg'],
      stock: 22,
      category: 'Electronics',
      shopName: 'Cool Shop',
    },
    {
      id: '10',
      name: 'Shop Product 9',
      price: 259.99,
      discountPrice: 239.99,
      description: 'Ninth product from same shop.',
      images: ['/images/product9.jpg'],
      stock: 18,
      category: 'Electronics',
      shopName: 'Cool Shop',
    },
    {
      id: '11',
      name: 'Shop Product 10',
      price: 279.99,
      discountPrice: 249.99,
      description: 'Tenth product from same shop.',
      images: ['/images/product10.jpg'],
      stock: 35,
      category: 'Electronics',
      shopName: 'Cool Shop',
    },

    // Các sản phẩm tương tự khác shop (cùng category Electronics)
    {
      id: '12',
      name: 'Similar Product A',
      price: 349.99,
      discountPrice: 299.99,
      description: 'Similar style product A.',
      images: ['/images/product11.jpg'],
      stock: 15,
      category: 'Electronics',
      shopName: 'Another Shop',
    },
    {
      id: '13',
      name: 'Similar Product B',
      price: 319.99,
      discountPrice: 289.99,
      description: 'Similar product B.',
      images: ['/images/product12.jpg'],
      stock: 10,
      category: 'Electronics',
      shopName: 'Other Shop',
    },
    {
      id: '14',
      name: 'Similar Product C',
      price: 399.99,
      discountPrice: 349.99,
      description: 'Similar product C.',
      images: ['/images/product13.jpg'],
      stock: 8,
      category: 'Electronics',
      shopName: 'Random Shop',
    },
    {
      id: '15',
      name: 'Similar Product D',
      price: 359.99,
      discountPrice: 329.99,
      description: 'Similar product D.',
      images: ['/images/product14.jpg'],
      stock: 12,
      category: 'Electronics',
      shopName: 'ShopX',
    },
    {
      id: '16',
      name: 'Similar Product E',
      price: 339.99,
      discountPrice: 299.99,
      description: 'Similar product E.',
      images: ['/images/product15.jpg'],
      stock: 20,
      category: 'Electronics',
      shopName: 'ShopY',
    },
    {
      id: '17',
      name: 'Similar Product F',
      price: 369.99,
      discountPrice: 329.99,
      description: 'Similar product F.',
      images: ['/images/product16.jpg'],
      stock: 15,
      category: 'Electronics',
      shopName: 'ShopZ',
    },
    {
      id: '18',
      name: 'Similar Product G',
      price: 379.99,
      discountPrice: 339.99,
      description: 'Similar product G.',
      images: ['/images/product17.jpg'],
      stock: 17,
      category: 'Electronics',
      shopName: 'ShopW',
    },
    {
      id: '19',
      name: 'Similar Product H',
      price: 389.99,
      discountPrice: 349.99,
      description: 'Similar product H.',
      images: ['/images/product18.jpg'],
      stock: 22,
      category: 'Electronics',
      shopName: 'ShopV',
    },
    {
      id: '20',
      name: 'Similar Product I',
      price: 399.99,
      discountPrice: 359.99,
      description: 'Similar product I.',
      images: ['/images/product19.jpg'],
      stock: 25,
      category: 'Electronics',
      shopName: 'ShopU',
    },
    {
      id: '21',
      name: 'Similar Product J',
      price: 410.99,
      discountPrice: 369.99,
      description: 'Similar product J.',
      images: ['/images/product20.jpg'],
      stock: 28,
      category: 'Electronics',
      shopName: 'ShopT',
    },
  ];

  const otherFromShop = allProducts.filter(
    (p) => p.shopName === currentProductShop && p.id !== currentProductId,
  );

  const similarProducts = allProducts.filter(
    (p) =>
      p.category === currentProductCategory &&
      p.id !== currentProductId &&
      p.shopName !== currentProductShop,
  );

  const MAX_PRODUCTS_TO_SHOW = 10;
  const otherFromShopLimited = otherFromShop.slice(0, MAX_PRODUCTS_TO_SHOW);
  const similarProductsLimited = similarProducts.slice(0, MAX_PRODUCTS_TO_SHOW);

  function ProductCard({ product }: { product: Product }) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition">
        <div className="relative w-full h-40 bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.svg'}
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
      {otherFromShopLimited.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">More from {currentProductShop}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {otherFromShopLimited.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

      {similarProductsLimited.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarProductsLimited.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
