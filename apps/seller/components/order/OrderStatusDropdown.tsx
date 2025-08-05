import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
};

const OrderStatusDropdown = ({ statusFilter, setStatusFilter }: Props) => {
  return (
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-full sm:w-48">
        <SelectValue placeholder="Trạng thái đơn hàng" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả trạng thái</SelectItem>
        <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
        <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
        <SelectItem value="PREPARING">Đang chuẩn bị</SelectItem>
        <SelectItem value="DELIVERING">Đã giao shipper</SelectItem>
        <SelectItem value="DELIVERED">Đã giao hàng</SelectItem>
        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default OrderStatusDropdown;
