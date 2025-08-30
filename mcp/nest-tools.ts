import * as fs from 'fs';
import * as https from 'https';
import * as dotenv from 'dotenv';
dotenv.config();

const {
  NEST_PROJECT_ID,
  NEST_CLIENT_ID,
  NEST_CLIENT_SECRET
} = process.env;

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  obtained_at: string;
}

// Load tokens from file
function loadTokens(): TokenData | null {
  try {
    const tokenFile = fs.readFileSync('./oauth-tokens.json', 'utf8');
    return JSON.parse(tokenFile);
  } catch (error) {
    console.error('Failed to load tokens:', error);
    return null;
  }
}

// Check if token is expired
function isTokenExpired(tokens: TokenData): boolean {
  const obtainedAt = new Date(tokens.obtained_at);
  const expiresAt = new Date(obtainedAt.getTime() + (tokens.expires_in * 1000));
  return new Date() >= expiresAt;
}

// Refresh access token
async function refreshToken(refreshToken: string): Promise<TokenData | null> {
  return new Promise((resolve, reject) => {
    const tokenData = new URLSearchParams({
      client_id: NEST_CLIENT_ID!,
      client_secret: NEST_CLIENT_SECRET!,
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

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const tokenResponse = JSON.parse(data);
          if (tokenResponse.access_token) {
            const newTokens: TokenData = {
              access_token: tokenResponse.access_token,
              refresh_token: tokenResponse.refresh_token || refreshToken,
              expires_in: tokenResponse.expires_in,
              token_type: tokenResponse.token_type,
              obtained_at: new Date().toISOString()
            };
            
            // Save refreshed tokens
            fs.writeFileSync('./oauth-tokens.json', JSON.stringify(newTokens, null, 2));
            resolve(newTokens);
          } else {
            reject(new Error('Failed to refresh token'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(tokenData.toString());
    req.end();
  });
}

// Get valid access token with automatic refresh
async function getValidToken(): Promise<string> {
  let tokens = loadTokens();
  if (!tokens) {
    throw new Error('No tokens available. Please run OAuth flow first.');
  }

  if (isTokenExpired(tokens)) {
    console.log('🔄 Token expired, auto-refreshing...');
    tokens = await refreshToken(tokens.refresh_token);
    if (!tokens) {
      throw new Error('Failed to refresh token');
    }
    console.log('✅ Token automatically refreshed');
  }

  return tokens.access_token;
}

// Make authenticated request to Nest API
async function nestRequest(path: string, method: string = 'GET', body?: any): Promise<any> {
  const accessToken = await getValidToken();
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'smartdevicemanagement.googleapis.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (data.trim() === '') {
            resolve({}); // Empty response for successful commands
          } else {
            resolve(JSON.parse(data));
          }
        } catch (error) {
          resolve({ raw: data }); // Return raw data if not JSON
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

export async function listDevices(): Promise<any> {
  try {
    const response = await nestRequest(`/v1/enterprises/${NEST_PROJECT_ID}/devices`);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          devices: response.devices || [],
          count: response.devices?.length || 0
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          error: error.message
        }, null, 2)
      }]
    };
  }
}

export async function getDevice(deviceId: string): Promise<any> {
  try {
    const response = await nestRequest(`/v1/${deviceId}`);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          device: response
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          error: error.message
        }, null, 2)
      }]
    };
  }
}

export async function setThermostatTemperature(deviceId: string, temperature: number, mode: 'heat' | 'cool' = 'cool'): Promise<any> {
  try {
    const command = mode === 'heat' 
      ? 'sdm.devices.commands.ThermostatTemperatureSetpoint.SetHeat'
      : 'sdm.devices.commands.ThermostatTemperatureSetpoint.SetCool';
    
    const params = mode === 'heat'
      ? { heatCelsius: temperature }
      : { coolCelsius: temperature };

    const response = await nestRequest(`/v1/${deviceId}:executeCommand`, 'POST', {
      command,
      params
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          command: `Set ${mode} temperature to ${temperature}°C`,
          response
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          error: error.message
        }, null, 2)
      }]
    };
  }
}

export async function setThermostatMode(deviceId: string, mode: 'HEAT' | 'COOL' | 'HEATCOOL' | 'OFF'): Promise<any> {
  try {
    const response = await nestRequest(`/v1/${deviceId}:executeCommand`, 'POST', {
      command: 'sdm.devices.commands.ThermostatMode.SetMode',
      params: { mode }
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          command: `Set thermostat mode to ${mode}`,
          response
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          error: error.message
        }, null, 2)
      }]
    };
  }
}

export async function setThermostatRange(deviceId: string, heatCelsius: number, coolCelsius: number): Promise<any> {
  try {
    const response = await nestRequest(`/v1/${deviceId}:executeCommand`, 'POST', {
      command: 'sdm.devices.commands.ThermostatTemperatureSetpoint.SetRange',
      params: { heatCelsius, coolCelsius }
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          command: `Set temperature range: ${heatCelsius}°C - ${coolCelsius}°C`,
          response
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          error: error.message
        }, null, 2)
      }]
    };
  }
}
