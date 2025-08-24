import { ArrowLeftRight, Eye, EyeOff, Plus, Wallet } from 'lucide-react';
import React, { useState } from 'react';

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
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Wallet className="w-6 h-6 text-orange-600" />
          </div>
          {/* <h2 className="text-lg font-semibold text-gray-900">Số dư ví</h2> */}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title={showBalance ? 'Ẩn số dư' : 'Hiện số dư'}
          >
            {showBalance ? (
              <EyeOff className="w-4 h-4 text-gray-600" />
            ) : (
              <Eye className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={onRefresh}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="Làm mới"
            disabled={loading}
          >
            <ArrowLeftRight className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="mb-6">
        {loading ? (
          <div className="animate-pulse h-12 w-48 bg-gray-200 rounded-lg"></div>
        ) : (
          <div className="space-y-1">
            <div className="text-xl font-bold text-gray-900">
              {showBalance ? formatCurrency(balance) : '••••••••'}
            </div>
            <p className="text-gray-600 text-sm">Số dư khả dụng</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={onWithdraw}
          className="w-full bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-700 transition-all duration-200 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading || balance <= 0}
        >
          <Plus className="w-5 h-5 mr-2" />
          Rút tiền
        </button>

        {balance <= 0 && (
          <p className="text-gray-500 text-xs text-center">Số dư không đủ để thực hiện rút tiền</p>
        )}
      </div>
    </div>
  );
};

export default WalletBalanceCard;
