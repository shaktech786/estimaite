# Vercel Environment Variables Setup

## ⚠️ **Security Notice**
Replace all placeholder values below with your actual credentials. Never commit real API keys to version control.

## Required Environment Variables for Production

Set these in your Vercel Dashboard under Project Settings > Environment Variables:

### 1. OpenAI Configuration
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Pusher Configuration
```
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
```

### 3. Public Pusher Configuration (Client-side)
```
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

### 4. Node Environment
```
NODE_ENV=production
```

## 🔐 **Getting Your Actual Values**
Your actual environment variable values are stored in:
- **Development**: `.env.local` 
- **Production Reference**: `.env.production` (for copy/paste to Vercel)

> **Security Note**: Never commit `.env.production` to version control. It's included in `.gitignore`.

## Setting Environment Variables in Vercel

### Via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your EstimAIte project
3. Go to Settings > Environment Variables
4. Add each variable above with the values
5. Set them for Production environment

### Via Vercel CLI:
```bash
vercel env add OPENAI_API_KEY
vercel env add PUSHER_APP_ID
vercel env add PUSHER_KEY
vercel env add PUSHER_SECRET
vercel env add PUSHER_CLUSTER
vercel env add NEXT_PUBLIC_PUSHER_KEY
vercel env add NEXT_PUBLIC_PUSHER_CLUSTER
vercel env add NODE_ENV
```

## Deploy to Vercel

```bash
# If not already connected
vercel --prod

# Or if already connected
vercel --prod
```

## Verify Deployment

1. Check that all environment variables are set in Vercel Dashboard
2. Visit your deployed URL: https://estimaite.vercel.app
3. Test creating and joining rooms
4. Test real-time features (participants joining, estimates, etc.)
5. Test AI story analysis

## Migration Complete! 🎉

Your EstimAIte app now uses:
- ✅ Pusher for real-time communication (Vercel compatible)
- ✅ OpenAI for AI story analysis
- ✅ In-memory room management (auto-cleanup)
- ✅ Mobile-responsive design
- ✅ Production-ready configuration
