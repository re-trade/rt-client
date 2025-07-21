import { BankResponse } from '@services/payment-method.api';
import Image from 'next/image';

interface Props {
  bankModalOpen: boolean;
  setBankModalOpen: (open: boolean) => void;
  bankSearch: string;
  setBankSearch: (search: string) => void;
  selectedBank: BankResponse | null;
  setSelectedBank: (bank: BankResponse) => void;
  banks: BankResponse[];
}

const BankSelectionModal = ({
  bankModalOpen,
  setBankModalOpen,
  bankSearch,
  setBankSearch,
  setSelectedBank,
  banks,
}: Props) => {
  return (
    <dialog id="bank_modal" className={`modal ${bankModalOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-full max-w-md bg-white p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-[#121212] mb-4">Chọn ngân hàng</h3>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm ngân hàng..."
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            className="block w-full rounded-md border border-[#525252]/20 shadow-sm py-2 px-3 focus:border-[#FFD2B2] focus:ring focus:ring-[#FFD2B2] focus:ring-opacity-50"
          />
        </div>

        <div className="max-h-60 overflow-y-auto divide-y divide-gray-200">
          {banks.map((bank) => (
            <div
              key={bank.bin}
              className="py-2 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                setSelectedBank(bank);
                setBankModalOpen(false);
              }}
            >
              <div className="flex items-center p-2">
                <Image
                  width={100}
                  height={100}
                  src={bank.url}
                  alt={bank.name}
                  className="w-8 h-8 mr-3 object-contain"
                />
                <span className="font-medium">{bank.name}</span>
              </div>
            </div>
          ))}
          {banks.length === 0 && (
            <div className="py-4 text-center text-[#525252]">Không tìm thấy ngân hàng phù hợp</div>
          )}
        </div>

        <div className="pt-4 flex justify-end modal-action">
          <button
            type="button"
            onClick={() => setBankModalOpen(false)}
            className="btn btn-outline border border-[#525252]/20 rounded-lg text-[#525252] hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={() => setBankModalOpen(false)}></div>
    </dialog>
  );
};
export default BankSelectionModal;
