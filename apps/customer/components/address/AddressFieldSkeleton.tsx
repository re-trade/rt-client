'use client';

interface AddressFieldSkeletonProps {
  count?: number;
}

export function AddressFieldSkeleton({ count = 1 }: AddressFieldSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="form-control w-full items-start animate-pulse">
          <div className="h-4 bg-gray-200 rounded-md w-24 mb-2"></div>

          <div className="relative w-full">
            <div className="w-full h-12 bg-gray-100 border-2 border-gray-200 rounded-xl"></div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="min-h-[24px] mt-2">
            <div className="h-3 bg-gray-100 rounded w-32 opacity-0"></div>
          </div>
        </div>
      ))}
    </>
  );
}

interface AddressCardSkeletonProps {
  count?: number;
}

export function AddressCardSkeleton({ count = 2 }: AddressCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="relative p-5 rounded-xl border-2 border-gray-200 bg-white animate-pulse"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 bg-gray-200 rounded-md w-32"></div>
            <div className="h-5 bg-gray-100 rounded-full w-16"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full mt-0.5"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AddressSelectionSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gray-100 p-5 md:p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200"></div>
          <div className="h-6 bg-gray-200 rounded w-40"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-5 md:p-6 bg-gray-50">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-100 rounded-full w-24"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
