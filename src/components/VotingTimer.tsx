'use client';
import React from 'react';
import { VotingTimer as ShakUIVotingTimer } from 'shakui';

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
