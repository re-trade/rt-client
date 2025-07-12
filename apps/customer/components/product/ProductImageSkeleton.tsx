const ProductImageSkeleton = () => (
  <div className="space-y-4">
    <div className="relative w-full h-[500px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-2xl border border-orange-100 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-20 rounded-2xl" />
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="min-w-[100px] h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl border-2 border-orange-200"
        />
      ))}
    </div>
  </div>
);
export default ProductImageSkeleton;
