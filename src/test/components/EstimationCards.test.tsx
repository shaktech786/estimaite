import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EstimationCards } from '@/components/EstimationCards'

describe('EstimationCards', () => {
  const mockOnSelect = vi.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  it('should render all estimation cards', () => {
    render(
      <EstimationCards
        onSelect={mockOnSelect}
        disabled={false}
      />
    )

    // Check that common planning poker values are rendered
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('13')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('should call onSelect when a card is clicked', () => {
    render(
      <EstimationCards
        onSelect={mockOnSelect}
        disabled={false}
      />
    )

    const card5 = screen.getByText('5')
    fireEvent.click(card5)

    expect(mockOnSelect).toHaveBeenCalledWith(5)
  })

  it('should handle question mark card', () => {
    render(
      <EstimationCards
        onSelect={mockOnSelect}
        disabled={false}
      />
    )

    const questionCard = screen.getByText('?')
    fireEvent.click(questionCard)

    expect(mockOnSelect).toHaveBeenCalledWith('?')
  })

  it('should show selected state for selected estimate', () => {
    render(
      <EstimationCards
        onSelect={mockOnSelect}
        disabled={false}
        selectedValue={5}
      />
    )

    const card5 = screen.getByText('5')
    expect(card5.closest('button')).toHaveClass('ring-2')
  })

  it('should disable all cards when disabled prop is true', () => {
    render(
      <EstimationCards
        onSelect={mockOnSelect}
        disabled={true}
      />
    )

    const cards = screen.getAllByRole('radio')
    cards.forEach(card => {
      expect(card).toBeDisabled()
    })
  })

  it('should not call onSelect when disabled', () => {
    render(
      <EstimationCards
        onSelect={mockOnSelect}
        disabled={true}
      />
    )

    const card5 = screen.getByText('5')
    fireEvent.click(card5)

    expect(mockOnSelect).not.toHaveBeenCalled()
  })

  it('should show revealed styling when revealed prop is true', () => {
    render(
      <EstimationCards
        onSelect={mockOnSelect}
        disabled={false}
        selectedValue={5}
        revealed={true}
      />
    )

    const card5 = screen.getByText('5')
    expect(card5.closest('button')).toHaveClass('ring-green-500')
  })
})
