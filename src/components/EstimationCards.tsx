import React from 'react';
import { cn } from '@/lib/utils';
import { ESTIMATION_CARDS, type EstimationCardValue } from '@/types';

interface EstimationCardsProps {
  selectedValue?: EstimationCardValue;
  onSelect: (value: EstimationCardValue) => void;
  disabled?: boolean;
  revealed?: boolean;
}

export function EstimationCards({
  selectedValue,
  onSelect,
  disabled = false,
  revealed = false
}: EstimationCardsProps) {
  const getCardColor = (value: EstimationCardValue): string => {
    if (value === '?') return 'bg-gray-700 text-gray-200 border-gray-600';

    const numValue = typeof value === 'string' ? parseInt(value) : value;

    if (numValue <= 3) return 'bg-green-900/30 text-green-300 border-green-700';
    if (numValue <= 8) return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
    if (numValue <= 13) return 'bg-orange-900/30 text-orange-300 border-orange-700';
    return 'bg-red-900/30 text-red-300 border-red-700';
  };

  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-2 lg:gap-3"
      role="radiogroup"
      aria-label="Story point estimation cards"
    >
      {ESTIMATION_CARDS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => !disabled && onSelect(value as EstimationCardValue)}
          disabled={disabled}
          role="radio"
          aria-checked={selectedValue === value}
          className={cn(
            'aspect-[3/4] rounded-lg font-semibold text-base lg:text-lg border-2 transition-all duration-200',
            'flex items-center justify-center min-h-[60px] lg:min-h-[80px]',
            'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            'touch-manipulation', // Improves touch responsiveness
            getCardColor(value as EstimationCardValue),
            selectedValue === value && !revealed && 'ring-2 ring-blue-500 scale-105 border-blue-500',
            selectedValue === value && revealed && 'ring-2 ring-green-500 scale-105 border-green-500'
          )}
          aria-label={`Estimate ${label} story points`}
        >
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
