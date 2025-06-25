import React from 'react';
import { cn } from '@/lib/utils';
import { User, Crown, CheckCircle, Clock } from 'lucide-react';
import type { Participant } from '@/types';

interface ParticipantListProps {
  participants: Participant[];
  moderatorId?: string;
  currentUserId?: string;
  revealed?: boolean;
}

export function ParticipantList({
  participants,
  moderatorId,
  currentUserId,
  revealed = false
}: ParticipantListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <User className="h-4 w-4" />
        Participants ({participants.length})
      </h3>

      <div className="space-y-2">
        {participants.map((participant) => {
          const isModerator = participant.id === moderatorId;
          const isCurrentUser = participant.id === currentUserId;
          const hasEstimate = participant.estimate !== undefined;

          return (
            <div
              key={participant.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border transition-colors',
                isCurrentUser
                  ? 'bg-blue-900/20 border-blue-800'
                  : 'bg-gray-800 border-gray-700',
                'hover:bg-opacity-80'
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  isCurrentUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-200'
                )}>
                  {participant.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'font-medium text-sm',
                      isCurrentUser ? 'text-white' : 'text-gray-300'
                    )}>
                      {participant.name}
                    </span>

                    {isModerator && (
                      <div title="Moderator">
                        <Crown className="h-3 w-3 text-yellow-400" />
                      </div>
                    )}

                    {isCurrentUser && (
                      <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>

                  {revealed && hasEstimate && (
                    <span className="text-xs text-gray-400">
                      Estimate: {participant.estimate}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {!revealed && (
                  <div className={cn(
                    'flex items-center gap-1 text-xs',
                    hasEstimate ? 'text-green-400' : 'text-gray-500'
                  )}>
                    {hasEstimate ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        <span className="sr-only sm:not-sr-only">Ready</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        <span className="sr-only sm:not-sr-only">Thinking</span>
                      </>
                    )}
                  </div>
                )}

                {revealed && hasEstimate && (
                  <div className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs font-medium">
                    {participant.estimate}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {participants.length === 0 && (
        <div className="text-center py-6 text-gray-400">
          <User className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No participants yet</p>
        </div>
      )}
    </div>
  );
}
