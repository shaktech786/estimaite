import type { Participant, Story, RoomState, EstimationResult } from '@/types';

// In-memory room storage (temporary for serverless - rooms will reset on function restart)
const rooms = new Map<string, {
  id: string;
  name: string;
  participants: Map<string, Participant>;
  currentStory: Story | undefined;
  estimates: Map<string, number>;
  revealed: boolean;
  moderatorId: string;
  createdAt: Date;
  lastActivity: Date;
  votingTimer?: {
    startTime: Date;
    duration: number; // in seconds
    active: boolean;
  };
}>();

// Clean expired rooms on each operation (serverless-friendly)
function cleanupExpiredRooms() {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  for (const [roomId, room] of rooms.entries()) {
    if (room.lastActivity < thirtyMinutesAgo) {
      console.log(`Cleaning up expired room: ${roomId}`);
      rooms.delete(roomId);
    }
  }
}

export function generateRoomId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createRoom(name: string): string {
  const roomId = generateRoomId();
  console.log(`Creating room with ID: ${roomId}, name: ${name}`);
  rooms.set(roomId, {
    id: roomId,
    name,
    participants: new Map(),
    currentStory: undefined,
    estimates: new Map(),
    revealed: false,
    moderatorId: '',
    createdAt: new Date(),
    lastActivity: new Date(),
  });
  console.log(`Room created. Total rooms: ${rooms.size}`);
  return roomId;
}

export function getRoomState(roomId: string): RoomState | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  // Sync participants with their estimates
  const participants = Array.from(room.participants.values()).map(participant => {
    const estimate = room.estimates.get(participant.id);
    return {
      ...participant,
      ...(estimate !== undefined && { estimate })
    };
  });

  const estimates: EstimationResult[] = Array.from(room.estimates.entries()).map(([participantId, estimate]) => {
    const participant = room.participants.get(participantId);
    return {
      participantId,
      participantName: participant?.name || 'Unknown',
      estimate,
    };
  });

  const result: RoomState = {
    connected: true,
    loading: false,
    room: {
      id: room.id,
      name: room.name,
      participantCount: participants.length,
    },
    participants,
    estimates,
    revealed: room.revealed,
    isModerator: false, // This will be set by the client
  };

  // Only add optional properties if they exist
  if (room.currentStory) {
    result.currentStory = room.currentStory;
  }

  // Add timer info if active
  if (room.votingTimer && room.votingTimer.active) {
    const elapsed = Math.floor((new Date().getTime() - room.votingTimer.startTime.getTime()) / 1000);
    const remainingTime = Math.max(0, room.votingTimer.duration - elapsed);
    result.votingTimer = {
      remainingTime,
      active: remainingTime > 0,
    };
  }

  return result;
}

export function addParticipant(roomId: string, participant: Participant): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  // Check if participant already exists (for reconnections)
  const existingParticipant = room.participants.get(participant.id);

  if (existingParticipant) {
    // Update existing participant (reconnection scenario)
    room.participants.set(participant.id, { ...existingParticipant, ...participant });
  } else {
    // Set first participant as moderator
    if (room.participants.size === 0) {
      room.moderatorId = participant.id;
    }

    // Add new participant
    room.participants.set(participant.id, participant);
  }

  room.lastActivity = new Date();
  return true;
}

export function removeParticipant(roomId: string, participantId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  room.participants.delete(participantId);
  room.estimates.delete(participantId);

  // If moderator left, assign new moderator
  if (room.moderatorId === participantId && room.participants.size > 0) {
    const firstParticipant = Array.from(room.participants.values())[0];
    if (firstParticipant) {
      room.moderatorId = firstParticipant.id;
    }
  }

  room.lastActivity = new Date();
  return true;
}

export function submitStory(roomId: string, story: Story): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  room.currentStory = story;
  room.estimates.clear();
  room.revealed = false;

  // Start voting timer (5 minutes default)
  room.votingTimer = {
    startTime: new Date(),
    duration: 300, // 5 minutes
    active: true,
  };

  room.lastActivity = new Date();
  return true;
}

export function submitEstimate(roomId: string, participantId: string, estimate: number): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  room.estimates.set(participantId, estimate);
  room.lastActivity = new Date();
  return true;
}

export function revealEstimates(roomId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  room.revealed = true;

  // Stop the voting timer when estimates are revealed
  if (room.votingTimer) {
    room.votingTimer.active = false;
  }

  room.lastActivity = new Date();
  return true;
}

export function resetEstimates(roomId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  room.estimates.clear();
  room.revealed = false;

  // Restart voting timer for new round
  if (room.currentStory) {
    room.votingTimer = {
      startTime: new Date(),
      duration: 300, // 5 minutes
      active: true,
    };
  }

  room.lastActivity = new Date();
  return true;
}

export function roomExists(roomId: string): boolean {
  cleanupExpiredRooms(); // Clean up expired rooms before checking
  const exists = rooms.has(roomId);
  console.log(`Room exists check: ${roomId} -> ${exists}`);
  console.log(`Current rooms: ${Array.from(rooms.keys()).join(', ')}`);
  return exists;
}

// Create a room on-demand if it doesn't exist (for recovery from cold starts)
export function createOrRecoverRoom(roomId: string, roomName?: string): boolean {
  if (rooms.has(roomId)) {
    return false; // Room already exists
  }

  // Validate room ID format (8 alphanumeric characters)
  if (!/^[A-Z0-9]{8}$/.test(roomId)) {
    return false; // Invalid room ID format
  }

  console.log(`Recovering room: ${roomId}`);
  rooms.set(roomId, {
    id: roomId,
    name: roomName || 'Recovered Room',
    participants: new Map(),
    currentStory: undefined,
    estimates: new Map(),
    revealed: false,
    moderatorId: '',
    createdAt: new Date(),
    lastActivity: new Date(),
  });

  return true; // Room was recovered
}

export function getRoomData(roomId: string) {
  return rooms.get(roomId);
}

export function startVotingTimer(roomId: string, duration: number = 300): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  room.votingTimer = {
    startTime: new Date(),
    duration,
    active: true,
  };
  room.lastActivity = new Date();
  return true;
}

export function stopVotingTimer(roomId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  if (room.votingTimer) {
    room.votingTimer.active = false;
  }
  room.lastActivity = new Date();
  return true;
}

export function isVotingTimerExpired(roomId: string): boolean {
  const room = rooms.get(roomId);
  if (!room || !room.votingTimer || !room.votingTimer.active) return false;

  const elapsed = Math.floor((new Date().getTime() - room.votingTimer.startTime.getTime()) / 1000);
  return elapsed >= room.votingTimer.duration;
}

export function getParticipantBySessionId(roomId: string, sessionId: string): Participant | null {
  const room = rooms.get(roomId);
  if (!room || !sessionId) return null;

  return Array.from(room.participants.values())
    .find(participant => participant.sessionId === sessionId) || null;
}

export function cleanupStaleParticipantsBySession(roomId: string, sessionId: string, currentParticipantId: string): boolean {
  const room = rooms.get(roomId);
  if (!room || !sessionId) return false;

  let removed = false;
  for (const [participantId, participant] of room.participants.entries()) {
    // Remove any participants with the same session ID but different participant ID
    if (participant.sessionId === sessionId && participantId !== currentParticipantId) {
      room.participants.delete(participantId);
      room.estimates.delete(participantId);
      removed = true;
      console.log(`Cleaned up stale participant ${participantId} for session ${sessionId}`);
    }
  }

  return removed;
}
