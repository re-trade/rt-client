import { TProductHistory } from '@services/product.api';
import Image from 'next/image';
import { MdHistory, MdPerson } from 'react-icons/md';

interface ProductHistoryListProps {
  history: TProductHistory[];
  loading?: boolean;
}

const HistorySkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-full lg:w-48 h-36 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl"></div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="h-6 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-2/3"></div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-24"></div>
                <div className="h-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="bg-white rounded-2xl border border-orange-100 shadow-sm">
    <div className="p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
        <MdHistory size={40} className="text-orange-400" style={{ color: '#fb923c' }} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: '#1f2937' }}>
        Chưa có lịch sử sở hữu
      </h3>
      <p className="text-gray-600 text-sm max-w-md mx-auto" style={{ color: '#6b7280' }}>
        Sản phẩm này chưa có thông tin về những người đã từng sở hữu. Bạn có thể là người đầu tiên!
      </p>
    </div>
  </div>
);

export function ProductHistoryList({ history, loading = false }: ProductHistoryListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100">
        <div className="p-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <MdHistory size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800" style={{ color: '#1f2937' }}>
                Lịch sử sở hữu
              </h2>
              <p className="text-gray-600 text-sm mt-1" style={{ color: '#6b7280' }}>
                Theo dõi những người đã từng sở hữu sản phẩm này
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <HistorySkeleton />
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100">
        <div className="p-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <MdHistory size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800" style={{ color: '#1f2937' }}>
                Lịch sử sở hữu
              </h2>
              <p className="text-gray-600 text-sm mt-1" style={{ color: '#6b7280' }}>
                Theo dõi những người đã từng sở hữu sản phẩm này
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100">
        <div className="p-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <MdHistory size={20} className="text-white" />
            </div>{' '}
            <div>
              <h2 className="text-2xl font-bold text-gray-800" style={{ color: '#1f2937' }}>
                Lịch sử sở hữu
              </h2>
              <p className="text-gray-600 text-sm mt-1" style={{ color: '#6b7280' }}>
                Theo dõi những người đã từng sở hữu sản phẩm này ({history.length} chủ sở hữu)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={`${item.ownerId}-${index}`}
                className="group relative bg-gradient-to-br from-orange-25 to-orange-50 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] overflow-hidden"
              >
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 to-orange-500 opacity-30"></div>
                <div className="absolute left-4 top-8 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-sm"></div>

                <div className="p-6 pl-12">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                      <div className="w-full lg:w-48 h-36 relative rounded-xl overflow-hidden border-2 border-orange-200 shadow-sm">
                        <Image
                          src={item.productThumbnail || '/image_login.jpg'}
                          alt={item.productName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3
                          className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors"
                          style={{ color: '#1f2937' }}
                        >
                          {item.productName}
                        </h3>
                        <p
                          className="text-gray-600 text-sm leading-relaxed line-clamp-2"
                          style={{ color: '#6b7280' }}
                        >
                          {item.productDescription}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-orange-200 shadow-sm">
                              <Image
                                src={item.ownerAvatarUrl || '/image_login.jpg'}
                                alt={item.ownerName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <MdPerson size={16} className="text-orange-500" />
                              <span
                                className="font-semibold text-gray-800"
                                style={{ color: '#1f2937' }}
                              >
                                {item.ownerName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
              <span className="text-sm" style={{ color: '#9ca3af' }}>
                Bắt đầu lịch sử sản phẩm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
