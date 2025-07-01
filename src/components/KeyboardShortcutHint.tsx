'use client';
import { KeyboardShortcutHint as ShakUIKeyboardShortcutHint } from '@shakgpt/ui';

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
  return (
    <ShakUIKeyboardShortcutHint
      shortcut={shortcutDisplay}
      className={className}
      showOnMobile={!isMobile}
      variant="subtle"
    />
  );
}
