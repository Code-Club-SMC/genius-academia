#!/usr/bin/env bash
set -e

# Guard: ensure PM2 is installed
command -v pm2 >/dev/null 2>&1 || { echo "❌ PM2 is not installed. Run: npm install -g pm2"; exit 1; }

echo "🚀 Genius Academia — Production Bootstrap"

# 1. Install root deps
echo "📦 Installing root dependencies..."
npm install --omit=dev

# 2. Install & build backend
echo "📦 Installing backend dependencies..."
cd backend && npm install --omit=dev && cd ..

# 3. Install & build frontend
echo "📦 Installing frontend dependencies and building..."
cd frontend && npm install && npm run build && cd ..

# 4. Create logs directory
mkdir -p logs

# 5. Stop only this project's PM2 processes (don't touch other apps)
pm2 delete ecosystem.config.js 2>/dev/null || true

# 6. Start via PM2 ecosystem
echo "🟢 Starting PM2 processes..."
pm2 start ecosystem.config.js

# 7. Save PM2 process list for auto-resurrection on reboot
pm2 save

echo "✅ All processes started. Run 'pm2 status' to verify."
