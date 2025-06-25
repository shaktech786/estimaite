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
- **Session Management**: Automatic room cleanup and moderator controls
- **Multi-device Support**: Seamless experience across desktop and mobile

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Accessibility**: Full keyboard navigation and screen reader support
- **Professional Interface**: Clean, modern design with smooth transitions
- **Dark/Light Themes**: Adaptive design for various preferences

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **Real-time**: Socket.io for WebSocket communication
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
│   └── useSocket.ts                     # Socket hook
├── lib/
│   └── utils.ts                         # Utilities
├── pages/api/
│   └── socket.ts                        # Socket.io server
└── types/
    └── index.ts                         # Type definitions
```


## 🧹 Project Maintenance

### Clean Architecture
- **No Build Artifacts**: All temporary build files are properly gitignored
- **No Empty Files**: All placeholder and empty files have been removed
- **Organized Structure**: Files are logically organized following Next.js 15 conventions
- **Type Safety**: Full TypeScript coverage with strict type checking

## 🚀 Getting Started
- Use `npm run dev` for development server
- Follow the established component structure in `/src/components/`
- All API routes are in `/src/app/api/` using Next.js App Router
- Socket.io server is set up in `/src/pages/api/socket.ts` for compatibility


### Prerequisites
- Node.js 22.x or later
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd estimAIte
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your OpenAI API key:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Creating a Room
1. Enter a room name and your name on the homepage
2. Click "Create Room" to generate a unique room code
3. Share the room code with your team members

### Joining a Room
1. Enter the room code provided by the moderator
2. Add your name and click "Join Room"
3. Start collaborating on story estimation

### Running Estimation Sessions
1. **Moderator submits a user story** with title, description, and acceptance criteria
2. **AI analyzes the story** and provides complexity assessment and suggestions
3. **Team members submit estimates** using the planning poker cards
4. **Reveal estimates** when all participants are ready
5. **Discuss and re-estimate** if needed

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Commit your changes: \`git commit -m 'Add amazing feature'\`
4. Push to the branch: \`git push origin feature/amazing-feature\`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- OpenAI for AI capabilities
- Tailwind CSS for the beautiful styling system
- Socket.io for real-time communication
- The agile community for inspiration

## 🔮 Roadmap

- [ ] Advanced AI insights and recommendations
- [ ] Integration with popular project management tools
- [ ] Enhanced accessibility features
- [ ] Performance optimizations
- [ ] Extended customization options

---

Built with ❤️ for agile teams worldwide
