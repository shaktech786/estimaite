import React from 'react';
import { VotingTimer as ShakUIVotingTimer } from '@shakgpt/ui';

interface VotingTimerProps {
  initialTime: number; // in seconds
  active: boolean;
  onTimeUp: () => void;
  onToggle?: (paused: boolean) => void;
  showControls?: boolean;
  className?: string;
}

export function VotingTimer(props: VotingTimerProps) {
  return <ShakUIVotingTimer {...props} />;
}
