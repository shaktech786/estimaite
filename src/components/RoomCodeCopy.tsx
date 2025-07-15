'use client';
// Removed ShakUI import

interface RoomCodeCopyProps {
  roomCode: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RoomCodeCopy({ roomCode, showLabel = true, className = '' }: RoomCodeCopyProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      // TODO: Add toast notification
      console.log('Room code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {showLabel && (
        <span className="text-sm text-gray-400 font-medium">Room Code:</span>
      )}
      <code className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg font-mono text-lg text-cyan-400 font-bold tracking-wider">
        {roomCode}
      </code>
      <button
        onClick={copyToClipboard}
        className="px-3 py-2 text-sm text-gray-400 hover:text-cyan-400 hover:bg-gray-800 rounded-lg transition-colors"
        title="Copy to clipboard"
      >
        Copy
      </button>
    </div>
  );
}
