import { describe, it, expect, beforeEach } from 'vitest';
import { 
  createRoom, 
  addParticipant, 
  getRoomState,
  getParticipantBySessionId,
  cleanupStaleParticipantsBySession,
} from '@/lib/roomManager';
import type { Participant } from '@/types';

describe('Incognito Override Prevention', () => {
  let roomId: string;

  beforeEach(() => {
    roomId = createRoom('Test Room');
  });

  it('should not override room creator when incognito user joins with same name', () => {
    // Simulate room creator (normal browser session)
    const roomCreator: Participant = {
      id: 'creator-123',
      name: 'John Doe',
      socketId: 'socket-creator',
      isReady: false,
      joinedAt: new Date(),
      sessionId: 'session-normal-browser',
    };

    // Add room creator
    const creatorSuccess = addParticipant(roomId, roomCreator);
    expect(creatorSuccess).toBe(true);

    let roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(1);
    expect(roomState?.participants[0]?.name).toBe('John Doe');
    expect(roomState?.participants[0]?.id).toBe('creator-123');
    expect(roomState?.participants[0]?.sessionId).toBe('session-normal-browser');

    // Simulate incognito user joining with same name but different sessionId
    const incognitoUser: Participant = {
      id: 'incognito-456',
      name: 'John Doe', // Same name as creator
      socketId: 'socket-incognito',
      isReady: false,
      joinedAt: new Date(),
      sessionId: 'session-incognito-browser', // Different sessionId
    };

    // Add incognito user
    const incognitoSuccess = addParticipant(roomId, incognitoUser);
    expect(incognitoSuccess).toBe(true);

    roomState = getRoomState(roomId);
    
    // Should have 2 participants, not override the first one
    expect(roomState?.participants).toHaveLength(2);
    
    // Both participants should exist with their original IDs
    const participantIds = roomState?.participants.map(p => p.id) || [];
    expect(participantIds).toContain('creator-123');
    expect(participantIds).toContain('incognito-456');
    
    // Both should have same name but different sessions
    const creators = roomState?.participants.filter(p => p.sessionId === 'session-normal-browser') || [];
    const incognitos = roomState?.participants.filter(p => p.sessionId === 'session-incognito-browser') || [];
    
    expect(creators).toHaveLength(1);
    expect(incognitos).toHaveLength(1);
    expect(creators[0]?.id).toBe('creator-123');
    expect(incognitos[0]?.id).toBe('incognito-456');
  });

  it('should properly identify participants by sessionId', () => {
    // Add a participant
    const participant: Participant = {
      id: 'test-123',
      name: 'Test User',
      socketId: 'socket-123',
      isReady: false,
      joinedAt: new Date(),
      sessionId: 'session-abc',
    };

    addParticipant(roomId, participant);

    // Should find participant by sessionId
    const found = getParticipantBySessionId(roomId, 'session-abc');
    expect(found).toBeTruthy();
    expect(found?.id).toBe('test-123');

    // Should not find with different sessionId
    const notFound = getParticipantBySessionId(roomId, 'session-different');
    expect(notFound).toBeNull();
  });

  it('should handle participants with no sessionId gracefully', () => {
    // Add participant without sessionId (legacy case)
    const participant: Participant = {
      id: 'legacy-123',
      name: 'Legacy User',
      socketId: 'socket-legacy',
      isReady: false,
      joinedAt: new Date(),
      // No sessionId
    };

    const success = addParticipant(roomId, participant);
    expect(success).toBe(true);

    const roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(1);
    expect(roomState?.participants[0]?.id).toBe('legacy-123');

    // Should not find by any sessionId since participant has none
    const found = getParticipantBySessionId(roomId, 'any-session');
    expect(found).toBeNull();
  });

  it('should simulate exact API join flow for incognito override scenario', () => {
    // Step 1: Room creator joins (normal browser)
    const creatorSessionId = 'session-normal-browser-abc123';
    
    // Check if participant with creator sessionId already exists (should be null initially)
    let participant = getParticipantBySessionId(roomId, creatorSessionId);
    expect(participant).toBeNull();
    
    // Create new participant for creator
    participant = {
      id: `participant-${Date.now()}-creator`,
      name: 'John Doe',
      socketId: '',
      isReady: false,
      joinedAt: new Date(),
      sessionId: creatorSessionId,
    };
    
    // Clean up any stale participants (should be none)
    const cleaned1 = cleanupStaleParticipantsBySession(roomId, creatorSessionId, participant.id);
    expect(cleaned1).toBe(false); // No stale participants to clean
    
    // Add creator to room
    const success1 = addParticipant(roomId, participant);
    expect(success1).toBe(true);
    
    let roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(1);
    expect(roomState?.participants[0]?.name).toBe('John Doe');
    expect(roomState?.participants[0]?.sessionId).toBe(creatorSessionId);
    const creatorId = roomState?.participants[0]?.id;
    
    // Step 2: Incognito user joins with same name
    const incognitoSessionId = 'session-incognito-browser-xyz789';
    
    // Check if participant with incognito sessionId already exists (should be null)
    let incognitoParticipant = getParticipantBySessionId(roomId, incognitoSessionId);
    expect(incognitoParticipant).toBeNull();
    
    // Create new participant for incognito user
    incognitoParticipant = {
      id: `participant-${Date.now()}-incognito`,
      name: 'John Doe', // Same name as creator
      socketId: '',
      isReady: false,
      joinedAt: new Date(),
      sessionId: incognitoSessionId,
    };
    
    // Clean up any stale participants with incognito sessionId (should be none)
    const cleaned2 = cleanupStaleParticipantsBySession(roomId, incognitoSessionId, incognitoParticipant.id);
    expect(cleaned2).toBe(false); // No stale participants to clean
    
    // Add incognito user to room
    const success2 = addParticipant(roomId, incognitoParticipant);
    expect(success2).toBe(true);
    
    // Verify final state
    roomState = getRoomState(roomId);
    expect(roomState?.participants).toHaveLength(2);
    
    // Verify both participants exist with correct IDs
    const participantIds = roomState?.participants.map(p => p.id) || [];
    expect(participantIds).toContain(creatorId);
    expect(participantIds).toContain(incognitoParticipant.id);
    
    // Verify both participants have correct sessionIds
    const creatorInRoom = roomState?.participants.find(p => p.sessionId === creatorSessionId);
    const incognitoInRoom = roomState?.participants.find(p => p.sessionId === incognitoSessionId);
    
    expect(creatorInRoom).toBeTruthy();
    expect(incognitoInRoom).toBeTruthy();
    expect(creatorInRoom?.id).toBe(creatorId);
    expect(incognitoInRoom?.id).toBe(incognitoParticipant.id);
  });
});
