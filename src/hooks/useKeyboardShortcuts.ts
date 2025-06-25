import { useEffect, useCallback, useState } from 'react';

interface UseKeyboardShortcutsOptions {
  onSubmit?: () => void;
  enabled?: boolean;
}

interface PlatformInfo {
  isMac: boolean;
  isMobile: boolean;
  shortcutKey: string;
  shortcutDisplay: string;
}

export function useKeyboardShortcuts({ onSubmit, enabled = true }: UseKeyboardShortcutsOptions = {}) {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isMac: false,
    isMobile: false,
    shortcutKey: 'Ctrl',
    shortcutDisplay: 'Ctrl + Enter'
  });

  // Detect platform on mount
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMac = /mac|iphone|ipad|ipod/.test(userAgent);
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    
    setPlatformInfo({
      isMac,
      isMobile,
      shortcutKey: isMac ? 'Cmd' : 'Ctrl',
      shortcutDisplay: isMac ? '⌘ + Enter' : 'Ctrl + Enter'
    });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !onSubmit) return;

    const isModifierPressed = platformInfo.isMac ? event.metaKey : event.ctrlKey;
    
    if (isModifierPressed && event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
  }, [enabled, onSubmit, platformInfo.isMac]);

  useEffect(() => {
    if (!enabled || !onSubmit) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled, onSubmit]);

  return platformInfo;
}


