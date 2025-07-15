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
    <div className={`space-y-6 ${className}`}>
      {/* Room Info */}
      {roomId && (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-5">
          <RoomCodeCopy
            roomCode={roomId}
            showLabel={true}
            size="sm"
            className="justify-center"
          />
        </div>
      )}

      {/* Participants List */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-5">
        <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          Participants ({participants.length})
        </h3>

        <div className="space-y-3">
          {participants.map(participant => (
            <div key={participant.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-950/50 border border-gray-800/30">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-sm font-bold text-black">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-300 font-medium flex-1">{participant.name}</span>
              {participant.estimate !== undefined && (
                <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium border border-cyan-500/30">
                  Ready
                </div>
              )}
            </div>
          ))}
        </div>

        {participants.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="h-8 w-8 text-gray-500">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <p className="text-gray-400 font-medium">No participants yet</p>
            <p className="text-gray-500 text-sm mt-1">Share the room code to invite others</p>
          </div>
        )}
      </div>
    </div>
  );
}
