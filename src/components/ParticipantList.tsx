import React from 'react';
import { cn } from '@/lib/utils';
import { User, Crown, CheckCircle, Clock } from 'lucide-react';
import { RoomCodeCopy } from '@/components/RoomCodeCopy';
import type { Participant } from '@/types';

interface ParticipantListProps {
  participants: Participant[];
  moderatorId?: string;
  currentUserId?: string;
  revealed?: boolean;
  roomId?: string;
}

export function ParticipantList({
  participants,
  moderatorId,
  currentUserId,
  revealed = false,
  roomId
}: ParticipantListProps) {
  return (
    <div className="space-y-4">
      {/* Room Info */}
      {roomId && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
          <RoomCodeCopy
            roomCode={roomId}
            showLabel={true}
            size="sm"
            className="justify-center"
          />
        </div>
      )}

      <h3 className="text-base lg:text-lg font-semibold text-white flex items-center gap-2">
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Participants ({participants.length})</span>
        <span className="sm:hidden">({participants.length})</span>
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
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0',
                  isCurrentUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-200'
                )}>
                  {participant.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'font-medium text-sm truncate',
                      isCurrentUser ? 'text-white' : 'text-gray-300'
                    )}>
                      {participant.name}
                    </span>

                    {isModerator && (
                      <div title="Moderator" className="flex-shrink-0">
                        <Crown className="h-3 w-3 text-yellow-400" />
                      </div>
                    )}

                    {isCurrentUser && (
                      <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded-full flex-shrink-0">
                        You
                      </span>
                    )}
                  </div>

                  {revealed && hasEstimate && (
                    <span className="text-xs text-gray-400 truncate">
                      Estimate: {participant.estimate}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
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
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-400 text-sm">No participants in this room yet</p>
          <p className="text-gray-500 text-xs mt-1">Share the room code to invite others</p>
        </div>
      )}
    </div>
  );
}
