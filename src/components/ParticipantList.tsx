'use client';
import React from 'react';
import { ParticipantList as ShakUIParticipantList, type Participant as ShakUIParticipant } from 'shakui';
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
  // Convert EstimAIte participants to ShakUI format
  const shakUIParticipants: ShakUIParticipant[] = participants.map(participant => ({
    id: participant.id,
    name: participant.name,
    estimate: participant.estimate ?? '', // Convert undefined to empty string
    hasEstimated: participant.estimate !== undefined,
    isOnline: true, // EstimAIte participants are always connected when in the list
    joinedAt: new Date() // We don't track this in EstimAIte, so use current time
  }));

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

      <ShakUIParticipantList
        participants={shakUIParticipants}
        {...(moderatorId && { moderatorId })}
        {...(currentUserId && { currentUserId })}
        revealed={revealed}
        showEstimates={true}
        variant="default"
      />

      {participants.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="h-6 w-6 text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <p className="text-gray-400 text-sm">No participants in this room yet</p>
          <p className="text-gray-500 text-xs mt-1">Share the room code to invite others</p>
        </div>
      )}
    </div>
  );
}
