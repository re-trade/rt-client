'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { brandApi, type TBrand } from '@/service/brand.api';
import { Check, ChevronsUpDown } from 'lucide-react';
import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';

interface SelectBrandProps {
  value: string;
  currentBrandId?: string;
  onChange: (value: string) => void;
}

export function SelectBrand({ value, currentBrandId, onChange }: SelectBrandProps) {
  const [brands, setBrands] = useState<TBrand[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredBrands, setFilteredBrands] = useState<TBrand[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const data = await brandApi.getAllBrandNoPagination();
        setBrands(data);
        setFilteredBrands(data);
        if (currentBrandId) {
          const current = data.find((b) => b.id === currentBrandId);
          if (current) {
            setInputValue(current.name);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thương hiệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [currentBrandId, onChange]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter((brand) =>
        brand.name.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setFilteredBrands(filtered);
    }
  }, [inputValue, brands]);

  const selectedBrand = brands.find((b) => b.id === value);

  useEffect(() => {
    if (selectedBrand && !open) {
      setInputValue(selectedBrand.name);
    }
  }, [selectedBrand, open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        if (!selectedBrand) {
          setInputValue('');
        }
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, selectedBrand]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (selectedBrand && newValue !== selectedBrand.name) {
      onChange('');
    }

    if (!open) {
      setOpen(true);
    }
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleInputClick = () => {
    setOpen(true);
    if (selectedBrand && inputValue === selectedBrand.name) {
      setInputValue('');
    }
  };

  const handleSelectBrand = (brand: TBrand) => {
    onChange(brand.id);
    setInputValue(brand.name);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={loading ? 'Đang tải...' : 'Chọn hoặc tìm thương hiệu...'}
          disabled={loading}
          className="pr-8"
          autoComplete="off"
        />
        <ChevronsUpDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 opacity-50 pointer-events-none" />
      </div>

      {open && (
        <div className="absolute top-full left-0 z-50 w-full mt-1">
          <div className="rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none">
            <Command>
              <CommandList>
                <CommandEmpty>Không tìm thấy thương hiệu.</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-y-auto">
                  {filteredBrands.map((brand) => (
                    <CommandItem
                      key={brand.id}
                      value={brand.name}
                      onSelect={() => handleSelectBrand(brand)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          brand.id === value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {brand.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </div>
  );
}
