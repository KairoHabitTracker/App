#!/bin/bash
# Quick test setup script

cd "$(dirname "$0")" || exit 1

echo "🧹 Cleaning Jest cache..."
npx jest --clearCache

echo "📦 Installing dependencies (if needed)..."
npm install

echo "🧪 Running tests..."
npm run test

