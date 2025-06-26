import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VotingTimer } from '@/components/VotingTimer'

// Mock timers
vi.useFakeTimers()

describe('VotingTimer', () => {
  const mockOnTimeUp = vi.fn()
  const mockOnToggle = vi.fn()

  beforeEach(() => {
    mockOnTimeUp.mockClear()
    mockOnToggle.mockClear()
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.useFakeTimers()
  })

  it('should render initial timer state', () => {
    render(
      <VotingTimer
        initialTime={300} // 5 minutes
        active={true}
        onTimeUp={mockOnTimeUp}
        onToggle={mockOnToggle}
        showControls={true}
      />
    )

    expect(screen.getByText('5:00')).toBeInTheDocument()
  })

  it('should format time correctly', () => {
    const { rerender } = render(
      <VotingTimer
        initialTime={125} // 2:05
        active={true}
        onTimeUp={mockOnTimeUp}
        onToggle={mockOnToggle}
        showControls={true}
      />
    )

    expect(screen.getByText('2:05')).toBeInTheDocument()

    rerender(
      <VotingTimer
        initialTime={65} // 1:05
        active={true}
        onTimeUp={mockOnTimeUp}
        onToggle={mockOnToggle}
        showControls={true}
      />
    )

    expect(screen.getByText('1:05')).toBeInTheDocument()
  })

  it('should show controls when showControls is true', () => {
    render(
      <VotingTimer
        initialTime={300}
        active={true}
        onTimeUp={mockOnTimeUp}
        onToggle={mockOnToggle}
        showControls={true}
      />
    )

    // Should have pause button initially (timer is active)
    const pauseButton = screen.getByRole('button')
    expect(pauseButton).toBeInTheDocument()
  })

  it('should call onToggle when toggle button is clicked', () => {
    render(
      <VotingTimer
        initialTime={300}
        active={true}
        onTimeUp={mockOnTimeUp}
        onToggle={mockOnToggle}
        showControls={true}
      />
    )

    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    expect(mockOnToggle).toHaveBeenCalledWith(true) // paused = true
  })

  it('should not show controls when showControls is false', () => {
    render(
      <VotingTimer
        initialTime={300}
        active={true}
        onTimeUp={mockOnTimeUp}
        onToggle={mockOnToggle}
        showControls={false}
      />
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should apply correct color for time remaining', () => {
    const { rerender } = render(
      <VotingTimer
        initialTime={30} // 30 seconds - should be red
        active={true}
        onTimeUp={mockOnTimeUp}
        onToggle={mockOnToggle}
        showControls={false}
      />
    )

    const timer = screen.getByText('0:30')
    expect(timer).toHaveClass('text-red-400')

    rerender(
      <VotingTimer
        initialTime={45} // 45 seconds - should be yellow
        active={true}
        onTimeUp={mockOnTimeUp}
        onToggle={mockOnToggle}
        showControls={false}
      />
    )

    const timer2 = screen.getByText('0:45')
    expect(timer2).toHaveClass('text-yellow-400')
  })

  it('should not render when not active and at initial time', () => {
    const { container } = render(
      <VotingTimer
        initialTime={300}
        active={false}
        onTimeUp={mockOnTimeUp}
        onToggle={mockOnToggle}
        showControls={true}
      />
    )

    // Timer should not render when not active and at initial time
    expect(container.firstChild).toBeNull()
  })
})
