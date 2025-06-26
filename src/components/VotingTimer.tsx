import React, { useState, useEffect } from 'react';
import { Timer, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    setTimeLeft(initialTime);
    setIsPaused(!active);
  }, [initialTime, active]);

  useEffect(() => {
    if (!active || isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [active, isPaused, timeLeft, onTimeUp]);

  const handleToggle = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    onToggle?.(newPaused);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 60) return 'text-green-400';
    if (timeLeft > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressWidth = () => {
    return Math.max(0, (timeLeft / initialTime) * 100);
  };

  if (!active && timeLeft === initialTime) return null;

  return (
    <div className={cn('flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg', className)}>
      <div className="flex items-center gap-2 flex-1">
        <Timer className={cn('h-4 w-4', getTimerColor())} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-300">Voting Timer</span>
            <span className={cn('text-sm font-mono font-bold', getTimerColor())}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className={cn(
                'h-1.5 rounded-full transition-all duration-1000 ease-linear',
                timeLeft > 60 ? 'bg-green-400' : timeLeft > 30 ? 'bg-yellow-400' : 'bg-red-400'
              )}
              style={{ width: `${getProgressWidth()}%` }}
            />
          </div>
        </div>
      </div>

      {showControls && (
        <button
          onClick={handleToggle}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          title={isPaused ? 'Resume timer' : 'Pause timer'}
        >
          {isPaused ? (
            <Play className="h-4 w-4 text-gray-300" />
          ) : (
            <Pause className="h-4 w-4 text-gray-300" />
          )}
        </button>
      )}
    </div>
  );
}
