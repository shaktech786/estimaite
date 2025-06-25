'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents, RoomState } from '@/types';

export function useSocket(roomId?: string, participantName?: string) {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [roomState, setRoomState] = useState<RoomState>({
    connected: false,
    loading: false,
    participants: [],
    estimates: [],
    revealed: false,
    isModerator: false,
    selectedEstimate: undefined,
    room: undefined,
  });

  useEffect(() => {
    if (!roomId || !participantName) return;

    // Initialize socket connection
    const socket = io('/', {
      path: '/api/socket',
      autoConnect: false,
    });

    socketRef.current = socket;

    // Connection handlers
    socket.on('connect', () => {
      setRoomState(prev => ({ ...prev, connected: true, loading: true }));
      socket.emit('join-room', { roomId, participantName });
    });

    socket.on('disconnect', () => {
      setRoomState(prev => ({ ...prev, connected: false }));
    });

    // Room event handlers
    socket.on('room-joined', (data) => {
      setRoomState(prev => ({
        ...prev,
        loading: false,
        room: { id: data.roomId, name: '', participantCount: 1 },
        participant: data.participant,
        currentStory: data.currentStory,
        revealed: data.revealed,
        isModerator: data.isModerator,
      }));
    });

    socket.on('participants-updated', (data) => {
      setRoomState(prev => ({
        ...prev,
        participants: data.participants,
        room: prev.room ? { ...prev.room, participantCount: data.participants.length } : undefined,
        isModerator: data.moderatorId === prev.participant?.id,
      }));
    });

    socket.on('story-updated', (data) => {
      setRoomState(prev => ({
        ...prev,
        currentStory: data.story,
        estimates: [],
        revealed: data.revealed,
        selectedEstimate: 0, // Set to default estimate
      }));
    });

    socket.on('estimate-submitted', () => {
      // Update UI to show estimation progress
    });

    socket.on('estimates-revealed', (data) => {
      setRoomState(prev => ({
        ...prev,
        estimates: data.estimates,
        revealed: true,
      }));
    });

    socket.on('estimates-reset', () => {
      setRoomState(prev => ({
        ...prev,
        estimates: [],
        revealed: false,
        selectedEstimate: 0, // Reset to default estimate
      }));
    });

    socket.on('error', (data) => {
      setRoomState(prev => ({
        ...prev,
        error: data.message,
        loading: false,
      }));
    });

    // Connect to socket
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [roomId, participantName]);

  // Socket actions
  const submitStory = (story: { title: string; description: string; acceptanceCriteria?: string[] }) => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit('submit-story', { roomId, story });
  };

  const submitEstimate = (estimate: number) => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit('submit-estimate', { roomId, estimate });
    setRoomState(prev => ({ ...prev, selectedEstimate: estimate }));
  };

  const revealEstimates = () => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit('reveal-estimates', { roomId });
  };

  const resetEstimates = () => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit('reset-estimates', { roomId });
  };

  return {
    roomState,
    actions: {
      submitStory,
      submitEstimate,
      revealEstimates,
      resetEstimates,
    },
  };
}
