'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, Clock, CreditCard, Wallet, XCircle } from 'lucide-react';
import { useState } from 'react';
interface WithdrawData {
  id: string;
  date: string;
  amount: number;
  method: 'bank' | 'momo' | 'zalopay';
  status: 'pending' | 'completed' | 'failed';
  bankInfo?: string;
}
const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'cancelled':
    case 'failed':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};
export function WithdrawHistoryActiveTab() {
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawData[]>([]);
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lịch sử rút tiền</h3>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Mã GD</TableHead>
              <TableHead className="font-semibold">Ngày</TableHead>
              <TableHead className="font-semibold text-right">Số tiền</TableHead>
              <TableHead className="font-semibold">Phương thức</TableHead>
              <TableHead className="font-semibold">Thông tin TK</TableHead>
              <TableHead className="font-semibold text-center">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawHistory.map((withdraw) => (
              <TableRow key={withdraw.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-blue-600">{withdraw.id}</TableCell>
                <TableCell>{new Date(withdraw.date).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell className="text-right font-bold">
                  {withdraw.amount.toLocaleString('vi-VN')}₫
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {withdraw.method === 'bank'
                      ? 'Ngân hàng'
                      : withdraw.method === 'momo'
                        ? 'MoMo'
                        : 'ZaloPay'}
                  </div>
                </TableCell>
                <TableCell>{withdraw.bankInfo || 'N/A'}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdraw.status)}`}
                  >
                    {getStatusIcon(withdraw.status)}
                    <span className="ml-1">
                      {withdraw.status === 'completed'
                        ? 'Hoàn thành'
                        : withdraw.status === 'pending'
                          ? 'Đang xử lý'
                          : 'Thất bại'}
                    </span>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {withdrawHistory.length === 0 && (
        <div className="text-center py-12">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử rút tiền</h3>
          <p className="text-gray-500">Các giao dịch rút tiền của bạn sẽ hiển thị ở đây</p>
        </div>
      )}
    </div>
  );
}
