'use client';
// Removed ShakUI import

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
    <div className={`text-xs text-gray-400 font-medium ${className}`}>
      <span className="bg-gray-800 border border-gray-600 px-2 py-1 rounded-md font-mono">
        {shortcutDisplay}
      </span>
    </div>
  );
}
