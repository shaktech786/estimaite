import type { Participant, Story, RoomState, EstimationResult } from '@/types';

// In-memory room storage (you might want to use Redis in production)
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
}>();

// Cleanup inactive rooms every 30 minutes
setInterval(() => {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  for (const [roomId, room] of rooms.entries()) {
    if (room.lastActivity < thirtyMinutesAgo) {
      rooms.delete(roomId);
    }
  }
}, 30 * 60 * 1000);

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
  return roomId;
}

export function getRoomState(roomId: string): RoomState | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  const participants = Array.from(room.participants.values());
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

  return result;
}

export function addParticipant(roomId: string, participant: Participant): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  // Check if participant already exists by name to prevent duplicates
  const existingParticipant = Array.from(room.participants.values())
    .find(p => p.name.toLowerCase() === participant.name.toLowerCase());

  if (existingParticipant) {
    // Update existing participant instead of creating duplicate
    existingParticipant.isReady = false;
    existingParticipant.joinedAt = new Date();
    room.participants.set(existingParticipant.id, existingParticipant);
    room.lastActivity = new Date();
    return true;
  }

  // Set first participant as moderator
  if (room.participants.size === 0) {
    room.moderatorId = participant.id;
  }

  room.participants.set(participant.id, participant);
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
  room.lastActivity = new Date();
  return true;
}

export function resetEstimates(roomId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  room.estimates.clear();
  room.revealed = false;
  room.lastActivity = new Date();
  return true;
}

export function roomExists(roomId: string): boolean {
  return rooms.has(roomId);
}

export function getRoomData(roomId: string) {
  return rooms.get(roomId);
}

export function getExistingParticipant(roomId: string, participantName: string): Participant | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  return Array.from(room.participants.values())
    .find(p => p.name.toLowerCase() === participantName.toLowerCase()) || null;
}
