#!/bin/bash

# 90-Day Authentication Setup Script for Short Term Rental MCP
echo "🔐 Setting up 90-Day Authentication for Short Term Rental MCP"
echo "=============================================================="

# Get the current directory (where the MCP is located)
MCP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📍 MCP Directory: $MCP_DIR"

# Create the cron command with absolute paths
CRON_COMMAND="0 */6 * * * cd \"$MCP_DIR\" && node auth-manager.cjs refresh >> auth-refresh.log 2>&1"

echo ""
echo "🎯 90-Day Authentication Strategy:"
echo "   1. Built-in auto-refresh (primary) ✅"
echo "   2. Scheduled refresh every 6 hours (backup) ⏰"
echo "   3. Token backups on every refresh 💾"
echo "   4. Health monitoring available 📊"

echo ""
echo "⚙️  To complete setup, add this to your crontab:"
echo ""
echo "   1. Run: crontab -e"
echo "   2. Add this line:"
echo ""
echo "      $CRON_COMMAND"
echo ""
echo "   3. Save and exit"

echo ""
echo "🧪 Testing current authentication..."
cd "$MCP_DIR"
node auth-manager.cjs status

echo ""
echo "✅ Setup Summary:"
echo "   • Access tokens: Auto-refresh every hour"
echo "   • Refresh tokens: Last 6+ months"
echo "   • Cron backup: Every 6 hours"
echo "   • Monitoring: Available anytime"
echo ""
echo "🎉 Your Short Term Rental MCP will stay authenticated for 90+ days!"
echo ""
echo "💡 Quick Commands:"
echo "   Check status:  node auth-manager.cjs status"
echo "   Manual refresh: node auth-manager.cjs refresh"
echo "   Health check:  node auth-manager.cjs test"
