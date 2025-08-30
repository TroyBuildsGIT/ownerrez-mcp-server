#!/usr/bin/env node

// Comprehensive Device Discovery for Yale Lock Integration
const https = require('https');
const fs = require('fs');

// Load OAuth tokens
let tokens = null;
try {
  tokens = JSON.parse(fs.readFileSync('./oauth-tokens.json', 'utf8'));
} catch (error) {
  console.error('❌ Failed to load OAuth tokens:', error.message);
  process.exit(1);
}

const NEST_PROJECT_ID = 'd7173b79-00e6-476e-9c3b-487a5f3047c2';

async function nestRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'smartdevicemanagement.googleapis.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
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
          resolve({ raw: data, status: res.statusCode }); // Return raw data if not JSON
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

function analyzeDevice(device) {
  const deviceType = device.type;
  const traits = Object.keys(device.traits || {});
  
  let category = 'unknown';
  let capabilities = [];
  let isLock = false;
  
  // Check for lock traits
  traits.forEach(trait => {
    if (trait.includes('LockUnlock')) {
      isLock = true;
      category = 'lock';
      capabilities.push('lock/unlock');
    }
    if (trait.includes('ThermostatMode')) {
      category = 'thermostat';
      capabilities.push('temperature_control');
    }
    if (trait.includes('CameraLiveStream')) {
      category = 'camera';
      capabilities.push('live_stream');
    }
    if (trait.includes('DoorbellChime')) {
      category = 'doorbell';
      capabilities.push('doorbell_chime');
    }
  });
  
  // Analyze device type
  if (deviceType.includes('THERMOSTAT')) category = 'thermostat';
  if (deviceType.includes('DOORBELL')) category = 'doorbell';
  if (deviceType.includes('CAMERA')) category = 'camera';
  if (deviceType.includes('DISPLAY')) category = 'display';
  
  return { category, capabilities, isLock, traits };
}

async function discoverAllDevices() {
  console.log('🔍 Yale Lock Discovery for Short Term Rental MCP');
  console.log('================================================\n');

  try {
    // Get all devices
    console.log('📱 Querying Google Device Access API...');
    const devices = await nestRequest(`/v1/enterprises/${NEST_PROJECT_ID}/devices`);
    
    if (!devices.devices) {
      console.log('❌ No devices found or API error');
      console.log('Response:', JSON.stringify(devices, null, 2));
      return;
    }

    console.log(`✅ Found ${devices.devices.length} device(s)\n`);

    const locks = [];
    const thermostats = [];
    const other = [];

    // Analyze each device
    devices.devices.forEach((device, index) => {
      const analysis = analyzeDevice(device);
      const customName = device.traits?.['sdm.devices.traits.Info']?.customName || `Device ${index + 1}`;
      
      console.log(`📱 Device ${index + 1}: ${customName}`);
      console.log(`   ID: ${device.name}`);
      console.log(`   Type: ${device.type}`);
      console.log(`   Category: ${analysis.category.toUpperCase()}`);
      console.log(`   Capabilities: ${analysis.capabilities.join(', ') || 'basic'}`);
      console.log(`   Available Traits: ${analysis.traits.join(', ')}`);
      
      if (analysis.isLock) {
        locks.push({
          name: customName,
          id: device.name,
          device: device,
          traits: analysis.traits
        });
        console.log(`   🔒 YALE LOCK DETECTED!`);
      } else if (analysis.category === 'thermostat') {
        thermostats.push({
          name: customName,
          id: device.name,
          device: device
        });
      } else {
        other.push({
          name: customName,
          id: device.name,
          category: analysis.category,
          device: device
        });
      }
      
      console.log('');
    });

    // Yale Lock Results
    console.log('🔒 Yale Lock Analysis Results:');
    console.log('===============================');
    
    if (locks.length > 0) {
      console.log(`✅ SUCCESS! Found ${locks.length} Yale lock(s):`);
      
      locks.forEach((lock, index) => {
        console.log(`\n🔐 Lock ${index + 1}: ${lock.name}`);
        console.log(`   Device ID: ${lock.id}`);
        console.log(`   Lock Traits: ${lock.traits.filter(t => t.includes('Lock')).join(', ')}`);
        
        // Generate lock control commands
        console.log(`\n   🛠️ Control Commands:`);
        console.log(`   Lock: curl -X POST -H "Authorization: Bearer ${tokens.access_token}" \\`);
        console.log(`     -H "Content-Type: application/json" \\`);
        console.log(`     -d '{"command": "sdm.devices.commands.LockUnlock.Lock", "params": {}}' \\`);
        console.log(`     "https://smartdevicemanagement.googleapis.com/v1/${lock.id}:executeCommand"`);
        
        console.log(`\n   Unlock: curl -X POST -H "Authorization: Bearer ${tokens.access_token}" \\`);
        console.log(`     -H "Content-Type: application/json" \\`);
        console.log(`     -d '{"command": "sdm.devices.commands.LockUnlock.Unlock", "params": {}}' \\`);
        console.log(`     "https://smartdevicemanagement.googleapis.com/v1/${lock.id}:executeCommand"`);
      });
      
      // Save lock device mapping for integration
      const lockMapping = locks.reduce((acc, lock, index) => {
        acc[`lock_${index + 1}`] = {
          id: lock.id,
          name: lock.name,
          location: `Property 2299 Richter - ${lock.name}`,
          type: 'yale_lock'
        };
        return acc;
      }, {});
      
      fs.writeFileSync('./yale-lock-mapping.json', JSON.stringify(lockMapping, null, 2));
      console.log(`\n💾 Yale lock mapping saved to yale-lock-mapping.json`);
      
    } else {
      console.log('❌ No Yale locks found in Google Device Access');
      console.log('\nTroubleshooting:');
      console.log('1. Ensure Yale locks are connected to Google Home app');
      console.log('2. Check if locks require additional OAuth scopes');
      console.log('3. Verify Device Access includes lock permissions');
      console.log('4. Consider alternative: Seam API for universal lock control');
    }

    // Summary
    console.log(`\n📊 Device Summary:`);
    console.log(`   Yale Locks: ${locks.length}`);
    console.log(`   Thermostats: ${thermostats.length}`);
    console.log(`   Other Devices: ${other.length}`);
    
    // Save complete device data
    const discoveryData = {
      timestamp: new Date().toISOString(),
      total_devices: devices.devices.length,
      yale_locks: locks,
      thermostats: thermostats,
      other_devices: other,
      raw_data: devices.devices
    };
    
    fs.writeFileSync('./device-discovery.json', JSON.stringify(discoveryData, null, 2));
    console.log(`\n💾 Complete discovery data saved to device-discovery.json`);

  } catch (error) {
    console.error('❌ Discovery failed:', error.message);
  }
}

// Run discovery
discoverAllDevices();
