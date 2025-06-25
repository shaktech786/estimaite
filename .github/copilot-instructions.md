<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# EstimAIte - AI-Enhanced Planning Poker

This is a modern Next.js 15 App Router application for planning poker with AI enhancements.

## Project Guidelines

### Architecture
- Use Next.js 15 App Router with TypeScript
- Implement real-time features with Pusher
- Use Tailwind CSS for styling with focus on accessibility
- Follow atomic design principles for components
- Implement proper error boundaries and loading states

### AI Features to Implement
- Story complexity analysis using natural language processing
- Estimation suggestions based on story content
- Historical pattern recognition (temporary session-based only)
- Real-time sentiment analysis during discussions
- Automated story point recommendations

### Security & Privacy
- No persistent data storage - all data is temporary
- Implement rate limiting for API endpoints
- Sanitize all user inputs
- Use secure WebSocket connections
- No authentication required but implement session-based room access

### Code Quality
- Use TypeScript strictly with proper type definitions
- Implement proper error handling and validation
- Write clean, maintainable code with proper separation of concerns
- Use React Server Components where appropriate
- Implement proper loading and error states

### UI/UX Guidelines
- Design should be professional, fun, and accessible
- Mobile-first responsive design
- Support for keyboard navigation
- Screen reader compatibility
- Clear visual feedback for all user actions
- Modern, clean interface with smooth animations

### Room Management
- Generate unique, temporary room codes
- Automatic room cleanup after inactivity
- Support for 3-12 participants per room
- Real-time synchronization of all participants
- Moderator controls for session management
