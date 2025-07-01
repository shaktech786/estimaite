'use client';

import { useEffect, useRef, useState } from 'react';
import { pusherClient, getChannelName, PUSHER_EVENTS } from '@/lib/pusher';
import type { RoomState, Participant, Story } from '@/types';

export function usePusher(roomId?: string, participantName?: string) {
  const participantRef = useRef<Participant | null>(null);
  const hasJoinedRef = useRef(false);
  const joinInProgressRef = useRef(false); // Add join request lock
  const [roomState, setRoomState] = useState<RoomState>({
    connected: false,
    loading: false,
    participants: [],
    estimates: [],
    revealed: false,
    isModerator: false,
  });

  useEffect(() => {
    if (!roomId || !participantName) return;

    let channel: ReturnType<typeof pusherClient.subscribe> | null = null;

    const initializeConnection = async () => {
      try {
        // Prevent multiple simultaneous connections
        if (hasJoinedRef.current || joinInProgressRef.current) return;

        joinInProgressRef.current = true; // Lock to prevent concurrent requests
        hasJoinedRef.current = true;

        setRoomState(prev => ({ ...prev, loading: true }));

        // Get or create session ID for this browser session
        const sessionKey = `estimaite-session-${roomId}`;
        let sessionId = sessionStorage.getItem(sessionKey);
        if (!sessionId) {
          sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem(sessionKey, sessionId);
        }

        // Join the room
        const response = await fetch('/api/pusher/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'join',
            roomId,
            participantName,
            sessionId, // Include session ID
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to join room');
        }

        const { participant, roomState: initialState, isModerator } = await response.json();
        participantRef.current = participant;

        // Update state with initial room data
        setRoomState(prev => ({
          ...prev,
          ...initialState,
          participant,
          isModerator,
          connected: true,
          loading: false,
        }));

        // Subscribe to Pusher channel
        const channelName = getChannelName(roomId);
        channel = pusherClient.subscribe(channelName);

        // Bind event listeners
        channel.bind(PUSHER_EVENTS.PARTICIPANT_JOINED, (data: { roomState: RoomState }) => {
          setRoomState(prev => ({
            ...prev,
            ...data.roomState,
          }));
        });

        channel.bind(PUSHER_EVENTS.PARTICIPANT_LEFT, (data: { roomState: RoomState }) => {
          setRoomState(prev => ({
            ...prev,
            ...data.roomState,
          }));
        });

        channel.bind(PUSHER_EVENTS.STORY_SUBMITTED, (data: { roomState: RoomState }) => {
          setRoomState(prev => ({
            ...prev,
            ...data.roomState,
          }));
        });

        channel.bind(PUSHER_EVENTS.ESTIMATE_SUBMITTED, (data: { roomState: RoomState }) => {
          setRoomState(prev => ({
            ...prev,
            ...data.roomState,
          }));
        });

        channel.bind(PUSHER_EVENTS.ESTIMATES_REVEALED, (data: { roomState: RoomState }) => {
          setRoomState(prev => ({
            ...prev,
            ...data.roomState,
          }));
        });

        channel.bind(PUSHER_EVENTS.ESTIMATES_RESET, (data: { roomState: RoomState }) => {
          setRoomState(prev => ({
            ...prev,
            ...data.roomState,
          }));
        });

      } catch (error) {
        console.error('Failed to initialize connection:', error);
        hasJoinedRef.current = false; // Reset on error
        joinInProgressRef.current = false; // Reset lock on error
        setRoomState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Connection failed',
        }));
      } finally {
        joinInProgressRef.current = false; // Always reset lock
      }
    };

    initializeConnection();

    return () => {
      // Cleanup: leave room and unsubscribe
      hasJoinedRef.current = false;
      joinInProgressRef.current = false; // Reset lock on cleanup
      if (participantRef.current) {
        fetch('/api/pusher/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'leave',
            roomId,
            participantId: participantRef.current.id,
          }),
        }).catch(console.error);
      }

      if (channel) {
        channel.unbind_all();
        pusherClient.unsubscribe(getChannelName(roomId));
      }
    };
  }, [roomId, participantName]);

  const actions = {
    submitStory: async (story: Omit<Story, 'aiAnalysis'>) => {
      if (!participantRef.current) return;

      try {
        const response = await fetch('/api/pusher/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit-story',
            roomId,
            story,
            participantId: participantRef.current.id,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit story');
        }
      } catch (error) {
        console.error('Failed to submit story:', error);
      }
    },

    submitEstimate: async (estimate: number) => {
      if (!participantRef.current) return;

      try {
        setRoomState(prev => ({
          ...prev,
          selectedEstimate: estimate === -1 ? -1 : estimate,
        }));

        const response = await fetch('/api/pusher/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit-estimate',
            roomId,
            estimate,
            participantId: participantRef.current.id,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit estimate');
        }
      } catch (error) {
        console.error('Failed to submit estimate:', error);
      }
    },

    revealEstimates: async () => {
      if (!participantRef.current) return;

      try {
        const response = await fetch('/api/pusher/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'reveal-estimates',
            roomId,
            participantId: participantRef.current.id,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to reveal estimates');
        }
      } catch (error) {
        console.error('Failed to reveal estimates:', error);
      }
    },

    resetEstimates: async () => {
      if (!participantRef.current) return;

      try {
        setRoomState(prev => ({
          ...prev,
          selectedEstimate: -1,
        }));

        const response = await fetch('/api/pusher/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'reset-estimates',
            roomId,
            participantId: participantRef.current.id,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to reset estimates');
        }
      } catch (error) {
        console.error('Failed to reset estimates:', error);
      }
    },

    clearStoryAndReset: async () => {
      if (!participantRef.current) return;

      try {
        setRoomState(prev => ({
          ...prev,
          selectedEstimate: -1,
        }));

        const response = await fetch('/api/pusher/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'clear-story-and-reset',
            roomId,
            participantId: participantRef.current.id,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to clear story and reset');
        }
      } catch (error) {
        console.error('Failed to clear story and reset:', error);
      }
    },
  };

  return { roomState, actions };
}
