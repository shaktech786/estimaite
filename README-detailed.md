# EstimAIte - AI-Enhanced Planning Poker

A modern, AI-powered planning poker application built with Next.js 15 for agile teams. EstimAIte revolutionizes story estimation with intelligent analysis, real-time collaboration, and privacy-first design.

## 🚀 Features

### 🤖 AI-Powered Features
- **Intelligent Story Analysis**: Get complexity assessments and estimation suggestions
- **Pattern Recognition**: Learn from team estimation patterns (session-based)
- **Smart Recommendations**: AI-driven story point suggestions
- **Complexity Detection**: Automatic identification of challenging requirements

### 🔒 Privacy & Security
- **No Data Storage**: All sessions are temporary and ephemeral
- **No Authentication**: Quick access without signup requirements
- **Secure Sessions**: Rate-limited API endpoints and input sanitization
- **Privacy First**: No personal data collection or storage

### ⚡ Real-time Collaboration
- **WebSocket Integration**: Instant synchronization across all participants
- **Live Updates**: Real-time participant status and estimation progress
- **Session Management**: Automatic room cleanup and egalitarian access
- **Multi-device Support**: Seamless experience across desktop and mobile
- **Session-based Participants**: Each browser session maintains independent participant identity
- **Duplicate Prevention**: Robust protection against duplicate participants from the same session

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Accessibility**: Full keyboard navigation and screen reader support
- **Professional Interface**: Clean, modern design with smooth transitions
- **Dark/Light Themes**: Adaptive design for various preferences

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **Real-time**: Pusher for WebSocket communication
- **AI Integration**: OpenAI API for story analysis
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for smooth interactions

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/
│   │   ├── ai/analyze-story/route.ts    # AI story analysis
│   │   └── rooms/route.ts               # Room management
│   ├── room/[roomId]/page.tsx           # Room page
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Homepage
├── components/
│   ├── EstimationCards.tsx              # Poker cards
│   ├── Logo.tsx                         # App logo
│   ├── ParticipantList.tsx              # Participants
│   └── StoryForm.tsx                    # Story form
├── hooks/
│   └── usePusher.ts                     # Pusher hook
├── lib/
│   └── utils.ts                         # Utilities
├── pages/api/
│   └── pusher/                          # Pusher API routes
└── types/
    └── index.ts                         # Type definitions
```


## 🧹 Project Maintenance

### Clean Architecture
- **No Build Artifacts**: All temporary build files are properly gitignored
- **No Empty Files**: All placeholder and empty files have been removed
- **Organized Structure**: Files are logically organized following Next.js 15 conventions
- **Type Safety**: Full TypeScript coverage with strict type checking

### Session Management
- **Session-based Participants**: Each browser session (normal, incognito, different browsers) gets a unique session ID
- **Duplicate Prevention**: Multiple safeguards prevent duplicate participants from single user joins
- **Automatic Cleanup**: Stale participants are automatically removed when sessions reconnect
- **Cross-session Support**: Multiple participants with the same name are distinguished with session indicators

### Testing
- **Comprehensive Test Suite**: 45+ tests covering all functionality using Vitest
- **Component Testing**: React components tested with Testing Library
- **Integration Testing**: Room management and API endpoints fully tested
- **Multi-session Testing**: Specific tests for session-based participant management

## 🚀 Getting Started

### Prerequisites
- Node.js 22.x or later
- npm 10.0.0 or later

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd estimaite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the project root with the following:
   
   ```bash
   # Environment configuration for local development
   NODE_ENV="development"
   
   # Pusher configuration (required for real-time features)
   PUSHER_APP_ID="your_pusher_app_id"
   PUSHER_KEY="your_pusher_key"
   PUSHER_SECRET="your_pusher_secret"
   PUSHER_CLUSTER="your_pusher_cluster"
   
   # Client-side Pusher config
   NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
   NEXT_PUBLIC_PUSHER_CLUSTER="your_pusher_cluster"
   
   # OpenAI API configuration for AI features
   OPENAI_API_KEY="your_openai_api_key"
   
   # Local development settings
   PORT=3000
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```
   
   **Using Vercel CLI (recommended):**
   ```bash
   # Install Vercel CLI globally if you haven't
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link your project (if not already linked)
   vercel link
   
   # Pull environment variables
   vercel env pull .env.local
   ```
   
   **Note:** If using env vars from Vercel for local development, change `NODE_ENV` to "development".

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000) in your browser (or the port shown in your terminal, e.g., http://localhost:3002).

### Verifying Setup

To verify your setup is working correctly:

1. Visit the local URL shown in your terminal (typically http://localhost:3000) - You should see the homepage
2. Create a new planning room
3. Try creating or joining a room
4. Check that real-time updates work when using multiple browser windows
5. Verify AI analysis works when submitting a user story

### Troubleshooting

If you encounter issues:

#### Application Won't Start
- Check if another process is using the default port (Next.js will automatically select an alternative port)
- Ensure Node.js version 22.x+ is installed (`node --version`)
- Try clearing the Next.js cache: `npm run clean`

#### Real-time Features Not Working
- Verify Pusher credentials in `.env.local` 
- Check browser console for WebSocket connection errors
- Ensure all Pusher variables are correctly set (both server and client side)

#### AI Analysis Features Not Working
- Verify your OpenAI API key is valid
- Check API rate limits or quotas in OpenAI dashboard
- Look for API errors in the server logs

#### Page Not Found or Styling Issues
- Ensure that Tailwind CSS is properly initialized
- Check for JavaScript errors preventing the app from rendering
- Try a hard refresh to clear browser cache (Ctrl+F5)

### Available Commands
- `npm run dev` - Start development server with Turbopack
- `npm test` - Run test suite with Vitest
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Check code for style issues
- `npm run type-check` - Verify TypeScript types
- `npm run check` - Run type-check, lint, and tests

## 🎯 Usage

### Creating a Room
1. Enter a room name and your name on the homepage
2. Click "Create Room" to generate a unique 4-digit room code
3. Share the room code with your team members

### Joining a Room
1. Enter the 4-digit room code provided by another participant
2. Add your name and click "Join Room"
3. Start collaborating on story estimation

### Running Estimation Sessions
1. **Any user submits a user story** with just a title
2. **AI analyzes the story** and provides complexity assessment and suggestions
3. **Team members submit estimates** using the planning poker cards (2-minute timer)
4. **Votes automatically reveal** when everyone has voted
5. **Discuss and re-estimate** if needed by clicking Reset

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Security Notice

This project follows security best practices for credential management:

- All API keys and secrets are managed through environment variables
- No sensitive data is stored persistently
- Environment variables are never committed to the repository
- All user inputs are properly sanitized
- API endpoints are rate-limited

For production deployment, configure all environment variables through your hosting platform (e.g., Vercel).
- ✅ Automatic session cleanup
- ✅ Input validation and sanitization  
- ✅ Rate limiting on API endpoints
- ✅ Secure environment variable handling
- ✅ Privacy-first design (no user tracking)

---

Built with ❤️ for agile teams worldwide
