'use client';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconOnly?: boolean;
  clickable?: boolean;
}

export function Logo({
  size = 'md',
  className = '',
  iconOnly = false,
  clickable = false
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={cn(
        'flex items-center gap-2 font-bold',
        sizeClasses[size],
        clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
    >
      {/* Poker chip icon */}
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>

      {!iconOnly && (
        <span className="text-white">
          estim<span className="text-cyan-400">AI</span>te
        </span>
      )}
    </Component>
  );
}
