import { describe, it, expect } from 'vitest'
import { calculateEstimationStats, cn } from '@/lib/utils'

describe('utils', () => {
  describe('calculateEstimationStats', () => {
    it('should calculate basic statistics correctly', () => {
      const estimates = [1, 2, 3, 5, 8]
      const stats = calculateEstimationStats(estimates)

      expect(stats).not.toBeNull()
      expect(stats!.min).toBe(1)
      expect(stats!.max).toBe(8)
      expect(stats!.average).toBe(3.8)
      expect(stats!.median).toBe(3)
      expect(stats!.consensus).toBe(false)
    })

    it('should detect consensus when all estimates are the same', () => {
      const estimates = [5, 5, 5, 5]
      const stats = calculateEstimationStats(estimates)

      expect(stats).not.toBeNull()
      expect(stats!.consensus).toBe(true)
      expect(stats!.min).toBe(5)
      expect(stats!.max).toBe(5)
      expect(stats!.average).toBe(5)
      expect(stats!.median).toBe(5)
    })

    it('should handle single estimate', () => {
      const estimates = [8]
      const stats = calculateEstimationStats(estimates)

      expect(stats).not.toBeNull()
      expect(stats!.consensus).toBe(true)
      expect(stats!.min).toBe(8)
      expect(stats!.max).toBe(8)
      expect(stats!.average).toBe(8)
      expect(stats!.median).toBe(8)
    })

    it('should calculate median correctly for even number of estimates', () => {
      const estimates = [1, 3, 5, 8]
      const stats = calculateEstimationStats(estimates)

      expect(stats).not.toBeNull()
      expect(stats!.median).toBe(4) // (3 + 5) / 2
    })

    it('should handle empty array', () => {
      const estimates: number[] = []
      const stats = calculateEstimationStats(estimates)

      expect(stats).toBeNull()
    })
  })

  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2', undefined, 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class active-class')
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })
})
