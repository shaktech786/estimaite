import { NextRequest, NextResponse } from 'next/server';
import { pusherServer, getChannelName, PUSHER_EVENTS } from '@/lib/pusher';
import {
  addParticipant,
  removeParticipant,
  submitStory,
  submitEstimate,
  revealEstimates,
  resetEstimates,
  clearStoryAndReset,
  getRoomState,
  roomExists,
  getRoomData,
  createOrRecoverRoom,
  isVotingTimerExpired,
  getParticipantBySessionId,
  cleanupStaleParticipantsBySession
} from '@/lib/roomManager';

export async function POST(request: NextRequest) {
  try {
    const { action, roomId, ...data } = await request.json();

    if (!roomId || !roomExists(roomId)) {
      // Try to recover the room if it doesn't exist (serverless cold start recovery)
      if (roomId && createOrRecoverRoom(roomId)) {
        console.log(`Room ${roomId} recovered for action: ${action}`);
      } else {
        return NextResponse.json(
          { error: 'Room not found. Please check the room code.' },
          { status: 404 }
        );
      }
    }

    const channelName = getChannelName(roomId);

    // Check if voting timer has expired and auto-reveal if needed
    if (isVotingTimerExpired(roomId)) {
      console.log(`Voting timer expired for room ${roomId}, auto-revealing estimates`);
      revealEstimates(roomId);
      const expiredRoomState = getRoomState(roomId);

      // Broadcast timer expiration
      await pusherServer.trigger(channelName, PUSHER_EVENTS.ESTIMATES_REVEALED, {
        roomState: expiredRoomState,
        autoRevealed: true,
      });
    }

    switch (action) {
      case 'join': {
        const { participantName, sessionId } = data;
        if (!participantName) {
          return NextResponse.json(
            { error: 'Participant name is required' },
            { status: 400 }
          );
        }

        console.log(`Join request: room=${roomId}, name=${participantName}, session=${sessionId}`);

        // First, let's log the current room state
        const currentRoomState = getRoomState(roomId);
        console.log(`Current room has ${currentRoomState?.participants.length || 0} participants`);
        currentRoomState?.participants.forEach((p, index) => {
          console.log(`  Participant ${index + 1}: id=${p.id}, name=${p.name}, session=${p.sessionId}`);
        });

        // Check if participant with this session ID already exists
        let participant = getParticipantBySessionId(roomId, sessionId);
        let isNewParticipant = false;

        if (!participant) {
          console.log(`Creating new participant for session ${sessionId}`);

          // DEFENSIVE CHECK: Make sure we're not accidentally overriding someone
          // Check if there's already a participant with the same name but different session
          const existingWithSameName = currentRoomState?.participants.find(p =>
            p.name === participantName && p.sessionId !== sessionId
          );
          if (existingWithSameName) {
            console.log(`WARNING: Found existing participant with same name but different session:`);
            console.log(`  Existing: id=${existingWithSameName.id}, session=${existingWithSameName.sessionId}`);
            console.log(`  New: session=${sessionId}`);
            console.log(`  This should create a separate participant, not override!`);
          }

          // Create new participant for new session
          participant = {
            id: `participant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: participantName,
            socketId: '',
            isReady: false,
            joinedAt: new Date(),
            sessionId: sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
          isNewParticipant = true;
        } else {
          console.log(`Updating existing participant ${participant.id} for session ${sessionId}`);

          // Check if this is a rapid duplicate request (within 1 second)
          const timeSinceJoin = new Date().getTime() - participant.joinedAt.getTime();
          if (timeSinceJoin < 1000) {
            console.log(`Ignoring rapid duplicate join request for session ${sessionId}`);
            // Return the existing participant data without broadcasting
            const roomState = getRoomState(roomId);
            const roomData = getRoomData(roomId);
            return NextResponse.json({
              participant,
              roomState,
              isModerator: roomData?.moderatorId === participant.id,
            });
          }

          // Update existing participant (reconnection)
          participant.name = participantName; // Allow name updates
          participant.joinedAt = new Date();
          participant.isReady = false;
          // Keep existing estimates if any
        }

        // Clean up any stale participants with the same session ID
        if (sessionId) {
          const cleaned = cleanupStaleParticipantsBySession(roomId, sessionId, participant.id);
          if (cleaned) {
            console.log(`Cleaned up stale participants for session ${sessionId}`);
          }
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

        // DEFENSIVE CHECK: Verify the participant was added correctly
        console.log(`After adding participant:`);
        console.log(`  Room now has ${roomState?.participants.length || 0} participants`);
        roomState?.participants.forEach((p, index) => {
          console.log(`    Participant ${index + 1}: id=${p.id}, name=${p.name}, session=${p.sessionId}`);
        });

        // Verify our participant is in the room
        const addedParticipant = roomState?.participants.find(p => p.id === participant.id);
        if (!addedParticipant) {
          console.error(`ERROR: Participant ${participant.id} was not found in room after adding!`);
        } else {
          console.log(`SUCCESS: Participant ${participant.id} confirmed in room`);
        }

        console.log(`Join successful: participant=${participant.id}, isNew=${isNewParticipant}, totalParticipants=${roomState?.participants.length || 0}`);

        // Only broadcast if this is a genuinely new participant
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

        // Any user can submit stories - no need to check moderator status

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
        // Anyone can reveal estimates
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
        // Anyone can reset estimates
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

      case 'clear-story-and-reset': {
        // Anyone can clear story and start fresh
        const success = clearStoryAndReset(roomId);
        if (!success) {
          return NextResponse.json(
            { error: 'Failed to clear story and reset' },
            { status: 500 }
          );
        }

        const roomState = getRoomState(roomId);

        // Broadcast room state updated (includes story cleared)
        await pusherServer.trigger(channelName, PUSHER_EVENTS.ROOM_STATE_UPDATED, {
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
