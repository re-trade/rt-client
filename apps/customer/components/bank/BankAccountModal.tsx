'use client';
import BankCombobox from '@/components/bank/BankCombobox';
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

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[9999] transition-opacity duration-300 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-[10000] px-4">
        <div
          className="bg-gradient-to-r from-white to-orange-50 text-gray-800 rounded-xl shadow-2xl w-11/12 max-w-2xl p-0 overflow-hidden transform transition-all duration-300 scale-100 border border-orange-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">
                {editingAccount ? 'Sửa thông tin tài khoản' : 'Thêm tài khoản mới'}
              </h2>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              onClick={onClose}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-6">
            <BankCombobox
              banks={banks}
              value={form.selectedBankBin}
              onChange={(bin: string) => onChange('selectedBankBin', bin)}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Tên chủ tài khoản
              </label>
              <input
                type="text"
                placeholder="NGUYEN VAN A"
                value={form.userBankName}
                onChange={(e) => onChange('userBankName', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-orange-200 text-gray-800 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm hover:shadow-md"
              />
              <p className="text-xs text-gray-600 mt-2">
                Nhập tên chủ tài khoản theo đúng thông tin trên thẻ ngân hàng
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Số tài khoản</label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="1234567890"
                value={form.accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  onChange('accountNumber', value);
                }}
                onKeyPress={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== 'Backspace' &&
                    e.key !== 'Delete' &&
                    e.key !== 'Tab'
                  ) {
                    e.preventDefault();
                  }
                }}
                className="w-full px-4 py-3 border border-orange-200 text-gray-800 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all font-mono shadow-sm hover:shadow-md"
              />
              <p className="text-xs text-gray-600 mt-2">
                Chỉ nhập số, không có dấu cách hoặc ký tự đặc biệt
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 flex justify-end space-x-4 border-t border-orange-200">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onSave}
              disabled={
                loading || !form.selectedBankBin || !form.userBankName || !form.accountNumber
              }
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              <span>{editingAccount ? 'Cập nhật tài khoản' : 'Thêm tài khoản'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
