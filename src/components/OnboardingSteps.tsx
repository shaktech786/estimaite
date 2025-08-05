import React from 'react';
import type { RoomState } from '@/types';

interface OnboardingStepsProps {
  currentStep: 'waiting' | 'story' | 'voting' | 'results';
  participantCount: number;
  roomState: RoomState;
}

export function OnboardingSteps({ currentStep, participantCount, roomState }: OnboardingStepsProps) {
  const steps = [
    { id: 'waiting', label: 'Waiting for participants', shortLabel: 'Wait', completed: participantCount > 0 },
    { id: 'story', label: 'Submit story', shortLabel: 'Story', completed: !!roomState.currentStory },
    { id: 'voting', label: 'Vote on estimates', shortLabel: 'Vote', completed: roomState.revealed },
    { id: 'results', label: 'View results', shortLabel: 'Results', completed: roomState.revealed },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-3 sm:p-4">
      <h2 className="text-xs sm:text-sm font-medium text-gray-300 mb-3 sm:mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
        Session Progress
      </h2>
      
      {/* Mobile: Vertical layout */}
      <div className="sm:hidden space-y-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors flex-shrink-0 ${
                step.completed
                  ? 'bg-green-500 text-gray-900'
                  : currentStep === step.id
                  ? 'bg-cyan-500 text-gray-900'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {step.completed ? '✓' : index + 1}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                step.completed
                  ? 'text-green-400'
                  : currentStep === step.id
                  ? 'text-cyan-400'
                  : 'text-gray-500'
              }`}
            >
              {step.shortLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:flex items-center gap-2 md:gap-4 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-xs font-bold transition-colors flex-shrink-0 ${
                  step.completed
                    ? 'bg-green-500 text-gray-900'
                    : currentStep === step.id
                    ? 'bg-cyan-500 text-gray-900'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {step.completed ? '✓' : index + 1}
              </div>
              <span
                className={`text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  step.completed
                    ? 'text-green-400'
                    : currentStep === step.id
                    ? 'text-cyan-400'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-4 md:w-8 h-px bg-gray-600 flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
