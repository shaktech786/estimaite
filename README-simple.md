# EstimAIte - AI-Enhanced Planning Poker

> Modern planning poker with AI analysis for agile teams

## 🚀 Quick Start

```bash
npm install
cp .env.local.example .env.local  # Add your OpenAI API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✨ Features

- **🤖 AI Story Analysis** - Get complexity insights and estimation suggestions
- **⚡ Real-time Collaboration** - WebSocket-powered live sessions  
- **🔒 Privacy-First** - No data storage, temporary sessions only
- **📱 Mobile-Ready** - Responsive design with touch support
- **♿ Accessible** - Full keyboard navigation and screen reader support

## 🛠 Development

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run type-check   # TypeScript validation
npm run lint         # Code quality check
```

## 🏗 Tech Stack

**Framework**: Next.js 15 + TypeScript  
**UI**: ShakUI component library + Tailwind CSS  
**Real-time**: Pusher WebSockets  
**AI**: OpenAI API integration  
**Deployment**: Vercel-ready

## 📚 More Info

For creating similar projects, see the [bootstrap prompt](../shakgpt/PROJECT_BOOTSTRAP_PROMPT.md)

## 📄 License

MIT © ShakGPT
