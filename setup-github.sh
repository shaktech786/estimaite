#!/bin/bash

# EstimAIte GitHub Setup Script
# Run this script to set up your personal GitHub repository

echo "🚀 EstimAIte GitHub Setup"
echo "========================="
echo ""

# Get GitHub username
read -p "Enter your personal GitHub username: " github_username
read -p "Enter repository name (default: estimaite): " repo_name

# Set default repo name if empty
if [ -z "$repo_name" ]; then
  repo_name="estimaite"
fi

echo ""
echo "Setting up repository: https://github.com/$github_username/$repo_name"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the EstimAIte project root directory"
  exit 1
fi

# Create GitHub repository URL
remote_url="https://github.com/$github_username/$repo_name.git"

# Add remote origin
echo "📡 Adding GitHub remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "$remote_url"

# Rename branch to main
echo "🌿 Setting main branch..."
git branch -M main

echo ""
echo "✅ Git repository configured!"
echo ""
echo "Next steps:"
echo "1. Create the repository on GitHub: https://github.com/new"
echo "   - Repository name: $repo_name"
echo "   - Make it public or private (your choice)"
echo "   - Don't initialize with README (we already have files)"
echo ""
echo "2. Push your code:"
echo "   git push -u origin main"
echo ""
echo "3. Deploy on Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Add environment variables (see DEPLOYMENT.md)"
echo ""
echo "🎉 Happy coding!"
