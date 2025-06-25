import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    forceTLS: true,
  }
);

// Channel naming utilities
export const getChannelName = (roomId: string) => `room-${roomId}`;
export const getPresenceChannelName = (roomId: string) => `presence-room-${roomId}`;

// Event names
export const PUSHER_EVENTS = {
  PARTICIPANT_JOINED: 'participant-joined',
  PARTICIPANT_LEFT: 'participant-left',
  STORY_SUBMITTED: 'story-submitted',
  ESTIMATE_SUBMITTED: 'estimate-submitted',
  ESTIMATES_REVEALED: 'estimates-revealed',
  ESTIMATES_RESET: 'estimates-reset',
  ROOM_STATE_UPDATED: 'room-state-updated',
} as const;
