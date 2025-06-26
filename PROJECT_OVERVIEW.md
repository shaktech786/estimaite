# EstimAIte Project Overview

## Introduction

EstimAIte is an AI-enhanced planning poker application built with Next.js 15, designed to make story estimation more efficient and accurate for agile teams. The application leverages artificial intelligence to analyze user stories, suggest complexity ratings, and provide estimation guidance.

## Core Components

### 1. Room Management System
The core of the application is the room management system, which allows users to create temporary rooms for planning poker sessions.

- **Room Creation**: Generates unique room codes
- **Participant Management**: Tracks participants joining/leaving the room
- **Session Persistence**: Maintains ephemeral session data
- **Automatic Cleanup**: Removes inactive rooms after 30 minutes

### 2. Real-Time Communication
The application uses Pusher for real-time WebSocket communication between participants.

- **Instant Updates**: All changes are broadcast to all room participants
- **Synchronized Estimation**: Participants see votes in real-time
- **Presence Channels**: Track active participants
- **Event Broadcasting**: Custom events for various room actions

### 3. AI Analysis Engine
The AI analysis capability uses OpenAI's API to provide intelligent insights about user stories.

- **Story Complexity Analysis**: Evaluates technical complexity
- **Estimation Suggestions**: Recommends story point values
- **Pattern Recognition**: Learns from the team's estimation patterns
- **Improvement Recommendations**: Suggests ways to clarify requirements

### 4. User Interface
The UI is designed to be clean, intuitive, and accessible, with a focus on mobile-first design.

- **Responsive Layout**: Works on all device sizes
- **Modern Design**: Clean, professional interface with animations
- **Accessible Controls**: Keyboard navigation and screen reader support
- **Interactive Cards**: Intuitive estimation card selection

## Data Flow

1. **Room Creation**:
   - User creates a room → API request to `/api/rooms`
   - Server generates a unique room ID and initializes room state
   - User is redirected to the room page

2. **Joining a Room**:
   - User enters room code → API validates the room exists
   - User provides their name → Added to room participants
   - Pusher event notifies all participants of new joiner

3. **Story Submission**:
   - Moderator submits a story → Stored in room state
   - Story is sent to AI for analysis → Results attached to story
   - Story and analysis distributed to all participants

4. **Estimation Process**:
   - Participants select point values → Recorded in room state
   - Votes remain hidden until reveal
   - Moderator reveals votes → Results shown to all participants
   - AI provides insights based on estimation patterns

## Implementation Details

### State Management
The application uses a serverless-compatible in-memory state model:

- **Room State**: Stored in a server-side Map
- **Participant State**: Tracked with unique IDs
- **Estimation Data**: Stored temporarily during sessions

### AI Integration
The OpenAI integration uses:

- **GPT-3.5/4**: For natural language understanding
- **Prompt Engineering**: Structured prompts for consistent analysis
- **JSON Response Format**: Standardized output for UI integration

### Security Measures
Security is implemented through:

- **Input Validation**: All user inputs are validated
- **Rate Limiting**: Prevents API abuse
- **No Persistent Storage**: All data is temporary
- **Secure WebSockets**: Using Pusher's security measures

## Technical Architecture

```
Client Request → Next.js App Router → API Routes → Room Manager → Pusher → All Clients
                     ↑                    ↓
                     |                AI Analysis
                     |                    ↓
                  Response ← ← ← ← ← ← Response
```

The application follows a clean architecture pattern with:

- **API Layer**: Handles HTTP requests and WebSocket events
- **Service Layer**: Business logic for room management
- **UI Components**: React components for user interface
- **Hooks**: Custom React hooks for shared functionality

## Getting Started

To start using the application:

1. Create a new room or join an existing one
2. Enter your participant name
3. As a moderator, submit stories for estimation
4. Choose estimation points for each story
5. Reveal and discuss the results
6. Use AI insights to refine your estimation process

The temporary nature of the rooms means there's no need to clean up - just close the browser when you're done.
