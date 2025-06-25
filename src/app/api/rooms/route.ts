import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// In-memory storage for rooms (will be cleared on server restart)
const rooms = new Map<string, {
  id: string;
  name: string;
  createdAt: Date;
  lastActivity: Date;
  participants: Map<string, {
    id: string;
    name: string;
    isReady: boolean;
    estimate?: number;
    joinedAt: Date;
  }>;
  currentStory?: {
    title: string;
    description: string;
    acceptanceCriteria?: string[];
    aiAnalysis?: {
      complexity: 'low' | 'medium' | 'high';
      suggestedPoints: number[];
      reasoning: string;
      tags: string[];
    };
  };
  estimates: Map<string, number>;
  revealed: boolean;
  moderatorId?: string;
}>();

// Cleanup inactive rooms every 30 minutes
setInterval(() => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  for (const [roomId, room] of rooms.entries()) {
    if (room.lastActivity < thirtyMinutesAgo) {
      rooms.delete(roomId);
    }
  }
}, 30 * 60 * 1000);

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // Generate unique room ID
    const roomId = nanoid(8).toUpperCase();

    const room = {
      id: roomId,
      name: name.trim(),
      createdAt: new Date(),
      lastActivity: new Date(),
      participants: new Map(),
      estimates: new Map(),
      revealed: false,
    };

    rooms.set(roomId, room);

    return NextResponse.json({
      roomId,
      name: room.name,
      message: 'Room created successfully'
    });

  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');

  if (!roomId) {
    return NextResponse.json(
      { error: 'Room ID is required' },
      { status: 400 }
    );
  }

  const room = rooms.get(roomId);
  if (!room) {
    return NextResponse.json(
      { error: 'Room not found' },
      { status: 404 }
    );
  }

  // Update last activity
  room.lastActivity = new Date();

  return NextResponse.json({
    roomId: room.id,
    name: room.name,
    participantCount: room.participants.size,
    currentStory: room.currentStory,
    revealed: room.revealed,
    exists: true
  });
}
