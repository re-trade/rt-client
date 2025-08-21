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
import { Check, ChevronsUpDown, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';

interface SelectBrandProps {
  value: string;
  currentBrandId?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SelectBrand({
  value,
  currentBrandId,
  onChange,
  disabled = false,
}: SelectBrandProps) {
  const [brands, setBrands] = useState<TBrand[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredBrands, setFilteredBrands] = useState<TBrand[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
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
            onChange(current.id); // Đảm bảo value được cập nhật
          } else {
            setInputValue('');
            onChange('');
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

  const handleImageError = (brandId: string) => {
    setImageErrors((prev) => new Set(prev).add(brandId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newValue = e.target.value;
    setInputValue(newValue);

    // Chỉ reset value nếu input rỗng
    if (newValue === '') {
      onChange('');
    }

    if (!open) {
      setOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) setOpen(true);
  };

  const handleInputClick = () => {
    if (disabled) return;

    setOpen(true);
    if (selectedBrand && inputValue === selectedBrand.name) {
      setInputValue('');
    }
  };

  const handleSelectBrand = (brand: TBrand) => {
    if (disabled) return;

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

  const BrandLogo = ({ brand }: { brand: TBrand }) => {
    const hasError = imageErrors.has(brand.id);

    if (!brand.imgUrl || hasError) {
      return (
        <div className="w-6 h-6 bg-gray-100 rounded-sm flex items-center justify-center mr-3 flex-shrink-0">
          <ImageIcon className="w-3 h-3 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="w-6 h-6 mr-3 flex-shrink-0 relative rounded-sm overflow-hidden bg-gray-50">
        <Image
          src={brand.imgUrl}
          alt={`${brand.name} logo`}
          fill
          className="object-contain"
          sizes="24px"
          onError={() => handleImageError(brand.id)}
        />
      </div>
    );
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
          disabled={loading || disabled}
          className={`h-11 pr-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                      className={cn(
                        'flex items-center py-2',
                        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                      )}
                    >
                      <BrandLogo brand={brand} />
                      <div className="flex items-center flex-1 min-w-0">
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 flex-shrink-0',
                            brand.id === value ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <span className="truncate">{brand.name}</span>
                      </div>
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