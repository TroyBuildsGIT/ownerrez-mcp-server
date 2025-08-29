#!/bin/bash

# Global CLI Installation Script for OwnerRez Short Term Rental CLI

echo "🏠 Installing Short Term Rental CLI globally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the CLI tool
echo "🔨 Building CLI tool..."
npm run build

# Install globally
echo "🌍 Installing CLI tool globally..."
npm link

echo "✅ Short Term Rental CLI installed successfully!"
echo ""
echo "🚀 Usage:"
echo "  short-term-rental --help"
echo "  short-term-rental properties list"
echo "  short-term-rental bookings list"
echo ""
echo "📝 Don't forget to configure your .env file with OwnerRez API credentials!"
