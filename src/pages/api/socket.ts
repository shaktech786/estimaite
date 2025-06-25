import { Server as SocketIOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ServerToClientEvents, ClientToServerEvents, Participant, Story } from '@/types';

interface SocketServer {
  io?: SocketIOServer<ClientToServerEvents, ServerToClientEvents>;
}

interface ServerSocket {
  server?: unknown;
}

// Global server instance for development
const globalForSocket = globalThis as unknown as {
  socketServer: SocketServer;
};

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!globalForSocket.socketServer?.io) {
    console.log('Initializing Socket.IO server...');

    const socketRes = res.socket as unknown as ServerSocket;
    const httpServer = socketRes.server;

    const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer as never, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: false,
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true,
    });

    // Room management with proper typing
    const rooms = new Map<string, {
      id: string;
      participants: Map<string, Participant>;
      estimates: Map<string, number>;
      revealed: boolean;
      moderatorId: string | null;
      currentStory: Story | null;
      lastActivity: Date;
    }>();

    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('join-room', ({ roomId, participantName }) => {
        try {
          let room = rooms.get(roomId);
          if (!room) {
            room = {
              id: roomId,
              participants: new Map<string, Participant>(),
              estimates: new Map<string, number>(),
              revealed: false,
              moderatorId: null,
              currentStory: null,
              lastActivity: new Date(),
            };
            rooms.set(roomId, room);
          }

          // Add participant
          const participant: Participant = {
            id: socket.id,
            name: participantName,
            socketId: socket.id,
            isReady: false,
            joinedAt: new Date(),
          };

          room.participants.set(socket.id, participant);
          room.lastActivity = new Date();

          // Set moderator if first participant
          if (!room.moderatorId) {
            room.moderatorId = socket.id;
          }

          socket.join(roomId);

          // Send confirmation to joining user
          socket.emit('room-joined', {
            roomId,
            participant,
            isModerator: room.moderatorId === socket.id,
            currentStory: room.currentStory || undefined,
            revealed: room.revealed,
          });

          // Notify others
          socket.to(roomId).emit('participant-joined', {
            participant,
            participantCount: room.participants.size,
          });

          // Send updated participant list
          io.to(roomId).emit('participants-updated', {
            participants: Array.from(room.participants.values()),
            moderatorId: room.moderatorId || undefined,
          });

          console.log(`${participantName} joined room ${roomId}`);
        } catch (error) {
          console.error('Error joining room:', error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      socket.on('submit-story', ({ roomId, story }) => {
        const room = rooms.get(roomId);
        if (!room || room.moderatorId !== socket.id) {
          socket.emit('error', { message: 'Unauthorized or room not found' });
          return;
        }

        room.currentStory = story;
        room.estimates.clear();
        room.revealed = false;
        room.lastActivity = new Date();

        // Reset participant states
        room.participants.forEach((participant) => {
          participant.isReady = false;
          delete participant.estimate;
        });

        io.to(roomId).emit('story-updated', {
          story,
          estimates: {},
          revealed: false,
        });

        io.to(roomId).emit('participants-updated', {
          participants: Array.from(room.participants.values()),
          moderatorId: room.moderatorId ?? undefined,
        });
      });

      socket.on('submit-estimate', ({ roomId, estimate }) => {
        const room = rooms.get(roomId);
        const participant = room?.participants.get(socket.id);

        if (!room || !participant) {
          socket.emit('error', { message: 'Room or participant not found' });
          return;
        }

        participant.estimate = estimate;
        participant.isReady = true;
        room.estimates.set(socket.id, estimate);
        room.lastActivity = new Date();

        const allReady = Array.from(room.participants.values()).every((p) => p.isReady);

        io.to(roomId).emit('estimate-submitted', {
          participantId: socket.id,
          allReady,
          readyCount: Array.from(room.participants.values()).filter((p) => p.isReady).length,
          totalCount: room.participants.size,
        });

        io.to(roomId).emit('participants-updated', {
          participants: Array.from(room.participants.values()),
          moderatorId: room.moderatorId ?? undefined,
        });
      });

      socket.on('reveal-estimates', ({ roomId }) => {
        const room = rooms.get(roomId);
        if (!room || room.moderatorId !== socket.id) {
          socket.emit('error', { message: 'Unauthorized or room not found' });
          return;
        }

        room.revealed = true;
        room.lastActivity = new Date();

        const estimates = Array.from(room.participants.values())
          .filter((p) => p.estimate !== undefined)
          .map((p) => ({
            participantId: p.id,
            participantName: p.name,
            estimate: p.estimate!,
          }));

        io.to(roomId).emit('estimates-revealed', {
          estimates,
          revealed: true,
        });
      });

      socket.on('reset-estimates', ({ roomId }) => {
        const room = rooms.get(roomId);
        if (!room || room.moderatorId !== socket.id) {
          socket.emit('error', { message: 'Unauthorized or room not found' });
          return;
        }

        room.estimates.clear();
        room.revealed = false;
        room.lastActivity = new Date();

        room.participants.forEach((participant) => {
          participant.isReady = false;
          delete participant.estimate;
        });

        io.to(roomId).emit('estimates-reset');
        io.to(roomId).emit('participants-updated', {
          participants: Array.from(room.participants.values()),
          moderatorId: room.moderatorId ?? undefined,
        });
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);

        // Clean up from all rooms
        for (const [roomId, room] of rooms.entries()) {
          if (room.participants.has(socket.id)) {
            room.participants.delete(socket.id);
            room.estimates.delete(socket.id);

            // Transfer moderator if needed
            if (room.moderatorId === socket.id && room.participants.size > 0) {
              const newModerator = Array.from(room.participants.values())[0];
              if (newModerator) {
                room.moderatorId = newModerator.id;
              }
            }

            if (room.participants.size === 0) {
              rooms.delete(roomId);
              console.log(`Room ${roomId} deleted - no participants`);
            } else {
              io.to(roomId).emit('participant-left', {
                participantId: socket.id,
                participantCount: room.participants.size,
                newModeratorId: room.moderatorId ?? undefined,
              });

              io.to(roomId).emit('participants-updated', {
                participants: Array.from(room.participants.values()),
                moderatorId: room.moderatorId ?? undefined,
              });
            }
          }
        }
      });
    });

    // Cleanup inactive rooms every 30 minutes
    setInterval(() => {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      for (const [roomId, room] of rooms.entries()) {
        if (room.lastActivity < thirtyMinutesAgo) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} cleaned up due to inactivity`);
        }
      }
    }, 30 * 60 * 1000);

    globalForSocket.socketServer = { io };
    console.log('Socket.IO server initialized successfully');
  }

  res.end();
}
