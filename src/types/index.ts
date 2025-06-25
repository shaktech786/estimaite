// Core types for the EstimAIte application

export interface Participant {
  id: string;
  name: string;
  socketId: string;
  isReady: boolean;
  estimate?: number;
  joinedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  lastActivity: Date;
  participants: Map<string, Participant>;
  currentStory?: Story;
  estimates: Map<string, number>;
  revealed: boolean;
  moderatorId?: string;
}

export interface Story {
  title: string;
  description: string;
  acceptanceCriteria?: string[];
  aiAnalysis?: AIAnalysis;
}

export interface AIAnalysis {
  complexity: 'low' | 'medium' | 'high';
  suggestedPoints: number[];
  reasoning: string;
  tags: string[];
  recommendations?: string[];
}

export interface EstimationCard {
  value: number | string;
  label: string;
  selected?: boolean;
}

export interface EstimationStats {
  min: number;
  max: number;
  average: number;
  median: number;
  consensus: boolean;
}

export interface EstimationResult {
  participantId: string;
  participantName: string;
  estimate: number;
}

// Pusher event types
export interface ServerToClientEvents {
  'room-joined': (data: {
    roomId: string;
    participant: Participant;
    isModerator: boolean;
    currentStory: Story | undefined;
    revealed: boolean;
  }) => void;

  'participant-joined': (data: {
    participant: Participant;
    participantCount: number;
  }) => void;

  'participant-left': (data: {
    participantId: string;
    participantCount: number;
    newModeratorId: string | undefined;
  }) => void;

  'participants-updated': (data: {
    participants: Participant[];
    moderatorId: string | undefined;
  }) => void;

  'story-updated': (data: {
    story: Story;
    estimates: Record<string, number>;
    revealed: boolean;
  }) => void;

  'estimate-submitted': (data: {
    participantId: string;
    allReady: boolean;
    readyCount: number;
    totalCount: number;
  }) => void;

  'estimates-revealed': (data: {
    estimates: EstimationResult[];
    revealed: boolean;
  }) => void;

  'estimates-reset': () => void;

  'error': (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  'join-room': (data: {
    roomId: string;
    participantName: string;
  }) => void;

  'submit-story': (data: {
    roomId: string;
    story: Story;
  }) => void;

  'submit-estimate': (data: {
    roomId: string;
    estimate: number;
  }) => void;

  'reveal-estimates': (data: {
    roomId: string;
  }) => void;

  'reset-estimates': (data: {
    roomId: string;
  }) => void;
}

// API Response types
export interface CreateRoomResponse {
  roomId: string;
  name: string;
  message: string;
}

export interface RoomInfoResponse {
  roomId: string;
  name: string;
  participantCount: number;
  currentStory?: Story;
  revealed: boolean;
  exists: boolean;
}

export interface AIAnalysisResponse {
  analysis: AIAnalysis;
}

// Form types
export interface CreateRoomForm {
  name: string;
  participantName: string;
}

export interface JoinRoomForm {
  roomCode: string;
  participantName: string;
}

export interface StoryForm {
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

// UI State types
export interface RoomState {
  connected: boolean;
  loading: boolean;
  error?: string;
  room?: {
    id: string;
    name: string;
    participantCount: number;
  };
  participant?: Participant;
  participants: Participant[];
  currentStory?: Story;
  estimates: EstimationResult[];
  revealed: boolean;
  isModerator: boolean;
  selectedEstimate?: number;
}

export type EstimationCardValue = 1 | 2 | 3 | 5 | 8 | 13 | 21 | 34 | 55 | 89 | '?';

export const ESTIMATION_CARDS: EstimationCard[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 5, label: '5' },
  { value: 8, label: '8' },
  { value: 13, label: '13' },
  { value: 21, label: '21' },
  { value: '?', label: '?' },
];

export type RoomStatus = 'waiting' | 'estimating' | 'revealed' | 'discussing';

export interface RoomActivity {
  type: 'join' | 'leave' | 'estimate' | 'reveal' | 'reset' | 'story';
  participantName: string;
  timestamp: Date;
  details?: string;
}
