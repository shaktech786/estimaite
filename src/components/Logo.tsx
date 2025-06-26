import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconOnly?: boolean;
  clickable?: boolean;
}

export function Logo({ size = 'md', className = '', iconOnly = false, clickable = true }: LogoProps) {
  const sizeClasses = {
    sm: { text: 'text-lg', icon: 'w-6 h-6' },
    md: { text: 'text-2xl', icon: 'w-8 h-8' },
    lg: { text: 'text-4xl', icon: 'w-12 h-12' }
  };

  const LogoIcon = ({ className: iconClassName }: { className: string }) => (
    <div className={iconClassName}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer segmented ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="10 4.11"
          transform="rotate(15 50 50)"
          className="text-white"
        />
        {/* Inner circle for framing */}
        <circle cx="50" cy="50" r="34" fill="#1f2937" />
        {/* Inner double rings */}
        <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="2.5" className="text-white" />
        <circle cx="50" cy="50" r="27" stroke="currentColor" strokeWidth="1.5" className="text-white" />
        {/* "AI" Text */}
        <text
          x="50"
          y="50"
          fontFamily="Inter, sans-serif"
          fontSize="28"
          fontWeight="600"
          fill="currentColor"
          textAnchor="middle"
          dy="0.35em"
          className="text-white"
        >
          AI
        </text>
      </svg>
    </div>
  );

  const LogoContent = () => {
    if (iconOnly) {
      return <LogoIcon className={`${sizeClasses[size].icon} ${className}`} />;
    }

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <LogoIcon className={sizeClasses[size].icon} />
        <h1 className={`font-semibold text-white tracking-tight ${sizeClasses[size].text}`}>
          <span>estim</span>
          <span className="text-cyan-400">AI</span>
          <span>te</span>
        </h1>
      </div>
    );
  };

  if (!clickable) {
    return <LogoContent />;
  }

  return (
    <Link 
      href="/" 
      className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
      title="Go to home page"
    >
      <LogoContent />
    </Link>
  );
}
