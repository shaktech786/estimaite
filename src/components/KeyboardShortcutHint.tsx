import React from 'react';

interface KeyboardShortcutHintProps {
  shortcutDisplay: string;
  isMobile: boolean;
  className?: string;
}

export function KeyboardShortcutHint({ 
  shortcutDisplay, 
  isMobile, 
  className = '' 
}: KeyboardShortcutHintProps) {
  if (isMobile) return null;

  return (
    <span className={`text-xs text-gray-400 ${className}`}>
      {shortcutDisplay}
    </span>
  );
}
