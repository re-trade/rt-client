'use client';

import { BankResponse, getBanks } from '@services/payment-method.api';
import { useEffect, useState } from 'react';

export default function BankCombobox({
  banks,
  value,
  onChange,
}: {
  banks: BankResponse[];
  value: string;
  onChange: (bin: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [bankList, setBankList] = useState<BankResponse[]>([]);
  const selected = banks.find((b) => b.bin === value);

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchBankList = async () => {
        const params = new URLSearchParams();
        if (query) params.append('name', query);
        const result = await getBanks(0, 10, params.toString());
        if (result && result.success) {
          setBankList(result.content);
        }
      };
      fetchBankList();
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div className="w-full relative">
      <label className="block text-sm font-semibold text-[#121212] mb-1">Ngân hàng</label>
      <div className="relative">
        <input
          className="input w-full px-4 py-2.5 border border-[#525252]/20 text-[#121212] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all pr-10"
          value={query || (selected ? `${selected.code} – ${selected.name}` : '')}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="Tìm kiếm và chọn ngân hàng..."
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-[#525252]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {open && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-[#525252]/20 rounded-lg shadow-lg max-h-60 overflow-auto">
          {bankList.length === 0 && (
            <li className="px-4 py-3 text-[#525252] text-center">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5.657-2.343m0-11.314A7.962 7.962 0 0112 4a7.962 7.962 0 015.657 2.343M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Không tìm thấy ngân hàng
              </div>
            </li>
          )}
          {bankList.map((bank) => (
            <li
              key={bank.id}
              onClick={() => {
                onChange(bank.bin);
                setQuery('');
                setOpen(false);
              }}
              className="px-4 py-3 hover:bg-[#FFD2B2]/10 cursor-pointer transition-colors border-b border-[#525252]/10 last:border-b-0"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 mr-3 bg-[#FFD2B2] rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-[#121212]">{bank.code}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#121212]">{bank.name}</span>
                  <p className="text-sm text-[#525252]">{bank.code}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-[#525252] mt-1">Chọn ngân hàng mà bạn muốn thêm tài khoản</p>
    </div>
  );
}
