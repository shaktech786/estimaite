import { NextRequest, NextResponse } from 'next/server';
import { createRoom, roomExists, getRoomData, createOrRecoverRoom } from '@/lib/roomManager';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        { error: 'Room name must be 50 characters or less' },
        { status: 400 }
      );
    }

    const roomId = createRoom(name.trim());

    return NextResponse.json({
      roomId,
      name: name.trim(),
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    if (!roomExists(roomId)) {
      // Try to recover the room (in case of serverless cold start)
      console.log(`Room ${roomId} not found, attempting recovery...`);
      const recovered = createOrRecoverRoom(roomId);

      if (!recovered) {
        return NextResponse.json(
          { error: 'Room not found. The room may have expired or never existed.' },
          { status: 404 }
        );
      }

      console.log(`Room ${roomId} recovered successfully`);
    }

    const roomData = getRoomData(roomId);
    if (!roomData) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      roomId: roomData.id,
      name: roomData.name,
      participantCount: roomData.participants.size,
      currentStory: roomData.currentStory,
      revealed: roomData.revealed,
      exists: true
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room information' },
      { status: 500 }
    );
  }
}
