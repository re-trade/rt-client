'use client';

import WalletBalanceCard from '@/components/wallet/WalletBalanceCard';
import WithdrawalHistoryTable from '@/components/wallet/WithdrawalHistoryTable';
import WithdrawalModal from '@/components/wallet/WithdrawalModal';
import { useWalletManager } from '@/hooks/use-wallet-manager';
import { AlertCircle, Download } from 'lucide-react';

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
    accountNumber,
    setAccountNumber,
    accountName,
    setAccountName,
    selectedBank,
    setSelectedBank,
    processingWithdrawal,

    bankModalOpen,
    setBankModalOpen,
    bankSearch,
    setBankSearch,

    setPage,
    refresh,
    handleWithdrawalSubmit,
    cancelWithdrawal,
    openWithdrawalModal,

    formatCurrency,
    formatDate,
  } = useWalletManager();

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#121212]">Ví của tôi</h1>
        <p className="text-[#525252] mt-1">Quản lý số dư và yêu cầu rút tiền</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <WalletBalanceCard
          balance={balance}
          loading={loading.balance}
          onRefresh={refresh}
          onWithdraw={openWithdrawalModal}
          formatCurrency={formatCurrency}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md border border-[#525252]/10 overflow-hidden">
        <div className="p-6 border-b border-[#525252]/10">
          <h2 className="text-lg font-semibold text-[#121212] flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Lịch sử rút tiền
          </h2>
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
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        accountName={accountName}
        setAccountName={setAccountName}
        selectedBank={selectedBank}
        setSelectedBank={setSelectedBank}
        bankModalOpen={bankModalOpen}
        setBankModalOpen={setBankModalOpen}
        bankSearch={bankSearch}
        setBankSearch={setBankSearch}
        balance={balance}
        processingWithdrawal={processingWithdrawal}
        onSubmit={handleWithdrawalSubmit}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
