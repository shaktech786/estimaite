# EstimAIte Quick Start Guide

## 🤖 GitHub Copilot Setup Prompt

Use GitHub Copilot in agentic mode to automatically set up and run EstimAIte. To access agentic mode, open the GitHub Copilot Chat panel in VS Code (Ctrl+Shift+I or Cmd+Shift+I), then click the "Agentic" button in the top right of the chat panel.

Copy and paste the following prompt into the chat:

```
Help me set up and run the EstimAIte planning poker application. I need you to:
1. Check if I have Node.js v22+ and npm v10+ installed (install them if needed)
2. Set up a free Pusher account (https://pusher.com) to get API credentials
3. Create a .env.local file with my Pusher credentials and OpenAI API key
4. Install all dependencies from package.json
5. Run the development server
6. Open the application in my browser
7. Guide me through creating my first planning poker session

I want to use this for team estimation sessions where any team member can add a story (by title only), start votes, reveal estimates, and control the timer. This should be a real-time collaborative application where all participants can see updates instantly.

For AI features, I'll use my OpenAI API key to analyze story complexity and provide estimation suggestions. If I don't have one, please guide me through setting up alternatives or running without AI features.

After setup, I'll need to know how to:
- Share the room code with my team members
- Submit a user story with just a title
- Start the voting process
- Reveal estimates when everyone has voted
- Reset for the next estimation round
```

---

## 🚀 Manual Setup in 5 Minutes

### 1️⃣ Prerequisites

Ensure you have:
- Node.js v22.x or v23.x
- npm v10.0.0+

### 2️⃣ Configure Environment Variables

Create a `.env.local` file in the project root with:

```bash
# Pusher credentials (required for real-time features)
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster

# Client-side Pusher config
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster

# OpenAI API (required for AI features)
OPENAI_API_KEY=your_openai_key
```

### 3️⃣ Start Development Server

```bash
npm run dev
```

### 4️⃣ Open App

Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Using EstimAIte

### Create a New Room

1. Enter a room name
2. (Optional) Enter your name (defaults to "Anonymous")
3. Click "Create Room"

### Join an Existing Room

1. Enter the 8-character room code
2. Enter your name
3. Click "Join Room"

### Using EstimAIte

In this collaborative environment, anyone can:

1. Submit a story title or JIRA ID for estimation
2. Start or control the voting timer
3. Select an estimation card
4. Reveal estimates after voting
5. Reset for the next estimation round

The simplified flow lets everyone contribute to the estimation process without unnecessary restrictions.

## ⚡ Key Features

- **Real-time Collaboration**: All actions are instantly visible to all participants
- **AI Story Analysis**: Get automatic complexity assessments and recommendations
- **Mobile-friendly**: Use on any device with a responsive interface
- **No Account Required**: Just create or join a room to get started

## 🔧 Troubleshooting

- **Room doesn't exist**: Double-check the room code (case sensitive)
- **WebSocket connection issues**: Verify Pusher credentials in .env.local
- **AI analysis not working**: Check your OpenAI API key and rate limits

## 📝 Command Reference

- `npm run dev` - Start development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm start` - Run production build
