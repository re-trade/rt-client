import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { approveSeller, TSellerProfile } from '@/services/seller.api';
import {
  ExternalLink,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Shield,
  ShieldOff,
  Store,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SellerStatusBadge } from './SellerStatusBadge';

interface SellerTableRowProps {
  seller: TSellerProfile;
  index: number;
  onView: (seller: TSellerProfile) => void;
  refetch: () => void;
}

export const SellerTableRow = ({ seller, index, onView, refetch }: SellerTableRowProps) => {
  const router = useRouter();
  const handleQuickApprove = async () => {
    const result = await approveSeller(seller.id, true, false); // Force = true by passing identityVerified = false
    if (result.success) {
      const message =
        result.messages?.length > 0
          ? result.messages.join(', ')
          : result.message || 'Xác minh người bán thành công!';
      toast.success(message, { position: 'top-right' });
      refetch();
    } else {
      const errorMessage =
        result.messages?.length > 0
          ? result.messages.join(', ')
          : result.message || 'Có lỗi xảy ra';
      toast.error(errorMessage, { position: 'top-right' });
    }
  };

  return (
    <TableRow
      key={seller.id}
      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
      }`}
      onClick={() => router.push(`/dashboard/seller/${seller.id}`)}
    >
      <TableCell className="font-mono text-sm text-gray-600">{seller.id.slice(0, 8)}</TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          {seller.avatarUrl ? (
            <img
              src={seller.avatarUrl}
              alt={`${seller.shopName}'s avatar`}
              className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm"
            style={{ display: seller.avatarUrl ? 'none' : 'flex' }}
          >
            <Store className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{seller.shopName}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-gray-400" />
            <span className="text-gray-900">{seller.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="text-gray-600">{seller.email}</span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="max-w-48">
          <p className="text-sm text-gray-900 truncate">{seller.addressLine}</p>
          <p className="text-xs text-gray-500 truncate">
            {seller.ward}, {seller.district}, {seller.state}
          </p>
        </div>
      </TableCell>

      <TableCell>
        <SellerStatusBadge verified={seller.verified} rejectReason={seller.rejectReason} />
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title="Thao tác"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onView(seller);
              }}
              className="cursor-pointer"
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết (Modal)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/seller/${seller.id}`);
              }}
              className="cursor-pointer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Mở trang chi tiết
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!seller.verified && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickApprove();
                }}
                className="cursor-pointer"
              >
                <Shield className="h-4 w-4 mr-2" />
                Xác minh tài khoản
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <ShieldOff className="h-4 w-4 mr-2" />
              Khóa tài khoản
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
