import { describe, it, expect, beforeEach } from 'vitest'
import { createRoom, addParticipant, getRoomState } from '@/lib/roomManager'

describe('Multiple Sessions Fix', () => {
  let roomId: string

  beforeEach(() => {
    roomId = createRoom('Test Room')
  })

  it('should allow multiple participants with same name from different sessions', () => {
    // First participant joins (normal browser)
    const participant1 = {
      id: 'user-1',
      name: 'John Doe',
      socketId: 'socket-1',
      isReady: false,
      joinedAt: new Date(),
      sessionId: 'session-normal'
    }

    // Second participant joins (incognito browser)
    const participant2 = {
      id: 'user-2',
      name: 'John Doe', // Same name
      socketId: 'socket-2',
      isReady: false,
      joinedAt: new Date(),
      sessionId: 'session-incognito'
    }

    // Both should be added successfully
    expect(addParticipant(roomId, participant1)).toBe(true)
    expect(addParticipant(roomId, participant2)).toBe(true)

    const roomState = getRoomState(roomId)
    expect(roomState!.participants).toHaveLength(2)

    // Both participants should exist
    const participant1Found = roomState!.participants.find(p => p.id === 'user-1')
    const participant2Found = roomState!.participants.find(p => p.id === 'user-2')

    expect(participant1Found).toBeDefined()
    expect(participant2Found).toBeDefined()
    expect(participant1Found!.name).toBe('John Doe')
    expect(participant2Found!.name).toBe('John Doe')
  })

  it('should track moderator correctly when multiple participants have same name', () => {
    const participant1 = {
      id: 'moderator',
      name: 'John Doe',
      socketId: 'socket-1',
      isReady: false,
      joinedAt: new Date(),
      sessionId: 'session-normal'
    }

    const participant2 = {
      id: 'user-2',
      name: 'John Doe',
      socketId: 'socket-2',
      isReady: false,
      joinedAt: new Date(),
      sessionId: 'session-incognito'
    }

    // Add participants
    addParticipant(roomId, participant1) // Should be moderator
    addParticipant(roomId, participant2)

    const roomState = getRoomState(roomId)

    // Should have 2 distinct participants despite same name
    expect(roomState!.participants).toHaveLength(2)

    // Verify both participants exist with their unique IDs
    const ids = roomState!.participants.map(p => p.id)
    expect(ids).toContain('moderator')
    expect(ids).toContain('user-2')
  })
})
