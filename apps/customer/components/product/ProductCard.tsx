import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string | number;
  image: string;
  name: string;
  price: string | number;
}

const ProductCard = ({ id, image, name, price }: ProductCardProps) => {
  return (
    <Link href={`/products/${id}`}>
      <div
        className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300
        hover:border-amber-200 hover:shadow-[0_8px_30px_rgb(255,186,97,0.12)] hover:-translate-y-1"
      >
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-[1]" />
          {image && image.length > 0 ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-amber-900" />
          )}
          <div className="absolute top-4 right-4 z-[2]">
            <div
              className="bg-white/90 backdrop-blur-sm text-amber-800 px-4 py-2 rounded-full
              font-medium shadow-lg transform transition-transform duration-300 group-hover:scale-105"
            >
              {typeof price === 'number' ? `${price.toLocaleString()}đ` : price}
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3
            className="text-lg font-semibold text-gray-800 line-clamp-2 mb-3 min-h-[3.5rem]
            group-hover:text-amber-700 transition-colors duration-300"
          >
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">
              Mã SP: #{typeof id === 'number' ? id.toString().padStart(6, '0') : id}
            </span>
            <span className="inline-flex items-center text-amber-600 font-medium group/btn">
              Xem chi tiết
              <svg
                className="w-5 h-5 ml-1 transform transition-transform duration-300 group-hover/btn:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5-5 5M5 7l5 5-5 5"
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
