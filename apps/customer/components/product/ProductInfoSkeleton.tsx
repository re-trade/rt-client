const ProductInfoSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-3">
      <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg w-4/5" />
      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-2/3" />
      <div className="h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl" />
    </div>

    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
      <div className="space-y-4">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-1/2" />
        <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl" />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl border border-orange-100"
        />
      ))}
    </div>
  </div>
);

export default ProductInfoSkeleton;
