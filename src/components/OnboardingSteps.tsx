import React from 'react';
import type { RoomState } from '@/types';

interface OnboardingStepsProps {
  currentStep: 'waiting' | 'story' | 'voting' | 'results';
  participantCount: number;
  roomState: RoomState;
}

export function OnboardingSteps({ currentStep, participantCount, roomState }: OnboardingStepsProps) {
  const steps = [
    { id: 'waiting', label: 'Waiting for participants', completed: participantCount > 0 },
    { id: 'story', label: 'Submit story', completed: !!roomState.currentStory },
    { id: 'voting', label: 'Vote on estimates', completed: roomState.revealed },
    { id: 'results', label: 'View results', completed: roomState.revealed },
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <h2 className="text-sm font-medium text-gray-300 mb-3">Session Progress</h2>
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                step.completed
                  ? 'bg-green-600 text-white'
                  : currentStep === step.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm ${
                step.completed
                  ? 'text-green-400'
                  : currentStep === step.id
                  ? 'text-blue-400'
                  : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className="ml-4 w-6 h-px bg-gray-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
