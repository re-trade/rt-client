import { Heart, ShoppingBag, Star } from 'lucide-react';
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
      <div className="bg-white rounded-xl border border-[#525252]/20 overflow-hidden transition-all duration-300 hover:border-[#FFD2B2] hover:shadow-lg hover:-translate-y-2 group">
        <div className="relative h-48 overflow-hidden bg-[#FDFEF9]">
          {image && image.length > 0 ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FFD2B2] to-[#FFBB99] flex items-center justify-center">
              <div className="text-4xl text-[#121212]">📦</div>
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-[#FFD2B2] text-[#121212] px-3 py-1 rounded-full text-sm font-bold shadow-md border border-[#525252]/20">
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

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-2">
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-[#121212]" />
              </button>
              <button className="p-2 bg-[#FFD2B2] rounded-full hover:bg-[#FFBB99] transition-colors">
                <ShoppingBag className="w-4 h-4 text-[#121212]" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-[#121212] line-clamp-2 flex-1 group-hover:text-[#525252] transition-colors text-sm leading-tight">
              {name}
            </h3>
          </div>

          {brand && (
            <div className="inline-block bg-[#FFD2B2] text-[#121212] px-2 py-1 rounded-md text-xs font-medium border border-[#525252]/20">
              {brand}
            </div>
          )}

          {shortDescription && (
            <div className="h-10 overflow-hidden">
              <p className="text-xs text-[#525252] leading-5 line-clamp-2">{shortDescription}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#525252]/10">
            {sellerShopName && (
              <div className="text-xs text-[#525252] flex items-center gap-1">
                <div className="w-4 h-4 bg-[#FFD2B2] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#121212] rounded-full"></div>
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
};

export default ProductCard;
