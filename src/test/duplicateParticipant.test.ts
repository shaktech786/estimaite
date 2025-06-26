import { describe, it, expect, beforeEach } from 'vitest';
import {
  createRoom,
  addParticipant,
  getRoomState,
  getParticipantBySessionId,
  cleanupStaleParticipantsBySession
} from '@/lib/roomManager';
import type { Participant } from '@/types';

describe('Duplicate Participant Prevention', () => {
  let roomId: string;
  let participant: Participant;

  beforeEach(() => {
    roomId = createRoom('Test Room');
    participant = {
      id: 'participant-123',
      name: 'John Doe',
      socketId: 'socket-123',
      isReady: false,
      joinedAt: new Date(),
      sessionId: 'session-abc123',
    };
  });

  it('should not create duplicate participants for the same session', () => {
    // First join
    const success1 = addParticipant(roomId, participant);
    expect(success1).toBe(true);

    let roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(1);
    expect(roomState?.participants[0]?.id).toBe('participant-123');

    // Simulate a second join request with the same session ID (e.g., due to component remount)
    const duplicateParticipant: Participant = {
      id: 'participant-456', // Different ID but same session
      name: 'John Doe',
      socketId: 'socket-456',
      isReady: false,
      joinedAt: new Date(),
      sessionId: 'session-abc123', // Same session ID
    };

    // Check if participant exists by session ID
    const existingBySession = getParticipantBySessionId(roomId, 'session-abc123');
    expect(existingBySession).toBeTruthy();
    expect(existingBySession?.id).toBe('participant-123');

    // Clean up any stale participants with the same session
    const cleaned = cleanupStaleParticipantsBySession(roomId, 'session-abc123', 'participant-456');
    expect(cleaned).toBe(true);

    // Add the "new" participant (which should replace the old one)
    const success2 = addParticipant(roomId, duplicateParticipant);
    expect(success2).toBe(true);

    roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(1);
    expect(roomState?.participants[0]?.id).toBe('participant-456');
    expect(roomState?.participants[0]?.sessionId).toBe('session-abc123');
  });

  it('should handle rapid join requests within 1 second gracefully', () => {
    // First join
    const success1 = addParticipant(roomId, participant);
    expect(success1).toBe(true);

    let roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(1);

    // Immediate second join (simulating rapid requests)
    const rapidParticipant: Participant = {
      ...participant,
      id: 'participant-rapid-456',
    };

    // In real implementation, this would be caught by the timestamp check
    // But for testing the room manager directly, we test the cleanup logic
    const cleaned = cleanupStaleParticipantsBySession(roomId, participant.sessionId!, rapidParticipant.id);
    expect(cleaned).toBe(true);

    const success2 = addParticipant(roomId, rapidParticipant);
    expect(success2).toBe(true);

    roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(1);
    expect(roomState?.participants[0]?.id).toBe('participant-rapid-456');
  });

  it('should allow multiple participants with different session IDs', () => {
    // First participant
    const success1 = addParticipant(roomId, participant);
    expect(success1).toBe(true);

    // Second participant with different session
    const participant2: Participant = {
      id: 'participant-789',
      name: 'Jane Smith',
      socketId: 'socket-789',
      isReady: false,
      joinedAt: new Date(),
      sessionId: 'session-xyz789',
    };

    const success2 = addParticipant(roomId, participant2);
    expect(success2).toBe(true);

    const roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(2);
    expect(roomState?.participants.map(p => p.id)).toContain('participant-123');
    expect(roomState?.participants.map(p => p.id)).toContain('participant-789');
  });

  it('should handle missing session ID gracefully', () => {
    const participantNoSession: Participant = {
      id: 'participant-no-session',
      name: 'No Session User',
      socketId: 'socket-no-session',
      isReady: false,
      joinedAt: new Date(),
      // No sessionId
    };

    const success = addParticipant(roomId, participantNoSession);
    expect(success).toBe(true);

    const roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(1);
    expect(roomState?.participants[0]?.id).toBe('participant-no-session');
  });

  it('should update participant data on reconnection', () => {
    // Initial join
    const success1 = addParticipant(roomId, participant);
    expect(success1).toBe(true);

    // Reconnection with updated data
    const updatedParticipant: Participant = {
      ...participant,
      name: 'John Doe Updated',
      socketId: 'socket-new-123',
      isReady: true,
      joinedAt: new Date(),
    };

    const success2 = addParticipant(roomId, updatedParticipant);
    expect(success2).toBe(true);

    const roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(1);
    expect(roomState?.participants[0]?.name).toBe('John Doe Updated');
    expect(roomState?.participants[0]?.socketId).toBe('socket-new-123');
    expect(roomState?.participants[0]?.isReady).toBe(true);
  });
});
