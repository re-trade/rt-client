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
    <div className="form-control w-full relative">
      <label className="label">
        <span className="label-text">Ngân hàng</span>
      </label>
      <input
        className="input input-bordered w-full text-gray-700"
        value={query || (selected ? `${selected.code} – ${selected.name}` : '')}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Chọn ngân hàng..."
      />
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-base-100 border border-gray-200 rounded-box shadow-md max-h-60 overflow-auto text-gray-700">
          {bankList.length === 0 && <li className="px-4 py-2 text-gray-500">Không tìm thấy</li>}
          {bankList.map((bank) => (
            <li
              key={bank.id}
              onClick={() => {
                onChange(bank.bin);
                setQuery('');
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-base-200 cursor-pointer"
            >
              {bank.bin} – {bank.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
