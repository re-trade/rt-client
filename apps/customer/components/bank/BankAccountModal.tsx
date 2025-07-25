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
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div
          className="bg-white text-[#121212] rounded-xl shadow-xl w-11/12 max-w-2xl p-0 overflow-hidden transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#FFD2B2] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-[#121212]"
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
              <h2 className="text-xl font-bold text-[#121212]">
                {editingAccount ? 'Sửa thông tin tài khoản' : 'Thêm tài khoản mới'}
              </h2>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-[#121212] hover:bg-white/40 transition-colors"
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
              <label className="block text-sm font-semibold text-[#121212] mb-1">
                Tên chủ tài khoản
              </label>
              <input
                type="text"
                placeholder="NGUYEN VAN A"
                value={form.userBankName}
                onChange={(e) => onChange('userBankName', e.target.value.toUpperCase())}
                className="input w-full px-4 py-2.5 border border-[#525252]/20 text-[#121212] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all"
              />
              <p className="text-xs text-[#525252] mt-1">
                Nhập tên chủ tài khoản theo đúng thông tin trên thẻ ngân hàng
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#121212] mb-1">
                Số tài khoản
              </label>
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
                className="input w-full px-4 py-2.5 border border-[#525252]/20 text-[#121212] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all font-mono"
              />
              <p className="text-xs text-[#525252] mt-1">
                Chỉ nhập số, không có dấu cách hoặc ký tự đặc biệt
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#525252]/10 text-[#121212] rounded-lg hover:bg-[#525252]/20 transition-colors font-medium"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onSave}
              disabled={
                loading || !form.selectedBankBin || !form.userBankName || !form.accountNumber
              }
              className="px-6 py-2.5 bg-[#FFD2B2] text-[#121212] font-semibold rounded-lg hover:bg-[#FFB980] transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#121212] border-t-transparent" />
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
