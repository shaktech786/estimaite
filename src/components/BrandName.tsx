import React from 'react';

interface BrandNameProps {
  className?: string;
  variant?: 'default' | 'light' | 'dark';
}

export function BrandName({ className = '', variant = 'default' }: BrandNameProps) {
  const getColors = () => {
    switch (variant) {
      case 'light':
        return {
          text: 'text-gray-800',
          ai: 'text-blue-600'
        };
      case 'dark':
        return {
          text: 'text-white',
          ai: 'text-cyan-400'
        };
      default:
        return {
          text: 'text-inherit',
          ai: 'text-cyan-400'
        };
    }
  };

  const colors = getColors();

  return (
    <span className={className}>
      <span className={colors.text}>estim</span>
      <span className={colors.ai}>AI</span>
      <span className={colors.text}>te</span>
    </span>
  );
}
