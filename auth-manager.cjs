#!/usr/bin/env node

// 90-Day Authentication Manager for Short Term Rental MCP
const fs = require('fs');
const https = require('https');
const path = require('path');
require('dotenv').config();

const {
  NEST_CLIENT_ID,
  NEST_CLIENT_SECRET
} = process.env;

const TOKEN_FILE = './oauth-tokens.json';
const BACKUP_DIR = './auth-backups';

class AuthManager {
  constructor() {
    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
  }

  loadTokens() {
    try {
      const tokenData = fs.readFileSync(TOKEN_FILE, 'utf8');
      return JSON.parse(tokenData);
    } catch (error) {
      throw new Error(`Failed to load tokens: ${error.message}`);
    }
  }

  saveTokens(tokens) {
    // Save main token file
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
    
    // Create backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `tokens-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(tokens, null, 2));
    
    console.log(`✅ Tokens saved and backed up to ${backupFile}`);
  }

  isTokenExpired(tokens) {
    const obtainedAt = new Date(tokens.obtained_at);
    const expiresAt = new Date(obtainedAt.getTime() + (tokens.expires_in * 1000));
    const now = new Date();
    
    // Consider expired if less than 5 minutes remaining
    const bufferTime = 5 * 60 * 1000; // 5 minutes in ms
    return (expiresAt.getTime() - now.getTime()) < bufferTime;
  }

  getTokenAge(tokens) {
    const obtainedAt = new Date(tokens.obtained_at);
    const now = new Date();
    const ageMs = now.getTime() - obtainedAt.getTime();
    const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    const ageHours = Math.floor((ageMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days: ageDays, hours: ageHours, totalMs: ageMs };
  }

  async refreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
      const tokenData = new URLSearchParams({
        client_id: NEST_CLIENT_ID,
        client_secret: NEST_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      });

      const options = {
        hostname: 'www.googleapis.com',
        path: '/oauth2/v4/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': tokenData.toString().length
        }
      };

      console.log('🔄 Refreshing access token...');

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const tokenResponse = JSON.parse(data);
            if (tokenResponse.access_token) {
              const newTokens = {
                access_token: tokenResponse.access_token,
                refresh_token: tokenResponse.refresh_token || refreshToken, // Keep old refresh token if new one not provided
                expires_in: tokenResponse.expires_in,
                token_type: tokenResponse.token_type,
                obtained_at: new Date().toISOString()
              };
              
              resolve(newTokens);
            } else {
              reject(new Error(`Token refresh failed: ${JSON.stringify(tokenResponse)}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse token response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Token refresh request failed: ${error.message}`));
      });

      req.write(tokenData.toString());
      req.end();
    });
  }

  async ensureValidToken() {
    try {
      let tokens = this.loadTokens();
      const age = this.getTokenAge(tokens);
      
      console.log(`📊 Current token age: ${age.days} days, ${age.hours} hours`);
      
      if (this.isTokenExpired(tokens)) {
        console.log('🔄 Token expired, refreshing...');
        tokens = await this.refreshToken(tokens.refresh_token);
        this.saveTokens(tokens);
        console.log('✅ Token successfully refreshed');
      } else {
        const remainingMs = (tokens.expires_in * 1000) - (new Date().getTime() - new Date(tokens.obtained_at).getTime());
        const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
        console.log(`✅ Token still valid for ${remainingMinutes} minutes`);
      }
      
      return tokens;
    } catch (error) {
      throw new Error(`Token management failed: ${error.message}`);
    }
  }

  async setupCronJob() {
    console.log('\n📅 Setting up automated token refresh...');
    
    const cronScript = `#!/bin/bash
# Short Term Rental MCP - Token Refresh Cron Job
cd "${process.cwd()}"
node auth-manager.js refresh >> auth-refresh.log 2>&1
`;

    fs.writeFileSync('./refresh-tokens.sh', cronScript);
    fs.chmodSync('./refresh-tokens.sh', '755');
    
    console.log('✅ Created refresh-tokens.sh script');
    console.log('\n📋 To setup automated refresh, add this to your crontab:');
    console.log('   Run: crontab -e');
    console.log('   Add: 0 */6 * * * /path/to/refresh-tokens.sh');
    console.log('   (This runs every 6 hours)');
    
    return './refresh-tokens.sh';
  }

  async checkRefreshTokenHealth() {
    try {
      const tokens = this.loadTokens();
      
      // Test refresh token by attempting to refresh
      console.log('🧪 Testing refresh token health...');
      const newTokens = await this.refreshToken(tokens.refresh_token);
      
      console.log('✅ Refresh token is healthy and working');
      
      // Save the refreshed tokens
      this.saveTokens(newTokens);
      
      return true;
    } catch (error) {
      console.error('❌ Refresh token health check failed:', error.message);
      return false;
    }
  }

  getAuthStatus() {
    try {
      const tokens = this.loadTokens();
      const age = this.getTokenAge(tokens);
      const isExpired = this.isTokenExpired(tokens);
      
      return {
        hasTokens: true,
        age: age,
        isExpired: isExpired,
        hasRefreshToken: !!tokens.refresh_token,
        tokenType: tokens.token_type,
        obtainedAt: tokens.obtained_at
      };
    } catch (error) {
      return {
        hasTokens: false,
        error: error.message
      };
    }
  }

  async cleanupOldBackups(daysToKeep = 30) {
    const backupFiles = fs.readdirSync(BACKUP_DIR);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    let cleanedCount = 0;
    
    for (const file of backupFiles) {
      if (file.startsWith('tokens-') && file.endsWith('.json')) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      }
    }
    
    console.log(`🧹 Cleaned up ${cleanedCount} old token backups (older than ${daysToKeep} days)`);
  }
}

// Command line interface
async function main() {
  const authManager = new AuthManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'status':
      console.log('📊 Authentication Status Check');
      console.log('================================');
      const status = authManager.getAuthStatus();
      console.log(JSON.stringify(status, null, 2));
      break;
      
    case 'refresh':
      console.log('🔄 Manual Token Refresh');
      console.log('========================');
      await authManager.ensureValidToken();
      break;
      
    case 'test':
      console.log('🧪 Refresh Token Health Check');
      console.log('==============================');
      const isHealthy = await authManager.checkRefreshTokenHealth();
      process.exit(isHealthy ? 0 : 1);
      break;
      
    case 'setup':
      console.log('⚙️  Setting up 90-Day Authentication');
      console.log('=====================================');
      await authManager.ensureValidToken();
      await authManager.setupCronJob();
      await authManager.cleanupOldBackups();
      console.log('\n🎉 90-day authentication setup complete!');
      break;
      
    case 'cleanup':
      console.log('🧹 Cleaning up old backups...');
      await authManager.cleanupOldBackups();
      break;
      
    default:
      console.log('🏠 Short Term Rental MCP - Authentication Manager');
      console.log('=================================================');
      console.log('');
      console.log('Commands:');
      console.log('  status   - Check current authentication status');
      console.log('  refresh  - Manually refresh access token');
      console.log('  test     - Test refresh token health');
      console.log('  setup    - Complete 90-day authentication setup');
      console.log('  cleanup  - Clean up old token backups');
      console.log('');
      console.log('Usage: node auth-manager.js [command]');
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = AuthManager;
