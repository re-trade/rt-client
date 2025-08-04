import { Star } from 'lucide-react';
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
  viewMode?: 'grid' | 'list';
  hideActionButtons?: boolean;
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
  viewMode = 'grid',
  hideActionButtons = false,
}: ProductCardProps) => {
  if (viewMode === 'grid') {
    return (
      <Link href={`/product/${id}`}>
        <div className="bg-white rounded-xl border border-orange-200 overflow-hidden transition-all duration-300 hover:border-orange-400 hover:shadow-lg hover:-translate-y-2 group">
          <div className="relative h-48 overflow-hidden bg-orange-50">
            {image && image.length > 0 ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <div className="text-4xl text-white">📦</div>
              </div>
            )}

            <div className="absolute top-3 right-3 z-10">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                {price.toLocaleString()}đ
              </div>
            </div>

            {/* Verified Badge */}
            {verified && (
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  Tin cậy
                </div>
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1 group-hover:text-gray-600 transition-colors text-sm leading-tight">
                {name}
              </h3>
            </div>

            {brand && (
              <div className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-medium border border-orange-200">
                {brand}
              </div>
            )}

            {shortDescription && (
              <div className="h-10 overflow-hidden">
                <p className="text-xs text-gray-600 leading-5 line-clamp-2">{shortDescription}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-orange-100">
              {sellerShopName && (
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <span className="truncate max-w-20">{sellerShopName}</span>
                </div>
              )}
              <span className="text-[#121212] text-xs font-medium flex items-center gap-1 group/btn cursor-pointer">
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
  }

  return (
    <Link href={`/product/${id}`}>
      <div className="bg-white rounded-xl border border-orange-200 overflow-hidden transition-all duration-300 hover:border-orange-400 hover:shadow-lg group">
        <div className="flex items-center gap-4 p-4">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-orange-50 rounded-lg">
            {image && image.length > 0 ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <div className="text-2xl text-white">📦</div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-gray-600 transition-colors text-base leading-tight">
              {name}
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              {brand && (
                <div className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-medium border border-orange-200">
                  {brand}
                </div>
              )}

              {verified && (
                <div className="inline-flex bg-green-500 text-white px-2 py-1 rounded-full text-xs items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-medium">Tin cậy</span>
                </div>
              )}
            </div>

            {shortDescription && (
              <p className="text-sm text-gray-600 line-clamp-2">{shortDescription}</p>
            )}

            {sellerShopName && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{sellerShopName}</span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex items-center justify-center px-4">
            <div className="text-orange-600 text-xl font-bold">{price.toLocaleString()}đ</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
