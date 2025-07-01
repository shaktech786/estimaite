'use client';

import { BrandName as ShakUIBrandName } from 'shakui';

interface BrandNameProps {
  className?: string;
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function BrandName({ className = '', variant = 'default', size = 'md' }: BrandNameProps) {
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
    <ShakUIBrandName
      name="estimAIte"
      aiText="AI"
      colors={colors}
      size={size}
      className={className}
    />
  );
}
