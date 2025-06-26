import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomCodeCopyProps {
  roomCode: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RoomCodeCopy({
  roomCode,
  className = '',
  showLabel = true,
  size = 'md'
}: RoomCodeCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy room code:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = roomCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabel && (
        <span className="text-gray-300 font-medium">Room Code:</span>
      )}
      <div className="flex items-center gap-1">
        <span className={cn(
          'font-mono font-bold text-white bg-gray-700 rounded border border-gray-600',
          sizeClasses[size]
        )}>
          {roomCode}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center justify-center rounded border transition-all duration-200',
            'hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
            copied
              ? 'bg-green-700 border-green-600 text-green-100'
              : 'bg-gray-800 border-gray-600 text-gray-300',
            sizeClasses[size]
          )}
          title={copied ? 'Copied!' : 'Copy room code'}
        >
          {copied ? (
            <Check className={iconSizes[size]} />
          ) : (
            <Copy className={iconSizes[size]} />
          )}
        </button>
      </div>
      {copied && (
        <span className="text-green-400 text-xs animate-pulse">
          Copied!
        </span>
      )}
    </div>
  );
}
