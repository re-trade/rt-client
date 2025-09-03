import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface SellerStatusBadgeProps {
  verified: boolean;
  rejectReason: string | null;
}

export const SellerStatusBadge = ({ verified, rejectReason }: SellerStatusBadgeProps) => {
  return (
    <Badge
      className={`${
        verified
          ? 'bg-green-100 text-green-800 border-green-200'
          : rejectReason
            ? 'bg-red-100 text-red-800 border-red-200'
            : 'bg-orange-100 text-orange-800 border-orange-200'
      } font-medium`}
      variant="outline"
    >
      {verified ? (
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Đã xác minh
        </div>
      ) : rejectReason ? (
        <div className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Từ chối xác minh
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Chưa xác minh
        </div>
      )}
    </Badge>
  );
};
