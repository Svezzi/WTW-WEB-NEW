#!/bin/bash
set -e

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "Installing dependencies..."
npm install

echo "Disabling auth pages..."
node disable-auth.js

echo "Building Next.js application..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "Build completed successfully!" 