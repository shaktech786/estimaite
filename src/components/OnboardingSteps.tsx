import React from 'react';
import { Users, FileText, Timer, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStepsProps {
  currentStep: 'waiting' | 'story' | 'voting' | 'results';
  participantCount: number;
  isModerator: boolean;
  className?: string;
}

export function OnboardingSteps({
  currentStep,
  participantCount,
  isModerator,
  className = ''
}: OnboardingStepsProps) {
  const steps = [
    {
      id: 'waiting',
      title: 'Invite Team',
      description: 'Share the room code with your team members',
      icon: Users,
      active: currentStep === 'waiting',
      completed: participantCount > 1 || currentStep !== 'waiting'
    },
    {
      id: 'story',
      title: 'Add Story',
      description: 'Submit a user story to estimate',
      icon: FileText,
      active: currentStep === 'story',
      completed: currentStep === 'voting' || currentStep === 'results'
    },
    {
      id: 'voting',
      title: 'Vote',
      description: 'Everyone selects their estimate',
      icon: Timer,
      active: currentStep === 'voting',
      completed: currentStep === 'results'
    },
    {
      id: 'results',
      title: 'Results',
      description: 'View and discuss the estimates',
      icon: Eye,
      active: currentStep === 'results',
      completed: false
    }
  ];

  return (
    <div className={cn('bg-blue-900/20 border border-blue-800 rounded-lg p-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
          <FileText className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="font-medium text-blue-100">
          {isModerator ? 'Planning Poker Guide' : 'Session Progress'}
        </h3>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-3">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
              step.completed
                ? 'bg-green-600 text-white'
                : step.active
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400'
            )}>
              {step.completed ? (
                '✓'
              ) : (
                <step.icon className="h-3 w-3" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                'text-sm font-medium',
                step.completed
                  ? 'text-green-200'
                  : step.active
                  ? 'text-blue-200'
                  : 'text-gray-400'
              )}>
                {step.title}
                {step.id === 'waiting' && ` (${participantCount} ${participantCount === 1 ? 'person' : 'people'})`}
              </h4>
              <p className={cn(
                'text-xs mt-0.5',
                step.completed
                  ? 'text-green-300'
                  : step.active
                  ? 'text-blue-300'
                  : 'text-gray-500'
              )}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModerator && currentStep === 'waiting' && participantCount === 1 && (
        <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg">
          <p className="text-amber-200 text-xs">
            💡 <strong>Tip:</strong> Planning poker works best with 3-8 team members. Share your room code to get started!
          </p>
        </div>
      )}
    </div>
  );
}
