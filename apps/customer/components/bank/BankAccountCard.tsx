import { useBankGradient } from '@/hooks/use-bank-gradient';
import { BankAccountResponse, BankResponse } from '@services/payment-method.api';
import { format } from 'date-fns';
import { Calendar, CreditCard, Edit3, Trash2, User } from 'lucide-react';

interface ModalProps {
  account: BankAccountResponse;
  banks: BankResponse[];
  openEditModal: (account: BankAccountResponse) => void;
  handleDelete: (id: string) => void;
}

function formatTimestamp(addedDate?: string) {
  if (!addedDate) return '—';
  const timestamp = Number(addedDate);
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp;

  return format(new Date(ms), 'dd/MM/yyyy');
}

const BankAccountCard = ({ account, banks, openEditModal, handleDelete }: ModalProps) => {
  const bank = banks.find((b) => b.bin === account.bankBin);
  const gradient = useBankGradient(bank?.url || '', bank?.bin || '');
  return (
    <div
      key={account.id}
      className="relative group border border-[#525252]/20 rounded-2xl p-6 hover:border-[#FFD2B2] hover:shadow-lg transition-all duration-300 bg-white"
    >
      <div
        style={{ background: gradient ?? undefined }}
        className={`relative rounded-xl p-4 text-white mb-4 shadow-lg ${
          gradient ? '' : 'bg-gradient-to-r from-gray-500 to-gray-600'
        }`}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            {bank && (
              <img src={bank.url} alt={bank.name} className="w-8 h-8 rounded-md bg-white/20 p-1" />
            )}
            <div className="text-lg font-bold">{account.bankName}</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 opacity-75" />
            <div className="text-lg font-mono tracking-wider">
              {account.accountNumber.replace(/(.{4})/g, '$1 ').trim()}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 opacity-75" />
            <div>
              <div className="text-sm font-medium">{account.userBankName}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-[#525252]">
          <Calendar className="w-4 h-4 mr-2 text-[#FFD2B2]" />
          <span>Thêm ngày: {formatTimestamp(account.addedDate)}</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => openEditModal(account)}
          className="flex items-center justify-center bg-[#FFD2B2]/20 text-[#121212] hover:bg-[#FFD2B2]/40 p-2.5 rounded-lg transition-all duration-200 border border-[#FFD2B2]/30"
          aria-label={`Sửa tài khoản ${account.bankName}`}
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(account.id)}
          className="flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 p-2.5 rounded-lg transition-all duration-200 border border-red-200 disabled:opacity-50"
          aria-label={`Xóa tài khoản ${account.bankName}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BankAccountCard;
