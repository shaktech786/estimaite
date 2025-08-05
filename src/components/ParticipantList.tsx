'use client';
import React from 'react';
import { RoomCodeCopy } from '@/components/RoomCodeCopy';
import type { Participant } from '@/types';

interface ParticipantListProps {
  participants: Participant[];
  moderatorId?: string;
  currentUserId?: string;
  revealed?: boolean;
  roomId?: string;
  className?: string;
}

export function ParticipantList({
  participants,
  roomId,
  className = ''
}: ParticipantListProps) {
  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Room Info */}
      {roomId && (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <RoomCodeCopy
            roomCode={roomId}
            showLabel={true}
            size="sm"
            className="justify-center"
          />
        </div>
      )}

      {/* Participants List */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5">
        <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full flex-shrink-0"></div>
          Participants ({participants.length})
        </h3>

        <div className="space-y-2 sm:space-y-3">
          {participants.map(participant => (
            <div key={participant.id} className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gray-950/50 border border-gray-800/30">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold text-black flex-shrink-0">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-300 font-medium flex-1 text-sm sm:text-base truncate">{participant.name}</span>
              {participant.estimate !== undefined && (
                <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-cyan-500/20 text-cyan-400 rounded-md sm:rounded-lg text-xs font-medium border border-cyan-500/30 flex-shrink-0">
                  Ready
                </div>
              )}
            </div>
          ))}
        </div>

        {participants.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <div className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <p className="text-gray-400 font-medium text-sm sm:text-base">No participants yet</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Share the room code to invite others</p>
          </div>
        )}
      </div>
    </div>
  );
}
