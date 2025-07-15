'use client';
import React from 'react';
import { type EstimationCardValue, ESTIMATION_CARDS } from '@/types';

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
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8">
      {ESTIMATION_CARDS.map((card) => (
        <button
          key={card.value}
          onClick={() => onSelect(card.value as EstimationCardValue)}
          disabled={disabled}
          className={`
            relative aspect-[3/4] rounded-2xl border-2 transition-all duration-300
            flex items-center justify-center text-xl font-bold backdrop-blur-xl
            ${selectedValue === card.value
              ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 scale-105 shadow-xl shadow-cyan-400/20 ring-2 ring-cyan-400/30'
              : 'border-gray-800 bg-gray-950/50 text-gray-400 hover:border-gray-700 hover:bg-gray-900/50 hover:shadow-lg hover:text-gray-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-102 active:scale-95'}
            ${revealed && selectedValue === card.value ? 'ring-4 ring-cyan-400/50' : ''}
          `}
        >
          <span className="text-2xl font-extrabold">{card.label}</span>
          {selectedValue === card.value && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center border-2 border-black">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
