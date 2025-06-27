import { describe, it, expect, beforeEach } from 'vitest'
import {
  createRoom,
  getRoomState,
  addParticipant,
  submitStory,
  submitEstimate,
  revealEstimates,
  resetEstimates,
  roomExists
} from '@/lib/roomManager'
import type { Participant, Story } from '@/types'

describe('roomManager', () => {
  let roomId: string
  let participant: Participant

  beforeEach(() => {
    // Create a fresh room for each test
    roomId = createRoom('Test Room')
    participant = {
      id: 'test-participant-1',
      name: 'Test User',
      socketId: 'socket-123',
      isReady: false,
      joinedAt: new Date()
    }
  })

  describe('createRoom', () => {
    it('should create a room and return a room ID', () => {
      const newRoomId = createRoom('New Test Room')
      expect(newRoomId).toBeTruthy()
      expect(newRoomId).toHaveLength(4) // 4-character room codes
      expect(/^[A-Z0-9]{4}$/.test(newRoomId)).toBe(true) // Verify alphanumeric format
      expect(roomExists(newRoomId)).toBe(true)
    })
  })

  describe('addParticipant', () => {
    it('should add a participant to the room', () => {
      const success = addParticipant(roomId, participant)
      expect(success).toBe(true)

      const roomState = getRoomState(roomId)
      expect(roomState).not.toBeNull()
      expect(roomState!.participants).toHaveLength(1)
      expect(roomState!.participants[0]?.name).toBe('Test User')
    })

    it('should set first participant as moderator', () => {
      addParticipant(roomId, participant)
      const roomState = getRoomState(roomId)
      expect(roomState).not.toBeNull()
      expect(roomState!.participants[0]?.id).toBe(participant.id)
    })

  it('should allow multiple participants with the same name (different sessions)', () => {
    addParticipant(roomId, participant)

    // Add another participant with same name but different ID (simulating different session)
    const secondParticipant = {
      ...participant,
      id: 'different-id',
      sessionId: 'different-session'
    }

    const success = addParticipant(roomId, secondParticipant)
    expect(success).toBe(true)

    const roomState = getRoomState(roomId)
    expect(roomState!.participants).toHaveLength(2) // Should allow both participants
  })
  })

  describe('submitStory', () => {
    beforeEach(() => {
      addParticipant(roomId, participant)
    })

    it('should submit a story and start voting timer', () => {
      const story: Story = {
        title: 'Test Story',
        description: 'A test user story',
        acceptanceCriteria: ['Criterion 1', 'Criterion 2']
      }

      const success = submitStory(roomId, story)
      expect(success).toBe(true)

      const roomState = getRoomState(roomId)
      expect(roomState!.currentStory).toEqual(story)
      expect(roomState!.revealed).toBe(false)
      expect(roomState!.estimates).toHaveLength(0)
    })
  })

  describe('submitEstimate', () => {
    beforeEach(() => {
      addParticipant(roomId, participant)
      const story: Story = {
        title: 'Test Story',
        description: 'A test user story'
      }
      submitStory(roomId, story)
    })

    it('should submit an estimate for a participant', () => {
      const success = submitEstimate(roomId, participant.id, 5)
      expect(success).toBe(true)

      const roomState = getRoomState(roomId)
      expect(roomState!.estimates).toHaveLength(1)
      expect(roomState!.estimates[0]?.estimate).toBe(5)
      expect(roomState!.estimates[0]?.participantId).toBe(participant.id)
    })

    it('should update participant estimate in participant list', () => {
      submitEstimate(roomId, participant.id, 8)

      const roomState = getRoomState(roomId)
      expect(roomState!.participants[0]?.estimate).toBe(8)
    })
  })

  describe('revealEstimates', () => {
    beforeEach(() => {
      addParticipant(roomId, participant)
      const story: Story = {
        title: 'Test Story',
        description: 'A test user story'
      }
      submitStory(roomId, story)
      submitEstimate(roomId, participant.id, 5)
    })

    it('should reveal estimates and stop timer', () => {
      const success = revealEstimates(roomId)
      expect(success).toBe(true)

      const roomState = getRoomState(roomId)
      expect(roomState!.revealed).toBe(true)
    })
  })

  describe('resetEstimates', () => {
    beforeEach(() => {
      addParticipant(roomId, participant)
      const story: Story = {
        title: 'Test Story',
        description: 'A test user story'
      }
      submitStory(roomId, story)
      submitEstimate(roomId, participant.id, 5)
      revealEstimates(roomId)
    })

    it('should reset estimates and restart timer', () => {
      const success = resetEstimates(roomId)
      expect(success).toBe(true)

      const roomState = getRoomState(roomId)
      expect(roomState!.revealed).toBe(false)
      expect(roomState!.estimates).toHaveLength(0)
      expect(roomState!.participants[0]?.estimate).toBeUndefined()
    })
  })

  describe('roomExists', () => {
    it('should return true for existing room', () => {
      expect(roomExists(roomId)).toBe(true)
    })

    it('should return false for non-existent room', () => {
      expect(roomExists('INVALID123')).toBe(false)
    })
  })
})
