'use client';

import WalletBalanceCard from '@/components/wallet/WalletBalanceCard';
import WithdrawalHistoryTable from '@/components/wallet/WithdrawalHistoryTable';
import WithdrawalModal from '@/components/wallet/WithdrawalModal';
import { useWalletManager } from '@/hooks/use-wallet-manager';
import { AlertCircle, Clock, Download, Shield, TrendingUp, Wallet } from 'lucide-react';

export default function WalletPage() {
  const {
    balance,
    withdrawals,
    loading,
    error,
    page,
    totalItems,
    size,

    isModalOpen,
    setIsModalOpen,
    withdrawAmount,
    setWithdrawAmount,
    withdrawContent,
    setWithdrawContent,
    selectedBankAccount,
    setSelectedBankAccount,
    processingWithdrawal,

    bankAccountModalOpen,
    setBankAccountModalOpen,
    userBankAccounts,
    loadingBankAccounts,

    setPage,
    refresh,
    handleWithdrawalSubmit,
    cancelWithdrawal,
    openWithdrawalModal,

    formatCurrency,
    formatDate,
  } = useWalletManager();

  // Calculate statistics
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'PENDING').length;
  const completedWithdrawals = withdrawals.filter((w) => w.status === 'COMPLETED').length;
  const totalWithdrawn = withdrawals
    .filter((w) => w.status === 'COMPLETED')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50">
      <div className="bg-white rounded-xl shadow-md border border-orange-200 overflow-hidden mx-4 sm:mx-6 mt-6">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Ví của tôi</h1>
              <p className="text-gray-600 mt-1">Quản lý số dư và yêu cầu rút tiền</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng đã rút</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalWithdrawn)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đang xử lý</p>
                <p className="text-2xl font-bold text-gray-900">{pendingWithdrawals}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{completedWithdrawals}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <WalletBalanceCard
            balance={balance}
            loading={loading.balance}
            onRefresh={refresh}
            onWithdraw={openWithdrawalModal}
            formatCurrency={formatCurrency}
          />
        </div>

        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
              Mẹo sử dụng ví hiệu quả
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Rút tiền định kỳ</h4>
                  <p className="text-gray-600 text-sm">
                    Thiết lập lịch rút tiền định kỳ để quản lý tài chính tốt hơn
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Kiểm tra thông tin</h4>
                  <p className="text-gray-600 text-sm">
                    Luôn kiểm tra kỹ thông tin ngân hàng trước khi rút tiền
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Download className="w-6 h-6 mr-3 text-orange-600" />
              Lịch sử rút tiền
            </h2>
            <p className="text-gray-600 mt-1">Theo dõi tất cả các giao dịch rút tiền của bạn</p>
          </div>

          <WithdrawalHistoryTable
            withdrawals={withdrawals}
            loading={loading.withdrawals}
            page={page}
            totalItems={totalItems}
            size={size}
            onPageChange={setPage}
            onCancelWithdrawal={cancelWithdrawal}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>

        <WithdrawalModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          withdrawContent={withdrawContent}
          setWithdrawContent={setWithdrawContent}
          selectedBankAccount={selectedBankAccount}
          setSelectedBankAccount={setSelectedBankAccount}
          bankAccountModalOpen={bankAccountModalOpen}
          setBankAccountModalOpen={setBankAccountModalOpen}
          userBankAccounts={userBankAccounts}
          loadingBankAccounts={loadingBankAccounts}
          balance={balance}
          processingWithdrawal={processingWithdrawal}
          onSubmit={handleWithdrawalSubmit}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
