import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup()
})

// Mock environment variables for tests
process.env.NEXT_PUBLIC_PUSHER_KEY = 'test-key'
process.env.NEXT_PUBLIC_PUSHER_CLUSTER = 'us2'
process.env.PUSHER_APP_ID = 'test-app-id'
process.env.PUSHER_SECRET = 'test-secret'

// Mock Pusher for tests
vi.mock('pusher-js', () => ({
  default: vi.fn(() => ({
    subscribe: vi.fn(() => ({
      bind: vi.fn(),
      unbind_all: vi.fn(),
    })),
    unsubscribe: vi.fn(),
  })),
}))

vi.mock('pusher', () => ({
  default: vi.fn(() => ({
    trigger: vi.fn(),
  })),
}))
