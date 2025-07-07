const ContentSkeleton = () => (
  <div className="space-y-12">
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100">
      <div className="border-b border-orange-100">
        <div className="flex">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-t-xl flex-1 mr-2"
            />
          ))}
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-1/3" />
          <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100">
      <div className="p-6 border-b border-orange-100">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-1/4" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-1/2 mt-2" />
      </div>
      <div className="p-6">
        <div className="h-[300px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl" />
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg border border-orange-100">
      <div className="p-6 border-b border-orange-100">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-1/3" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-1/2 mt-2" />
      </div>
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg border border-orange-100">
      <div className="p-6 border-b border-orange-100">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-1/3" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-1/2 mt-2" />
      </div>
      <div className="p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ContentSkeleton;
