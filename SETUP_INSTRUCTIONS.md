# EstimAIte Setup Instructions

This document provides step-by-step instructions for setting up the EstimAIte project - an AI-Enhanced Planning Poker application built with Next.js 15 App Router.

## Prerequisites

- Node.js v22.x or v23.x
- npm v10.0.0 or higher

## Setup Steps

### 1. Clone the Repository (already done)

The project is already present in your workspace.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
# Pusher config
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster

# Client-side Pusher config
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster

# OpenAI API config for AI features
OPENAI_API_KEY=your_openai_key
```

#### How to Get These Values:

1. **Pusher Credentials**:
   - Sign up or log in to [Pusher](https://pusher.com/)
   - Create a new Channels app
   - Copy the app_id, key, secret, and cluster values to your `.env.local` file
   - Use the same key and cluster for both server-side and client-side variables

2. **OpenAI API Key**:
   - Sign up or log in to [OpenAI](https://platform.openai.com/)
   - Create an API key
   - Copy the key to your `.env.local` file

### 4. Start Development Server

```bash
npm run dev
```

This will start the development server with Turbopack enabled, which should be faster than the standard Next.js development server.

### 5. Open in Browser

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project follows the Next.js 15 App Router structure:

- `src/app/` - Next.js App Router components and pages
- `src/app/api/` - API routes for room management and AI analysis
- `src/app/room/[roomId]/` - Dynamic room pages
- `src/components/` - Reusable React components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and libraries
- `src/types/` - TypeScript type definitions

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Check TypeScript types
- `npm test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run check` - Run type-check, lint, and tests

## Project Features

- 🤖 **AI-Powered Features**: Intelligent story analysis, pattern recognition, and complexity detection
- 🔒 **Privacy & Security**: No data storage, secure sessions, and input sanitization
- ⚡ **Real-time Collaboration**: WebSocket integration with Pusher for instant synchronization
- 🎨 **Modern UI/UX**: Responsive design with beautiful animations and accessibility support

## Notes

- The application uses in-memory storage, so all data is temporary and will be lost on server restart
- There is no authentication required, but sessions are managed securely
- The AI features require a valid OpenAI API key to function properly
