# 🚀 Deployment Guide for EstimAIte

## Prerequisites
- Personal GitHub account
- Vercel account (free tier available)
- OpenAI API key (for AI features)

## Step-by-Step Deployment

### 1. Push to Your Personal GitHub

```bash
# Add your personal GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/estimaite.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   Add these environment variables in Vercel:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=production
   ```

3. **Deploy Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. Custom Domain (Optional)
- Add your custom domain in Vercel dashboard
- Configure DNS settings as instructed

## Environment Variables

### Required
- `OPENAI_API_KEY`: Your OpenAI API key for AI story analysis

### Optional
- `RATE_LIMIT_MAX`: API rate limit (default: 100)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window (default: 15 minutes)

## Performance Optimizations

The app is optimized for Vercel with:
- Static generation for homepage
- Dynamic imports for heavy components
- Edge API routes for better performance
- Optimized bundle size with tree-shaking

## Monitoring

After deployment, monitor:
- API response times
- WebSocket connection stability
- OpenAI API usage and costs
- User engagement metrics

## Troubleshooting

### Common Issues
1. **WebSocket Connection Issues**: Ensure Vercel supports WebSocket connections
2. **API Rate Limits**: Monitor OpenAI usage and implement caching
3. **Build Failures**: Check Node.js version compatibility

### Support
- Check Vercel deployment logs
- Review Next.js build output
- Monitor browser console for client-side errors
