'use client';

interface BrandNameProps {
  className?: string;
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function BrandName({ className = '' }: BrandNameProps) {

  // const colors = getColors(); // Removed unused variable

  return (
    <span className={className}>
      <span className="text-primary">estim</span>
      <span className="text-accent font-bold">AI</span>
      <span className="text-primary">te</span>
    </span>
  );
}
