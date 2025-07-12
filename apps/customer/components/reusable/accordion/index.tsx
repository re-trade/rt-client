'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

type AccordionProps = {
  children: React.ReactNode;
  title: React.ReactNode;
  id?: string;
  active?: boolean;
  showChevron?: boolean;
  chevronPosition?: 'left' | 'right';
};

export default function Accordion({
  children,
  title,
  id,
  active = false,
  showChevron = true,
  chevronPosition = 'right',
}: AccordionProps) {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);

  useEffect(() => {
    setAccordionOpen(active);
  }, [active]);

  return (
    <div className="py-2">
      <h2>
        <button
          className="flex items-center justify-between w-full text-left font-semibold pb-3 group"
          onClick={(e) => {
            e.preventDefault();
            setAccordionOpen(!accordionOpen);
          }}
          aria-expanded={accordionOpen}
          aria-controls={`accordion-text-${id}`}
        >
          {chevronPosition === 'left' && showChevron && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <IconChevronDown
                  size={20}
                  className={`text-orange-600 transition-all duration-200 ease-out group-hover:text-orange-700 transform origin-center ${
                    accordionOpen
                      ? 'rotate-180 scale-110'
                      : 'rotate-0 scale-100 group-hover:scale-110'
                  }`}
                />
              </div>
              <span className="flex items-center gap-2">{title}</span>
            </div>
          )}

          {chevronPosition === 'right' && (
            <span className="flex items-center gap-2 flex-1">{title}</span>
          )}

          {chevronPosition === 'right' && showChevron && (
            <div className="relative">
              <IconChevronDown
                size={20}
                className={`text-orange-600 transition-all duration-200 ease-out group-hover:text-orange-700 flex-shrink-0 transform origin-center ${
                  accordionOpen
                    ? 'rotate-180 scale-110'
                    : 'rotate-0 scale-100 group-hover:scale-110'
                }`}
              />
            </div>
          )}
        </button>
      </h2>
      <div
        id={`accordion-text-${id}`}
        role="region"
        aria-labelledby={`accordion-title-${id}`}
        className={`grid text-sm overflow-hidden transition-all duration-300 ease-in-out ${
          accordionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
}
