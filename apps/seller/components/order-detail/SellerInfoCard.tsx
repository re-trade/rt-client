import { User } from 'lucide-react';
import Image from 'next/image';

interface SellerInfoCardProps {
  sellerName: string;
  sellerId: string | undefined;
  sellerAvatarUrl?: string;
}

export function SellerInfoCard({ sellerName, sellerId, sellerAvatarUrl }: SellerInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="p-2 bg-orange-100 rounded-lg">
          <User className="w-5 h-5 text-orange-600" />
        </div>
        Thông tin người bán
      </h2>
      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200">
        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
          {sellerAvatarUrl ? (
            <Image
              src={sellerAvatarUrl}
              alt={sellerName}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{sellerName}</h3>
          <p className="text-sm text-gray-600">
            ID: {sellerId ? sellerId.slice(0, 8) + '...' : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
