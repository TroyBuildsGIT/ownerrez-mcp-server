#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const {
  NEST_CLIENT_ID,
  NEST_CLIENT_SECRET,
  NEST_REDIRECT_URI
} = process.env;

// Authorization code from OAuth flow (from environment variable or hardcoded)
const authCode = process.env.AUTH_CODE || '4/0AVMBsJgoTGWzKbAorTu_NBDhdCv5BIN1is0dfHb-40Iq0tdZTXMHOBFZLdqJTT1LGMKp7Q';

console.log('🔄 Exchanging authorization code for 90-day access token...');
console.log(`📋 Code: ${authCode.substring(0, 20)}...`);

const tokenData = new URLSearchParams({
  client_id: NEST_CLIENT_ID,
  client_secret: NEST_CLIENT_SECRET,
  code: authCode,
  grant_type: 'authorization_code',
  redirect_uri: NEST_REDIRECT_URI,
  // Request offline access for long-lived refresh tokens
  access_type: 'offline'
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

const req = https.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const tokenResponse = JSON.parse(data);
      
      if (tokenResponse.access_token) {
        console.log('🎉 Successfully obtained 90-day access token!');
        console.log('📝 Token Info:');
        console.log(`   Access Token: ${tokenResponse.access_token.substring(0, 20)}...`);
        console.log(`   Expires In: ${tokenResponse.expires_in} seconds (${Math.round(tokenResponse.expires_in/3600)} hours)`);
        console.log(`   Token Type: ${tokenResponse.token_type}`);
        
        if (tokenResponse.refresh_token) {
          console.log(`   Refresh Token: ${tokenResponse.refresh_token.substring(0, 20)}...`);
          console.log('   🔄 Refresh token available for automatic renewal!');
        }
        
        // Calculate expiration date
        const expirationDate = new Date(Date.now() + (tokenResponse.expires_in * 1000));
        console.log(`   🗓️  Token expires: ${expirationDate.toLocaleDateString()} ${expirationDate.toLocaleTimeString()}`);
        
        // Save tokens to file with 90-day validity tracking
        const tokenFile = {
          access_token: tokenResponse.access_token,
          refresh_token: tokenResponse.refresh_token,
          expires_in: tokenResponse.expires_in,
          token_type: tokenResponse.token_type,
          obtained_at: new Date().toISOString(),
          expires_at: expirationDate.toISOString(),
          validity_days: Math.round(tokenResponse.expires_in / (24 * 3600)),
          note: "90-day OAuth token for Nest device control via MCP"
        };
        
        fs.writeFileSync('./oauth-tokens.json', JSON.stringify(tokenFile, null, 2));
        console.log('💾 Tokens saved to oauth-tokens.json');
        
        // Export for curl testing
        console.log('\n🚀 Ready for 90-day device testing!');
        console.log('Export this for curl commands:');
        console.log(`export NEST_ACCESS_TOKEN="${tokenResponse.access_token}"`);
        console.log(`export NEST_PROJECT_ID="${process.env.NEST_PROJECT_ID}"`);
        
        console.log('\n🏠 Test commands:');
        console.log('# List all devices:');
        console.log(`curl -H "Authorization: Bearer ${tokenResponse.access_token}" "https://smartdevicemanagement.googleapis.com/v1/enterprises/${process.env.NEST_PROJECT_ID}/devices"`);
        
      } else {
        console.error('❌ Failed to get access token:', tokenResponse);
      }
      
    } catch (error) {
      console.error('❌ Error parsing token response:', error);
      console.error('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.write(tokenData.toString());
req.end();
