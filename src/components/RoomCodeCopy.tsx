'use client';
import { Copy } from 'lucide-react';

interface RoomCodeCopyProps {
  roomCode: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RoomCodeCopy({ roomCode, showLabel = true, className = '' }: RoomCodeCopyProps) {
  const copyToClipboard = async () => {
    try {
      const roomLink = `${window.location.origin}/room/${roomCode}`;
      await navigator.clipboard.writeText(roomLink);
      // TODO: Add toast notification
      console.log('Room link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy room link:', err);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-center">
        {showLabel && (
          <span className="block text-xs text-gray-500 font-medium mb-2">Room Code</span>
        )}
        <code className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg font-mono text-lg text-cyan-400 font-bold tracking-wider">
          {roomCode}
        </code>
      </div>
      <button
        onClick={copyToClipboard}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600/10 text-cyan-400 border border-cyan-600/30 rounded-lg hover:bg-cyan-600/20 transition-all duration-200 text-sm font-medium"
        title="Copy room link to share with others"
      >
        <Copy className="h-4 w-4 flex-shrink-0" />
        <span>Copy Room Link</span>
      </button>
    </div>
  );
}
