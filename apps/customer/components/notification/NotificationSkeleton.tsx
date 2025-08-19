'use client';

interface NotificationSkeletonProps {
  count?: number;
}

export default function NotificationSkeleton({ count = 5 }: NotificationSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
          <div className="flex items-start space-x-3">
            {/* Icon skeleton */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>

            {/* Content skeleton */}
            <div className="flex-1 min-w-0">
              {/* Type badge and date */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-16 h-5 bg-gray-300 rounded-full"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>

              {/* Title */}
              <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>

              {/* Content */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-gray-200 rounded"></div>
                <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Action button skeleton */}
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
