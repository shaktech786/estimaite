# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Development:
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm start` - Start production server

Code quality:
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically  
- `npm run type-check` - Run TypeScript type checking
- `npm run check` - Run type-check, lint, and tests in sequence

Testing:
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:watch` - Run tests in explicit watch mode
- `npm run test:ui` - Run tests with Vitest UI

Utilities:
- `npm run clean` - Remove .next and out directories
- `npm run analyze` - Bundle analysis

## Architecture

This is a Next.js 15 (App Router) application for AI-enhanced planning poker estimation sessions. Key architectural components:

### Core Technologies
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **React 19** with modern patterns
- **Tailwind CSS 4** for styling
- **Vitest** for testing with Testing Library
- **AI SDK** by Vercel with OpenAI integration
- **Pusher** for real-time WebSocket communication

### Application Structure

**Room Management (`src/lib/roomManager.ts`)**:
- In-memory room storage for serverless deployment
- Handles participant management, story tracking, estimation flow
- Auto-cleanup of expired rooms (30min timeout)
- Supports reconnection scenarios and session management

**Real-time Communication**:
- Pusher WebSocket integration for live collaboration
- Event-driven architecture with typed client/server events
- Room-based channels for isolated estimation sessions

**AI Analysis (`src/app/api/ai/analyze-story/route.ts`)**:
- OpenAI integration for story complexity analysis
- Provides estimation suggestions and reasoning
- Structured analysis with complexity scoring and recommendations

**Core Types (`src/types/index.ts`)**:
- Comprehensive TypeScript interfaces for all data structures
- Covers rooms, participants, stories, estimates, and AI analysis
- Includes Pusher event types and API response shapes

### Key Features
- **Planning Poker**: Standard Fibonacci estimation cards (1,2,3,5,8,13,21,?)
- **AI Enhancement**: Story analysis with complexity assessment and point suggestions
- **Real-time Sync**: Live participant updates, estimation reveal, timer functionality
- **Session Management**: Room recovery, duplicate participant handling, moderator assignment
- **Responsive Design**: Mobile-optimized with PWA capabilities

### Testing Strategy
- Component tests for UI elements (`src/test/components/`)
- Unit tests for core logic (`src/test/roomManager.test.ts`, `src/test/utils.test.ts`)
- Integration tests for multi-session scenarios
- Vitest configuration with jsdom environment

### Environment Setup
- Requires OpenAI API key for AI story analysis
- Pusher credentials for real-time functionality
- Node.js 22.x and npm >=10.0.0

The application uses a serverless-friendly architecture with in-memory state management and automatic cleanup, designed for deployment on Vercel.