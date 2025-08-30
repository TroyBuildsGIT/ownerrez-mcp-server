#!/bin/bash
# Short Term Rental MCP - Token Refresh Cron Job
cd "/Users/troy/Desktop/Short Term Rental MCP"
node auth-manager.cjs refresh >> auth-refresh.log 2>&1
