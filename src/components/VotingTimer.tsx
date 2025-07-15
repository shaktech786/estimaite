'use client';
import React, { useState, useEffect } from 'react';

interface VotingTimerProps {
  initialTime: number; // in seconds
  active: boolean;
  onTimeUp: () => void;
  onToggle?: (paused: boolean) => void;
  showControls?: boolean;
  className?: string;
}

export function VotingTimer({
  initialTime,
  active,
  onTimeUp,
  onToggle,
  showControls = false,
  className = ''
}: VotingTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(!active);

  useEffect(() => {
    if (!active || isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, isPaused, timeLeft, onTimeUp]);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    setIsPaused(!active);
  }, [active]);

  const togglePause = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    onToggle?.(newPaused);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((initialTime - timeLeft) / initialTime) * 100;
  const isUrgent = timeLeft <= 30; // Last 30 seconds
  const isAlmostDone = timeLeft <= 10; // Last 10 seconds

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className={`text-sm font-mono font-bold transition-colors ${
          isAlmostDone ? 'text-red-400' : isUrgent ? 'text-amber-400' : 'text-gray-300'
        }`}>
          {formatTime(timeLeft)}
        </div>

        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out ${
              isAlmostDone ? 'bg-red-500' : isUrgent ? 'bg-amber-500' : 'bg-cyan-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {showControls && (
        <button
          onClick={togglePause}
          className="text-xs px-3 py-1.5 bg-gray-700 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-600 hover:border-gray-500 transition-colors disabled:opacity-50"
          disabled={timeLeft <= 0}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      )}
    </div>
  );
}
