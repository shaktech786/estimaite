'use client';
import { RoomCodeCopy as ShakUIRoomCodeCopy } from '@shakgpt/ui';

interface RoomCodeCopyProps {
  roomCode: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RoomCodeCopy(props: RoomCodeCopyProps) {
  return <ShakUIRoomCodeCopy {...props} variant="card" />;
}
