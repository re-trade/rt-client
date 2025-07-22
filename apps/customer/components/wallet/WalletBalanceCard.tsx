import { ArrowLeftRight, Plus, Wallet } from 'lucide-react';
import React from 'react';

interface WalletBalanceCardProps {
  balance: number;
  loading: boolean;
  onRefresh: () => void;
  onWithdraw: () => void;
  formatCurrency: (amount: number) => string;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  loading,
  onRefresh,
  onWithdraw,
  formatCurrency,
}) => {
  return (
    <div className="col-span-1 bg-white rounded-xl shadow-md p-6 border border-[#525252]/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#121212] flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Số dư ví
        </h2>
        <button
          onClick={onRefresh}
          className="text-[#525252] hover:text-[#121212] transition-colors"
          title="Làm mới"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      </div>
      <div className="mb-4">
        {loading ? (
          <div className="animate-pulse h-10 w-40 bg-gray-200 rounded"></div>
        ) : (
          <div className="text-3xl font-bold text-[#121212]">{formatCurrency(balance)}</div>
        )}
      </div>
      <button
        onClick={onWithdraw}
        className="w-full bg-[#FFD2B2] hover:bg-[#FFB980] transition-colors text-[#121212] font-medium py-2 px-4 rounded-lg flex items-center justify-center"
        disabled={loading || balance <= 0}
      >
        <Plus className="w-4 h-4 mr-2" />
        Rút tiền
      </button>
    </div>
  );
};

export default WalletBalanceCard;
