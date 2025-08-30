import { Skeleton } from '@/components/ui/skeleton';

const RetradeProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-36" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <Skeleton className="h-[500px] w-full rounded-2xl mb-4" />
            <div className="flex gap-2 overflow-x-auto">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-24 rounded-xl flex-shrink-0" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>

        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default RetradeProductDetailSkeleton;
