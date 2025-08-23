'use client';
import { BankInfoActiveTab } from '@/components/common/BankInfoActiveTab';
import { RevenueTableActiveTab } from '@/components/common/RevenueTableActiveTab';
import { WithdrawDialog } from '@/components/common/WithdrawDialog';
import { WithdrawHistoryActiveTab } from '@/components/common/WithdrawHistoryActivetab';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { revenueApi, RevenueStatsResponse } from '@/service/revenue.api';
import { walletApi, WalletResponse } from '@/service/wallet.api';
import {
  ArrowUpRight,
  Banknote,
  DollarSign,
  Download,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function RevenueManagement() {
  const [revenueStats, setRevenueStats] = useState<RevenueStatsResponse>({
    totalRevenue: 0,
    totalOrder: 0,
    totalItemsSold: 0,
    averageOrderValue: 0,
  });

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('revenue');
  const [wallet, setWallet] = useState<WalletResponse>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, wallet] = await Promise.all([
          revenueApi.getRevenuStatsBySeller(),
          walletApi.getWalletBySeller(),
        ]);
        if (!wallet.success) {
          toast.error(wallet.messages);
          return;
        }
        setWallet(wallet.content);
        setRevenueStats(stats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleWithdraw = (amount: number, method: string, bankInfo?: string) => {
    setIsWithdrawOpen(false);
  };
  const [isAddingBank, setIsAddingBank] = useState(false);
  const handleOpenAddBankForm = () => {
    setIsWithdrawOpen(false); // Đóng WithdrawDialog
    setActiveTab('bank'); // Chuyển sang tab "Thông tin ngân hàng"
    setIsAddingBank(true); // Mở form thêm tài khoản
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-orange-500 border-b-2 border-orange-400 pb-2 inline-block">
              Quản lý Doanh thu
            </h1>
            <p className="text-gray-600 mt-1">Theo dõi và quản lý doanh thu từ việc bán đồ cũ</p>
          </div>
          <div className="flex gap-3">

            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                  <Wallet className="h-4 w-4" />
                  Rút tiền
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tổng doanh thu</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {revenueStats.totalRevenue.toLocaleString('vi-VN')}₫
              </div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-gray-500">+20.1% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Số dư khả dụng</CardTitle>
              <Banknote className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {wallet?.balance.toLocaleString('vi-VN')}₫
              </div>
              <p className="text-xs text-gray-500 mt-1">Có thể rút ngay</p>
            </CardContent>
          </Card>

          <Card className="border shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tổng đơn hàng</CardTitle>
              <ShoppingCart className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueStats.totalOrder}</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-gray-500">+15% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng sản phẩm đã bán
              </CardTitle>
              <Package className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueStats.totalItemsSold}</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-gray-500">+15% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Giá trị TB/đơn</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {revenueStats.averageOrderValue.toLocaleString('vi-VN')}₫
              </div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-gray-500">+5.2% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('revenue')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'revenue'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Chi tiết doanh thu
              </button>
              <button
                onClick={() => setActiveTab('bank')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bank'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Thông tin ngân hàng
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'withdraw'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Lịch sử rút tiền
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <RevenueTableActiveTab />
              </div>
            )}

            {activeTab === 'bank' && (
              <div className="space-y-6">
                <BankInfoActiveTab isAddingBank={isAddingBank} setIsAddingBank={setIsAddingBank} />
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="space-y-4">
                <WithdrawHistoryActiveTab />
              </div>
            )}
          </div>
        </div>

        <WithdrawDialog
          open={isWithdrawOpen}
          onOpenChange={setIsWithdrawOpen}
          availableBalance={wallet?.balance || 0}
          onWithdraw={handleWithdraw}
          onOpenAddBankForm={handleOpenAddBankForm}
        />
      </div>
    </div>
  );
}
