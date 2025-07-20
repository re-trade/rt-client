'use client';
import { BankAccountResponse, BankResponse } from '@services/payment-method.api';

interface ModalProps {
  open: boolean;
  editingAccount: BankAccountResponse | null;
  form: { selectedBankBin: string; accountNumber: string; userBankName: string };
  banks: BankResponse[];
  loading: boolean;
  onChange: (field: string, value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function BankAccountModal({
  open,
  editingAccount,
  form,
  banks,
  loading,
  onChange,
  onClose,
  onSave,
}: ModalProps) {
  if (!open) return null;

  const selectedBank = banks.find((b) => b.bin === form.selectedBankBin);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {editingAccount ? 'Sửa thông tin tài khoản' : 'Thêm tài khoản mới'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngân hàng</label>
              <select
                value={form.selectedBankBin}
                onChange={(e) => onChange('selectedBank', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2]"
              >
                <option value="">Chọn ngân hàng</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.bin}>
                    {bank.bin} – {bank.name}
                  </option>
                ))}
              </select>
              {selectedBank && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedBank.url} alt={selectedBank.name} className="w-6 h-6 rounded" />
                  <span>{selectedBank.name}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên chủ tài khoản
              </label>
              <input
                type="text"
                placeholder="NGUYEN VAN A"
                value={form.userBankName}
                onChange={(e) => onChange('userBankName', e.target.value.toUpperCase())}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số tài khoản</label>
              <input
                type="text"
                placeholder="1234567890"
                value={form.accountNumber}
                onChange={(e) => onChange('accountNumber', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#121212] border-t-transparent" />
              ) : null}
              <span>{editingAccount ? 'Cập nhật' : 'Thêm tài khoản'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
