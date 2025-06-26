import { NextRequest, NextResponse } from 'next/server';
import { pusherServer, getChannelName, PUSHER_EVENTS } from '@/lib/pusher';
import {
  addParticipant,
  removeParticipant,
  submitStory,
  submitEstimate,
  revealEstimates,
  resetEstimates,
  getRoomState,
  roomExists,
  getRoomData,
  getExistingParticipant
} from '@/lib/roomManager';

export async function POST(request: NextRequest) {
  try {
    const { action, roomId, ...data } = await request.json();

    if (!roomId || !roomExists(roomId)) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    const channelName = getChannelName(roomId);

    switch (action) {
      case 'join': {
        const { participantName } = data;
        if (!participantName) {
          return NextResponse.json(
            { error: 'Participant name is required' },
            { status: 400 }
          );
        }

        // Check if participant already exists in the room
        let participant = getExistingParticipant(roomId, participantName);
        const isNewParticipant = !participant;

        if (!participant) {
          // Create new participant if doesn't exist
          participant = {
            id: `participant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: participantName,
            socketId: '',
            isReady: false,
            joinedAt: new Date(),
          };
        } else {
          // Update existing participant's join time
          participant.joinedAt = new Date();
          participant.isReady = false;
        }

        const success = addParticipant(roomId, participant);
        if (!success) {
          return NextResponse.json(
            { error: 'Failed to join room' },
            { status: 500 }
          );
        }

        const roomState = getRoomState(roomId);
        const roomData = getRoomData(roomId);

        // Only broadcast if this is a new participant (not just a reconnection)
        if (isNewParticipant) {
          await pusherServer.trigger(channelName, PUSHER_EVENTS.PARTICIPANT_JOINED, {
            participant,
            roomState,
          });
        }

        return NextResponse.json({
          success: true,
          participant,
          roomState,
          isModerator: roomData?.moderatorId === participant.id,
        });
      }

      case 'leave': {
        const { participantId } = data;
        if (!participantId) {
          return NextResponse.json(
            { error: 'Participant ID is required' },
            { status: 400 }
          );
        }

        const success = removeParticipant(roomId, participantId);
        if (!success) {
          return NextResponse.json(
            { error: 'Failed to leave room' },
            { status: 500 }
          );
        }

        const roomState = getRoomState(roomId);

        // Broadcast participant left
        await pusherServer.trigger(channelName, PUSHER_EVENTS.PARTICIPANT_LEFT, {
          participantId,
          roomState,
        });

        return NextResponse.json({ success: true });
      }

      case 'submit-story': {
        const { story, participantId } = data;
        if (!story || !participantId) {
          return NextResponse.json(
            { error: 'Story and participant ID are required' },
            { status: 400 }
          );
        }

        const roomData = getRoomData(roomId);
        if (roomData?.moderatorId !== participantId) {
          return NextResponse.json(
            { error: 'Only moderator can submit stories' },
            { status: 403 }
          );
        }

        const success = submitStory(roomId, story);
        if (!success) {
          return NextResponse.json(
            { error: 'Failed to submit story' },
            { status: 500 }
          );
        }

        const roomState = getRoomState(roomId);

        // Broadcast story submitted
        await pusherServer.trigger(channelName, PUSHER_EVENTS.STORY_SUBMITTED, {
          story,
          roomState,
        });

        return NextResponse.json({ success: true });
      }

      case 'submit-estimate': {
        const { estimate, participantId } = data;
        if (estimate === undefined || !participantId) {
          return NextResponse.json(
            { error: 'Estimate and participant ID are required' },
            { status: 400 }
          );
        }

        const success = submitEstimate(roomId, participantId, estimate);
        if (!success) {
          return NextResponse.json(
            { error: 'Failed to submit estimate' },
            { status: 500 }
          );
        }

        const roomState = getRoomState(roomId);

        // Broadcast estimate submitted
        await pusherServer.trigger(channelName, PUSHER_EVENTS.ESTIMATE_SUBMITTED, {
          participantId,
          roomState,
        });

        return NextResponse.json({ success: true });
      }

      case 'reveal-estimates': {
        const { participantId } = data;
        const roomData = getRoomData(roomId);
        if (roomData?.moderatorId !== participantId) {
          return NextResponse.json(
            { error: 'Only moderator can reveal estimates' },
            { status: 403 }
          );
        }

        const success = revealEstimates(roomId);
        if (!success) {
          return NextResponse.json(
            { error: 'Failed to reveal estimates' },
            { status: 500 }
          );
        }

        const roomState = getRoomState(roomId);

        // Broadcast estimates revealed
        await pusherServer.trigger(channelName, PUSHER_EVENTS.ESTIMATES_REVEALED, {
          roomState,
        });

        return NextResponse.json({ success: true });
      }

      case 'reset-estimates': {
        const { participantId } = data;
        const roomData = getRoomData(roomId);
        if (roomData?.moderatorId !== participantId) {
          return NextResponse.json(
            { error: 'Only moderator can reset estimates' },
            { status: 403 }
          );
        }

        const success = resetEstimates(roomId);
        if (!success) {
          return NextResponse.json(
            { error: 'Failed to reset estimates' },
            { status: 500 }
          );
        }

        const roomState = getRoomState(roomId);

        // Broadcast estimates reset
        await pusherServer.trigger(channelName, PUSHER_EVENTS.ESTIMATES_RESET, {
          roomState,
        });

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in room action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId || !roomExists(roomId)) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    const roomState = getRoomState(roomId);
    return NextResponse.json({ roomState });
  } catch (error) {
    console.error('Error fetching room state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
