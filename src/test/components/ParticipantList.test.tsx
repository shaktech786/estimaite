import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ParticipantList } from '@/components/ParticipantList'
import type { Participant } from '@/types'

describe('ParticipantList', () => {
  const mockParticipants: Participant[] = [
    {
      id: '1',
      name: 'Alice',
      socketId: 'socket-1',
      isReady: true,
      joinedAt: new Date('2024-01-01'),
      estimate: 5
    },
    {
      id: '2',
      name: 'Bob',
      socketId: 'socket-2',
      isReady: false,
      joinedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Charlie',
      socketId: 'socket-3',
      isReady: true,
      joinedAt: new Date('2024-01-01'),
      estimate: 8
    }
  ]

  it('should render all participants', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        moderatorId="1"
        revealed={false}
      />
    )

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  it('should show moderator badge', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        moderatorId="1"
        revealed={false}
      />
    )

    // Check for crown icon with title "Moderator"
    const crownIcon = screen.getByTitle('Moderator')
    expect(crownIcon).toBeInTheDocument()
  })

  it('should show estimates when revealed', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        moderatorId="1"
        revealed={true}
      />
    )

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('should show voted indicator when not revealed but participant has estimate', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        moderatorId="1"
        revealed={false}
      />
    )

    // Should show "Ready" text for participants with estimates
    const readyTexts = screen.getAllByText('Ready')
    expect(readyTexts).toHaveLength(2) // Alice and Charlie have estimates
  })

  it('should show ready status', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        moderatorId="1"
        revealed={false}
      />
    )

    // Should show ready indicators for participants with estimates
    const readyTexts = screen.getAllByText('Ready')
    expect(readyTexts).toHaveLength(2) // Alice and Charlie

    // Should show thinking for Bob (no estimate)
    expect(screen.getByText('Thinking')).toBeInTheDocument()
  })

  it('should render empty state when no participants', () => {
    render(
      <ParticipantList
        participants={[]}
        moderatorId=""
        revealed={false}
      />
    )

    expect(screen.getByText('No participants in this room yet')).toBeInTheDocument()
  })

  it('should show participant count', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        moderatorId="1"
        revealed={false}
      />
    )

    expect(screen.getByText('Participants (3)')).toBeInTheDocument()
  })
})
