import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: number;
  shortDescription?: string;
  brand?: string;
  verified?: boolean;
  sellerShopName?: string;
}

const ProductCard = ({
  id,
  image,
  name,
  price,
  shortDescription,
  brand,
  verified = false,
  sellerShopName,
}: ProductCardProps) => {
  return (
    <Link href={`/product/${id}`}>
      <div className="bg-white rounded-lg border border-orange-100 overflow-hidden transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1 group">
        <div className="relative h-48 overflow-hidden bg-orange-50">
          {image && image.length > 0 ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <div className="text-4xl text-orange-400">📦</div>
            </div>
          )}
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
              {price.toLocaleString()}đ
            </div>
          </div>
          {verified && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Tin cậy
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1 group-hover:text-orange-600 transition-colors text-sm">
              {name}
            </h3>
          </div>
          {brand && (
            <div className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs mb-2 font-medium">
              {brand}
            </div>
          )}
          {shortDescription && (
            <div className="mb-3 h-8 overflow-hidden">
              <p
                className="text-xs text-gray-600 leading-4 overflow-hidden text-ellipsis"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {shortDescription}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between mt-auto">
            {sellerShopName && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate max-w-20">{sellerShopName}</span>
              </div>
            )}
            <span className="text-orange-600 text-xs font-medium flex items-center gap-1 group/btn cursor-pointer">
              Xem ngay
              <svg
                className="w-3 h-3 transition-transform group-hover/btn:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
