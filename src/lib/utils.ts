import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to combine class names with Tailwind CSS merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random room code
 */
export function generateRoomCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate room code format
 */
export function isValidRoomCode(code: string): boolean {
  return /^[A-Z0-9]{6,10}$/.test(code);
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 500); // Limit length
}

/**
 * Format time duration
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Get estimation card colors based on value
 */
export function getCardColor(value: number | string): string {
  if (value === '?') return 'from-gray-500 to-gray-600';

  const numValue = typeof value === 'string' ? parseInt(value) : value;

  if (numValue <= 3) return 'from-green-500 to-green-600';
  if (numValue <= 8) return 'from-yellow-500 to-yellow-600';
  if (numValue <= 13) return 'from-orange-500 to-orange-600';
  return 'from-red-500 to-red-600';
}

/**
 * Calculate team estimation statistics
 */
export function calculateEstimationStats(estimates: number[]) {
  if (estimates.length === 0) return null;

  const sortedEstimates = [...estimates].sort((a, b) => a - b);
  const sum = estimates.reduce((acc, val) => acc + val, 0);

  return {
    min: sortedEstimates[0]!,
    max: sortedEstimates[sortedEstimates.length - 1]!,
    average: Math.round((sum / estimates.length) * 10) / 10,
    median: sortedEstimates.length % 2 === 0
      ? ((sortedEstimates[sortedEstimates.length / 2 - 1] ?? 0) + (sortedEstimates[sortedEstimates.length / 2] ?? 0)) / 2
      : sortedEstimates[Math.floor(sortedEstimates.length / 2)]!,
    consensus: sortedEstimates.every(val => val === sortedEstimates[0])
  };
}
